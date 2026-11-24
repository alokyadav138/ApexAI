
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const userId = req.user.id;

        let title = null;
        let chat = null;
        let activeChatId = chatId;

        // Create new chat if chatId is not provided
        if (!chatId) {

            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: userId,
                title
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

        // Fetch previous chat history
        const messages = await messageModel.find({
            chat: activeChatId || chat._id
        }).sort({ createdAt: 1 });

        // Save current user message
        const userMessage = await messageModel.create({
            chat: activeChatId,
            sender: userId,
            content: message,
            role: "user"
        });

        // Send previous history + current message to AI
        const conversation = [
            ...messages,
            userMessage
        ];

        const result = await generateResponse(conversation);

        // Save AI response
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            sender: userId,
            content: result,
            role: "ai"
        });

        return res.status(201).json({
            success: true,
            title: chat.title,
            chat,
            userMessage,
            aiMessage
        });

    } catch (error) {

        console.error("CHAT CONTROLLER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
}

export async function getChats(req, res) {
    const user= req.user

    const chats= await chatModel.find({user:user.id})

    return res.status(200).json({
        message:"Chats fetched successfully",
        chats
    })
}


export async function getMessages(req, res) {
    
    const {chatId}= req.params

    const chat= await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            success:false,
            message:"Chat not found"
        })
    }

    const messages= await messageModel.find({
        chat:chatId
    })

    res.status(200).json({
        success:true,
        messages
    })

}


export async function deleteChat(req, res) {
    const {chatId}= req.params

    const chat= await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })

    await messageModel.deleteMany({
        chat:chatId
    })
    if(!chat){
        return res.status(404).json({
            success:false,
            message:"Chat not found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Chat deleted successfully"
    })
}