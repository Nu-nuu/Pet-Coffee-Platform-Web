import api from "./api";

export const getPostCategory = async () => {
    const response = await api.get(`/api/PostCategory`);
    return response.data;
};

export const deletePostCategory = async (data) => {
    const response = await api.delete(`/api/PostCategory`, data);
    return response.data;
};

export const createPostCategory = async (data) => {
    const response = await api.post(`api/PostCategory`, data);
    return response.data;
};

export const updatePostCategory = async ({ data }) => {
    const response = await api.put(`api/PostCategory`, data);
    return response.data;
};