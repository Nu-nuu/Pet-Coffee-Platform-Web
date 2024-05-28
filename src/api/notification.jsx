import api from "./api";

export const getAllNotifications = async () => {
    const response = await api.get(`/api/v1/notifications`);
    return response.data;
};

export const getUnreadNotifications = async () => {
    const response = await api.get(`/api/v1/notifications/unread`);
    return response.data;
};

export const readAllNotifications = async () => {
    const response = await api.put(`/api/v1/notifications/read-all`);
    return response.data;
};
