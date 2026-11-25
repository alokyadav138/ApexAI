import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

import {
    HumanMessage,
    SystemMessage,
    AIMessage
} from "@langchain/core/messages";


const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 1,
});

const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 1,
});


// Extract text
function extractText(content) {
    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .map(item =>
                typeof item === "string" ? item : item.text || ""
            )
            .join("");
    }

    return String(content ?? "");
}


// Format messages
function formatMessages(messages) {
    return messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }

        if (msg.role === "ai") {
            return new AIMessage(msg.content);
        }

        if (msg.role === "system") {
            return new SystemMessage(msg.content);
        }

        return null;

    }).filter(Boolean);
}


// Existing Gemini + Groq fallback
async function invokeWithFallback(messages) {

    const formattedMessages = formatMessages(messages);

    try {
        console.log("Trying Gemini API...");

        const response = await geminiModel.invoke(formattedMessages);

        console.log("Gemini response received!");

        return extractText(response.content);

    } catch (geminiError) {

        console.error("GEMINI FAILED:", geminiError.message);
        console.log("Switching to Groq...");

        try {
            const response = await groqModel.invoke(formattedMessages);

            console.log("Groq response received!");

            return extractText(response.content);

        } catch (groqError) {

            console.error("GROQ FAILED:", groqError.message);

            throw groqError;
        }
    }
}


// Normal AI response
export async function generateResponse(messages) {
    return await invokeWithFallback(messages);
}


// STREAMING AI RESPONSE
export async function* generateResponseStream(messages) {
    const formattedMessages = formatMessages(messages);

    try {
        console.log("Starting Groq streaming...");

        const stream = await groqModel.stream(formattedMessages);

        for await (const chunk of stream) {
            const content = extractText(chunk.content);

            if (content) {
                yield content;
            }
        }

        console.log("Groq streaming completed!");

    } catch (error) {
        console.error("GROQ STREAM FAILED:", error.message);
        throw error;
    }
}

// ANALYZE IMAGE USING GEMINI VISION
export async function analyzeImage(buffer, mimeType, userPrompt) {
    try {
        const base64Image = buffer.toString("base64");

        const response = await geminiModel.invoke([
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: userPrompt || "Analyze this image in detail. Describe its contents and important information."
                    },
                    {
                        type: "image_url",
                        image_url: `data:${mimeType};base64,${base64Image}`
                    }
                ]
            })
        ]);

        return extractText(response.content);

    } catch (error) {
        console.error("IMAGE ANALYSIS ERROR:", error.message);
        throw new Error("Unable to analyze image. Check Gemini API quota and configuration.");
    }
}

// Generate chat title
export async function generateChatTitle(message) {

    return await invokeWithFallback([
        {
            role: "system",
            content: "Generate a concise and relevant title for the user's chat. Return only the title."
        },
        {
            role: "user",
            content: `Generate a title for this message: "${message}"`
        }
    ]);
}