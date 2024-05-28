import api from "./api";

export const getPackages = async () => {
    const response = await api.get(`/api/v1/packages`);
    return response.data;
};

export const getPackageDetail = async (id) => {
    const response = await api.get(`/api/v1/packages/${id}`);
    return response.data;
};

export const updatePackage = async (data) => {
    const response = await api.put(`/api/v1/packages`, data);
    return response.data;
};

export const createPackage = async (data) => {
    const response = await api.post(`/api/v1/packages`, data);
    return response.data;
};

export const deletePackage = async (id) => {
    const response = await api.delete(`/api/v1/packages/${id}`);
    return response.data;
};

export const buyPackage = async (data) => {
    const response = await api.post(`/api/v1/shops/packages`, data);
    return response.data;
};
