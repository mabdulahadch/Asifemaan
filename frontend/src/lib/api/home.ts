import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const HomeService = {
    getSettings: async () => {
        const response = await axios.get(`${API_URL}/settings`);
        return response.data;
    },
    sendContactMessage: async (data: { name: string; email: string; country: string; message: string }) => {
        const response = await axios.post(`${API_URL}/contact`, data);
        return response.data;
    }
};
