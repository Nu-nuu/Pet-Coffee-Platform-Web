import api from "./api";

export const getPromotionsFromShop = async (id, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/petCoffeeShops/promotion?ShopId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getPromotionDetail = async (id) => {
    const response = await api.get(`/api/v1/promotion/${id}`);
    return response.data;
};

export const updatePromotion = async (data) => {
    const response = await api.put(`/api/v1/promotion`, data);
    return response.data;
};

export const createPromotion = async (data) => {
    const response = await api.post(`/api/v1/promotion`, data);
    return response.data;
};

export const deletePromotion = async (id) => {
    const response = await api.delete(`/api/v1/promotion/${id}`);
    return response.data;
};
