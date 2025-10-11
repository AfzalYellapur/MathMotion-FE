import axios from 'axios';

export const createChatResponseApi = async (prompt: string, sessionId: string) => {
    return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generative/chat/new/prompt`, {
        prompt,
        sessionId
    })
}

export const createChatApi = async () => {
    return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generative/chat/new`)
    }

export const followUpChatApi = (chatId: string, message: string) => {
    return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generative/chat/followup`, {
        message,
    });
}