import api from "./api";

export const getAllItems = async (pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/items?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getItemsFromUser = async () => {
    const response = await api.get(`/api/v1/account/items`);
    return response.data;
};

export const getItemDetail = async (id) => {
    const response = await api.get(`/api/v1/item/${id}`);
    return response.data;
};

export const createItem = async (data) => {
    const response = await api.post(`/api/v1/items`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const donatePet = async (data) => {
    const response = await api.post(`/api/v1/items/donation`, data);
    return response.data;
};

export const deleteItem = async (id) => {
    const response = await api.delete(`/api/v1/item/${id}`);
    return response.data;
};

export const updateItem = async (data) => {
    const response = await api.put(`/api/v1/items`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
