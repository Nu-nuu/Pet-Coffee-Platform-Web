import api from "./api";

export const getTransationsFromShop = async (
    type,
    id,
    pageNumber,
    pageSize
) => {
    const response = await api.get(
        `/api/v1/transactions?Type=${type}&ShopId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getTransationDetail = async (id) => {
    const response = await api.get(`/api/v1/transactions/${id}`);
    return response.data;
};
