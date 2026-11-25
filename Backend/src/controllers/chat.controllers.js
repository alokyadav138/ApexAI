import {
    generateResponseStream,
    generateChatTitle,
     analyzeImage
} from "../services/ai.service.js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import path from "path";

import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";



// EXTRACT TEXT FROM ATTACHMENTS
async function processAttachment(file, message) {
    if (!file) return null;

    const extension = path.extname(file.originalname).toLowerCase();

    let extractedText = "";

    if (extension === ".pdf") {
        const result = await pdf(file.buffer);
        extractedText = result.text;
    }

    else if (extension === ".docx") {
        const result = await mammoth.extractRawText({
            buffer: file.buffer
        });

        extractedText = result.value;
    }

    else if (extension === ".txt") {
        extractedText = file.buffer.toString("utf-8");
    }

    else if (
        [".jpg", ".jpeg", ".png"].includes(extension)
    ) {
        extractedText = await analyzeImage(
            file.buffer,
            file.mimetype,
            message
        );
    }

    if (!extractedText.trim()) {
        throw new Error("No readable content found in the attachment.");
    }

    return {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        extractedText: extractedText.slice(0, 30000)
    };
}


function setStreamHeaders(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();
}


function sendEvent(res, data) {
    if (!res.destroyed && !res.writableEnded) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}


// SEND MESSAGE WITH FILE ATTACHMENT + STREAMING
export async function sendMessage(req, res) {
    try {
        const message = req.body.message || "";
        const { chatId } = req.body;
        const file = req.file;

        if (!message.trim() && !file) {
            return res.status(400).json({
                success: false,
                message: "Message or attachment is required"
            });
        }

        const userId = req.user.id;

        const attachment = await processAttachment(file, message);

        const userPrompt = message.trim() ||
            `Please analyze the attached file: ${file.originalname}`;

        let chat;
        let activeChatId = chatId;

        if (!chatId) {
            const title = await generateChatTitle(userPrompt);

            chat = await chatModel.create({
                user: userId,
                title: title.trim()
            });

            activeChatId = chat._id;

        } else {
            chat = await chatModel.findOne({
                _id: chatId,
                user: userId
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }
        }

        const messages = await messageModel.find({
            chat: activeChatId
        }).sort({ createdAt: 1 });

        const conversation = messages.map(msg => ({
            role: msg.role,
            content: msg.role === "user" && msg.attachment?.extractedText
                ? `${msg.content}\n\nAttached file: ${msg.attachment.name}\n\nFile content:\n${msg.attachment.extractedText}`
                : msg.content
        }));

        let currentContent = userPrompt;

        if (attachment) {
            currentContent += `\n\nAttached file: ${attachment.name}\n\nFile content:\n${attachment.extractedText}`;
        }

        conversation.push({
            role: "user",
            content: currentContent
        });

        const userMessage = await messageModel.create({
            chat: activeChatId,
            sender: userId,
            content: userPrompt,
            role: "user",
            attachment: attachment || undefined
        });

        setStreamHeaders(res);

        sendEvent(res, {
            type: "metadata",
            chat,
            userMessage
        });

        let fullResponse = "";

        try {
            const stream = generateResponseStream(conversation);

            for await (const chunk of stream) {
                if (res.destroyed) return;

                fullResponse += chunk;

                sendEvent(res, {
                    type: "token",
                    content: chunk
                });
            }

            const aiMessage = await messageModel.create({
                chat: activeChatId,
                sender: userId,
                content: fullResponse,
                role: "ai"
            });

            await chatModel.findByIdAndUpdate(activeChatId, {
                $set: {
                    updatedAt: new Date()
                }
            });

            sendEvent(res, {
                type: "done",
                aiMessage
            });

            res.end();

        } catch (streamError) {
            console.error("STREAM ERROR:", streamError);

            sendEvent(res, {
                type: "error",
                message: streamError.message || "AI response failed"
            });

            res.end();
        }

    } catch (error) {
        console.error("CHAT CONTROLLER ERROR:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong"
            });
        }

        if (!res.destroyed && !res.writableEnded) {
            res.end();
        }
    }
}
// REGENERATE AI RESPONSE
export async function regenerateMessage(req, res) {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        const aiMessage = await messageModel.findById(messageId);

        if (!aiMessage || aiMessage.role !== "ai") {
            return res.status(404).json({
                success: false,
                message: "AI message not found"
            });
        }

        const chat = await chatModel.findOne({
            _id: aiMessage.chat,
            user: userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const messages = await messageModel.find({
            chat: aiMessage.chat,
            createdAt: { $lt: aiMessage.createdAt }
        }).sort({ createdAt: 1 });

       const conversation = messages.map(msg => ({
    role: msg.role,
    content: msg.role === "user" && msg.attachment?.extractedText
        ? `${msg.content}\n\nAttached file: ${msg.attachment.name}\n\nFile content:\n${msg.attachment.extractedText}`
        : msg.content
}));

        setStreamHeaders(res);

        sendEvent(res, {
            type: "metadata",
            chat,
            aiMessage
        });

        let fullResponse = "";

        try {
            const stream = generateResponseStream(conversation);

            for await (const chunk of stream) {
                if (res.destroyed) return;

                fullResponse += chunk;

                sendEvent(res, {
                    type: "token",
                    content: chunk
                });
            }

            const updatedMessage = await messageModel.findByIdAndUpdate(
                messageId,
                {
                    $set: {
                        content: fullResponse,
                        feedback: "none"
                    }
                },
                { new: true }
            );

            await chatModel.findByIdAndUpdate(chat._id, {
                $set: {
                    updatedAt: new Date()
                }
            });

            sendEvent(res, {
                type: "done",
                aiMessage: updatedMessage
            });

            res.end();

        } catch (streamError) {
            console.error("REGENERATE STREAM ERROR:", streamError);

            sendEvent(res, {
                type: "error",
                message: streamError.message || "Regeneration failed"
            });

            res.end();
        }

    } catch (error) {
        console.error("REGENERATE ERROR:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        if (!res.destroyed && !res.writableEnded) {
            res.end();
        }
    }
}


// LIKE / DISLIKE FEEDBACK
export async function updateMessageFeedback(req, res) {
    try {
        const { messageId } = req.params;
        const { feedback } = req.body;

        if (!["like", "dislike", "none"].includes(feedback)) {
            return res.status(400).json({
                success: false,
                message: "Invalid feedback"
            });
        }

        const message = await messageModel.findById(messageId);

        if (!message || message.role !== "ai") {
            return res.status(404).json({
                success: false,
                message: "AI message not found"
            });
        }

        const chat = await chatModel.findOne({
            _id: message.chat,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const updatedMessage = await messageModel.findByIdAndUpdate(
            messageId,
            { $set: { feedback } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Feedback updated",
            updatedMessage
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// GET ALL CHATS
export async function getChats(req, res) {
    try {
        const chats = await chatModel.find({
            user: req.user.id
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// GET MESSAGES
export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// DELETE CHAT
export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        await messageModel.deleteMany({
            chat: chatId
        });

        await chatModel.findByIdAndDelete(chatId);

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}