import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const HomeService = {
    getSettings: async () => {
        const response = await axios.get(`${API_URL}/settings`);
        return response.data;
    }
};
