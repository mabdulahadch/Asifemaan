import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const register = async (data: { email: string; password: string; country: string; name?: string }) => {
    if (!data.name && data.email) {
        data.name = data.email.split("@")[0];
    }
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const getProfile = async (token: string) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

