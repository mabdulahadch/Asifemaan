import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/content`;

export interface Content {
    id: number;
    poetId: number;
    title: string;
    type: "GHAZAL" | "NAZM" | "SHER" | "EBOOK" | "AUDIO" | "VIDEO" | "ARTICLE";
    textContent: string | null;
    pdfFile: string | null;
    coverImage: string | null;
    youtubeLink: string | null;
    audioFile: string | null;
    mediaFiles?: string | null;
    isFeatured?: number;
    createdAt: string;
    updatedAt: string;
}

export interface FeaturedContent extends Content {
    penName: string | null;
    realName: string;
}

export const ContentService = {
    getContentByPoet: async (poetId: string | number): Promise<Content[]> => {
        const response = await axios.get(`${API_URL}/poet/${poetId}`);
        return response.data.data;
    },
    getContentById: async (id: string | number): Promise<Content> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data;
    },
    getFeaturedContent: async (): Promise<FeaturedContent[]> => {
        const response = await axios.get(`${API_URL}/featured`);
        return response.data.data;
    },
};
