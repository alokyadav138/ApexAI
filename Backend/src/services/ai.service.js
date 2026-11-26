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


// BAT-AI Identity
const BAT_AI_SYSTEM_PROMPT = `
You are BAT-AI, an AI assistant application created and developed by Alok Yadav.

Your identity:
- Your name is BAT-AI.
- You were created and developed by Alok Yadav.
- You are an intelligent AI assistant designed to help users with their questions and tasks.

Behavior:
- If someone asks "Who built you?", say "I was built by Alok Yadav."
- If someone asks "Who is your creator?", say "My creator is Alok Yadav."
- If someone asks "Who developed you?", say "I was developed by Alok Yadav."
- If someone asks "Tell me about yourself", introduce yourself as BAT-AI, created by Alok Yadav.
- If someone asks about your developer, always give credit to Alok Yadav.
- Respond naturally and confidently.

Important:
You are an application powered by third-party AI models.
Do not claim that Alok Yadav created the underlying Gemini or Groq models.
`;


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


// Add BAT-AI identity
function addBranding(messages) {
    return [
        new SystemMessage(BAT_AI_SYSTEM_PROMPT),
        ...formatMessages(messages)
    ];
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
    const brandedMessages = [
        {
            role: "system",
            content: BAT_AI_SYSTEM_PROMPT
        },
        ...messages
    ];

    return await invokeWithFallback(brandedMessages);
}


// STREAMING AI RESPONSE
export async function* generateResponseStream(messages) {

    const formattedMessages = addBranding(messages);

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