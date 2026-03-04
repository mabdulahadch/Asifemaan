import axios from "axios";

const API_URL = "http://localhost:3000/api";

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
        const response = await axios.get(`${API_URL}/poets`);
        return response.data.data;
    },

    getPoetById: async (id: string | number): Promise<Poet> => {
        const response = await axios.get(`${API_URL}/poets/${id}`);
        return response.data.data;
    },
};
