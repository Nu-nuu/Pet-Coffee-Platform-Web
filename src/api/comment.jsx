import api from "./api";

export const createComment = async data => {
    const response = await api.post(`/api/v1/comments`, data
        , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
};

export const updateComment = async data => {
    const response = await api.put(`/api/v1/comments`, data
        , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
};

export const getComment = async id => {
    const response = await api.get(`/api/v1/comments/${id}`);
    return response.data;
};

export const getCommentDetail = async id => {
    const response = await api.get(`/api/v1/comments/${id}`);
    return response.data;
};

export const getReply = async id => {
    const response = await api.get(`/api/v1/comments/${id}/subcomments`);
    return response.data;
};
