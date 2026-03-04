import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

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
