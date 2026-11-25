import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        loading: false,
        chats: [],
        messages: [],
        currentChatId: null,
        error: null,
    },

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setChats: (state, action) => {
            state.chats = action.payload;
        },

        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        clearMessages: (state) => {
            state.messages = [];
            state.currentChatId = null;
        },

        addChat: (state, action) => {
            state.chats.unshift(action.payload);
        },

        removeChat: (state, action) => {
            state.chats = state.chats.filter(
                chat => chat._id !== action.payload
            );

            if (state.currentChatId === action.payload) {
                state.currentChatId = null;
                state.messages = [];
            }
        },
    },
});

export const {
    setLoading,
    setChats,
    setMessages,
    setCurrentChatId,
    setError,
    addMessage,
    clearMessages,
    addChat,
    removeChat,
} = chatSlice.actions;

export default chatSlice.reducer;