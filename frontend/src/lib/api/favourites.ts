import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/favourites`;

const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// ─── Content Favourites ──────────────────────────────

export const addFavContent = async (contentId: number) => {
    const res = await axios.post(`${API_URL}/content/${contentId}`, {}, { headers: authHeaders() });
    return res.data;
};

export const removeFavContent = async (contentId: number) => {
    const res = await axios.delete(`${API_URL}/content/${contentId}`, { headers: authHeaders() });
    return res.data;
};

export const getFavContents = async () => {
    const res = await axios.get(`${API_URL}/content`, { headers: authHeaders() });
    return res.data.data;
};

export const getFavContentIds = async (): Promise<number[]> => {
    const res = await axios.get(`${API_URL}/content/ids`, { headers: authHeaders() });
    return res.data.data;
};

// ─── Poet Follows ────────────────────────────────────

export const followPoet = async (poetId: number) => {
    const res = await axios.post(`${API_URL}/poet/${poetId}`, {}, { headers: authHeaders() });
    return res.data;
};

export const unfollowPoet = async (poetId: number) => {
    const res = await axios.delete(`${API_URL}/poet/${poetId}`, { headers: authHeaders() });
    return res.data;
};

export const getFollowedPoets = async () => {
    const res = await axios.get(`${API_URL}/poets`, { headers: authHeaders() });
    return res.data.data;
};

export const getFollowedPoetIds = async (): Promise<number[]> => {
    const res = await axios.get(`${API_URL}/poets/ids`, { headers: authHeaders() });
    return res.data.data;
};
