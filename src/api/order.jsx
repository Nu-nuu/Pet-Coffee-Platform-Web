import api from "./api";

export const getAllOrders = async (shopId,pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/accounts/orders?ShopId=${shopId}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getOrdersFromShop = async (id, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/orders?ShopId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getOrderDetail = async (id) => {
    const response = await api.get(`/api/v1/order/${id}`);
    return response.data;
};

export const cancelOrder = async (id) => {
    const response = await api.put(`/api/v1/order/${id}/return`);
    return response.data;
};
