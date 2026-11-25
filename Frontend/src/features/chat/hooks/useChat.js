import { useDispatch, useSelector } from "react-redux";

import { initializeSocketConnection } from "../service/chat.socket";

import {
    sendMessage,
    getChats,
    getMessages,
    deleteChat,
    regenerateMessage,
    updateMessageFeedback
} from "../service/chat.api";

import {
    setChats,
    setMessages,
    setCurrentChatId,
    setError,
    setLoading,
    removeChat
} from "../chat.slice";


export const useChat = () => {
    const dispatch = useDispatch();

    const chats = useSelector((state) => state.chat.chats);
    const messages = useSelector((state) => state.chat.messages);


    // FETCH CHATS
    async function fetchChats() {
        try {
            dispatch(setLoading(true));

            const data = await getChats();

            dispatch(setChats(data.chats));

        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));

        } finally {
            dispatch(setLoading(false));
        }
    }


    // SEND MESSAGE WITH STREAMING
    async function handleSendMessage({ message, chatId = null, file = null }) {
        const previousMessages = messages;

        const optimisticMessage = {
            _id: Date.now(),
            content: message,
            role: "user",
            createdAt: new Date().toISOString()
        };

        let baseMessages = [
            ...previousMessages,
            optimisticMessage
        ];

        let streamedResponse = "";

        try {
            dispatch(setError(null));
            dispatch(setMessages(baseMessages));
            dispatch(setLoading(true));

            const data = await sendMessage(
                message,
                chatId,
                (event) => {

                    if (event.type === "metadata") {
                        const { chat, userMessage } = event.data;

                        baseMessages = [
                            ...previousMessages,
                            userMessage
                        ];

                        dispatch(setMessages(baseMessages));
                        dispatch(setCurrentChatId(chat._id));

                        const existingChat = chats.some(
                            item => item._id === chat._id
                        );

                        if (existingChat) {
                            dispatch(setChats(
                                chats.map(item =>
                                    item._id === chat._id ? chat : item
                                )
                            ));
                        } else {
                            dispatch(setChats([
                                chat,
                                ...chats
                            ]));
                        }
                    }

                    else if (event.type === "token") {
                        streamedResponse += event.content;

                        dispatch(setMessages([
                            ...baseMessages,
                            {
                                _id: "streaming-ai-message",
                                content: streamedResponse,
                                role: "ai",
                                createdAt: new Date().toISOString()
                            }
                        ]));
                    }

                    else if (event.type === "done") {
                        dispatch(setMessages([
                            ...baseMessages,
                            event.data.aiMessage
                        ]));
                    }
                }, file
            );

            const { chat, userMessage, aiMessage } = data;

            dispatch(setMessages([
                ...previousMessages,
                userMessage,
                aiMessage
            ]));

            dispatch(setCurrentChatId(chat._id));

            return data;

        } catch (error) {
            console.error("STREAMING ERROR:", error);

            dispatch(setMessages(previousMessages));

            dispatch(setError(
                error.message || "Failed to generate AI response"
            ));

            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    }


    // REGENERATE RESPONSE
    async function handleRegenerateMessage(messageId) {
        const previousMessages = messages;

        let streamedResponse = "";

        try {
            dispatch(setError(null));
            dispatch(setLoading(true));

            const data = await regenerateMessage(
                messageId,
                (event) => {

                    if (event.type === "metadata") {
                        dispatch(setMessages(
                            previousMessages.map(msg =>
                                msg._id === messageId
                                    ? { ...msg, content: "", feedback: "none" }
                                    : msg
                            )
                        ));
                    }

                    else if (event.type === "token") {
                        streamedResponse += event.content;

                        dispatch(setMessages(
                            previousMessages.map(msg =>
                                msg._id === messageId
                                    ? { ...msg, content: streamedResponse, feedback: "none" }
                                    : msg
                            )
                        ));
                    }

                    else if (event.type === "done") {
                        dispatch(setMessages(
                            previousMessages.map(msg =>
                                msg._id === messageId
                                    ? event.data.aiMessage
                                    : msg
                            )
                        ));
                    }
                }
            );

            dispatch(setMessages(
                previousMessages.map(msg =>
                    msg._id === messageId
                        ? data.aiMessage
                        : msg
                )
            ));

            return data;

        } catch (error) {
            console.error("REGENERATE ERROR:", error);

            dispatch(setMessages(previousMessages));

            dispatch(setError(
                error.message || "Failed to regenerate response"
            ));

            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    }


    // LIKE / DISLIKE
    async function handleMessageFeedback(messageId, feedback) {
        try {
            const data = await updateMessageFeedback(messageId, feedback);

            dispatch(setMessages(
                messages.map(msg =>
                    msg._id === messageId
                        ? data.updatedMessage
                        : msg
                )
            ));

        } catch (error) {
            console.error("FEEDBACK ERROR:", error);

            dispatch(setError(
                error.response?.data?.message || error.message
            ));
        }
    }


    // FETCH MESSAGES
    async function fetchMessages(chatId) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getMessages(chatId);

            dispatch(setMessages(data.messages));
            dispatch(setCurrentChatId(chatId));

        } catch (error) {
            dispatch(setError(
                error.response?.data?.message || error.message
            ));

        } finally {
            dispatch(setLoading(false));
        }
    }


    // DELETE CHAT
    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId);

            dispatch(removeChat(chatId));

        } catch (error) {
            dispatch(setError(
                error.response?.data?.message || error.message
            ));
        }
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleRegenerateMessage,
        handleMessageFeedback,
        fetchChats,
        fetchMessages,
        handleDeleteChat
    };
};