import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminService = {
    // Poets
    getPoets: async () => {
        const response = await axios.get(`${API_URL}/poets`);
        return response.data;
    },
    createPoet: async (data: any, token: string | null) => {
        const response = await axios.post(`${API_URL}/poets`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    updatePoet: async (id: number, data: any, token: string | null) => {
        const response = await axios.put(`${API_URL}/poets/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    deletePoet: async (id: number, token: string | null) => {
        const response = await axios.delete(`${API_URL}/poets/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Settings
    getSettings: async () => {
        const response = await axios.get(`${API_URL}/settings`);
        return response.data;
    },
    updateSettings: async (formData: FormData, config: any) => {
        const response = await axios.put(`${API_URL}/settings`, formData, config);
        return response.data;
    },

    // Content
    getContentByPoet: async (poetId: string | number) => {
        const response = await axios.get(`${API_URL}/content/poet/${poetId}`);
        return response.data;
    },
    createContent: async (formData: FormData, config: any) => {
        const response = await axios.post(`${API_URL}/content`, formData, config);
        return response.data;
    },
    updateContent: async (id: number, formData: FormData, config: any) => {
        const response = await axios.put(`${API_URL}/content/${id}`, formData, config);
        return response.data;
    },
    deleteContent: async (id: number, token: string | null) => {
        const response = await axios.delete(`${API_URL}/content/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
};
