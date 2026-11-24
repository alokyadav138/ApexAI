import axios from "axios";

const api=axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export const sendMessage=async(message)=>{
    const response= await api.post("/api/chat/message",{
        message,chatId
    })
    return response.data
}


export const getChats=async()=>{
    const response= await api.get("/api/chat/")
    return response.data
}

export const getMessages=async(chatId)=>{
    const response= await api.get(`/api/chat/${chatId}/messages`)
    return response.data
}


export const deleteChat=async(chatId)=>{
    const response= await api.delete(`/api/chat/delete/${chatId}`)
    return response.data
}