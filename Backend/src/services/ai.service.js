

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

// Convert AI response into a string
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

// Gemini with Groq fallback
async function invokeWithFallback(messages) {

    const formattedMessages = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } 
        else if (msg.role === "ai") {
            return new AIMessage(msg.content);
        } 
        else if (msg.role === "system") {
            return new SystemMessage(msg.content);
        }
    }).filter(Boolean);

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

// Generate AI response
export async function generateResponse(messages) {
    return await invokeWithFallback(messages);
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
