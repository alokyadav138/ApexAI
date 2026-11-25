import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// COMMON SSE READER
const readStream = async (response, onEvent) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }

    if (!response.body) {
        throw new Error("Streaming is not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let metadata = null;
    let aiMessage = null;
    let fullResponse = "";

    const processEvent = (event) => {
        const dataLine = event
            .split(/\r?\n/)
            .find(line => line.startsWith("data: "));

        if (!dataLine) return;

        const data = JSON.parse(dataLine.slice(6));

        if (data.type === "metadata") {
            metadata = data;

            onEvent?.({
                type: "metadata",
                data
            });
        }

        else if (data.type === "token") {
            fullResponse += data.content;

            onEvent?.({
                type: "token",
                content: data.content
            });
        }

        else if (data.type === "done") {
            aiMessage = data.aiMessage;

            onEvent?.({
                type: "done",
                data
            });
        }

        else if (data.type === "error") {
            throw new Error(data.message);
        }
    };

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split(/\r?\n\r?\n/);

            buffer = events.pop() || "";

            for (const event of events) {
                processEvent(event);
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            processEvent(buffer);
        }

        if (!aiMessage) {
            throw new Error("AI response was not completed");
        }

        return {
            success: true,
            chat: metadata?.chat,
            userMessage: metadata?.userMessage,
            aiMessage,
            fullResponse
        };

    } finally {
        reader.releaseLock();
    }
};


// SEND MESSAGE WITH OPTIONAL FILE
export const sendMessage = async (
    message,
    chatId = null,
    onEvent,
    file = null
) => {
    const formData = new FormData();

    formData.append("message", message || "");

    if (chatId) {
        formData.append("chatId", chatId);
    }

    if (file) {
        formData.append("file", file);
    }

const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chats/message`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Accept": "text/event-stream"
            },

            body: formData
        }
    );

    return readStream(response, onEvent);
};

// REGENERATE MESSAGE
export const regenerateMessage = async (messageId, onEvent) => {
const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chats/${messageId}/regenerate`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Accept": "text/event-stream"
            }
        }
    );

    return readStream(response, onEvent);
};


// UPDATE FEEDBACK
export const updateMessageFeedback = async (messageId, feedback) => {
    const response = await api.patch(
        `/api/chats/${messageId}/feedback`,
        { feedback }
    );

    return response.data;
};


// GET CHATS
export const getChats = async () => {
    const response = await api.get("/api/chats/");
    return response.data;
};


// GET MESSAGES
export const getMessages = async (chatId) => {
    const response = await api.get(
        `/api/chats/${chatId}/messages`
    );

    return response.data;
};


// DELETE CHAT
export const deleteChat = async (chatId) => {
    const response = await api.delete(
        `/api/chats/delete/${chatId}`
    );

    return response.data;
};