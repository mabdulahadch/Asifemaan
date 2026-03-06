import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/poets`;

export interface Poet {
    id: number;
    realName: string;
    penName: string | null;
    dateOfBirth: string | null;
    placeOfBirth: string | null;
    profilePicture: string | null;
    bio: string | null;
}

export const PoetService = {
    getAllPoets: async (): Promise<Poet[]> => {
        const response = await axios.get(`${API_URL}/`);
        return response.data.data;
    },

    getPoetById: async (id: string | number): Promise<Poet> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data;
    },
};
