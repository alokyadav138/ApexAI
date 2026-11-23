
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.7-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi() {
    try {
        const response = await model.invoke(
            "What is the capital of France?"
        );

        console.log(response.text);
        return response.text;

    } catch (error) {
        console.error("Gemini API Error:", error.message);

        if (error.status === 429) {
            console.log("Gemini daily quota exhausted. Try again later.");
            return null;
        }

        return null;
    }
}
