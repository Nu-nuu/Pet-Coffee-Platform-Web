import api from "./api";

export const getPetCoffeeShops = async (
    searchQuery,
    type,
    latitude,
    longitude,
    pageNumber,
    pageSize
) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops?Search=${searchQuery}&Type=${type}&Latitude=${latitude}&Longitude=${longitude}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getAllShopsDistance = async (latitude, longitude) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops?Latitude=${latitude}&Longitude=${longitude}`
    );
    return response.data;
};

export const getAllPetCoffeeShops = async (type, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops?ShopType=${type}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getRandomPetCoffeeShops = async (
    type,
    latitude,
    longitude,
    size
) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops/random?Latitude=${latitude}&Longitude=${longitude}&Size=${size}&ShopType=${type}`
    );
    return response.data;
};

export const createPetCoffeeShop = async (data) => {
    const response = await api.post(`/api/v1/petcoffeeshops`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePetCoffeeShop = async (data) => {
    const response = await api.put(`/api/v1/petcoffeeshops`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getPopularPetCoffeeShops = async (
    latitude,
    longitude,
    type,
    pageNumber,
    pageSize
) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops/popular?Latitude=${latitude}&Longitude=${longitude}&ShopType=${type}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getAllPopularPetCoffeeShops = async () => {
    const response = await api.get(`/api/v1/petcoffeeshops/popular`);
    return response.data;
};

export const getAllPopularShopsDistance = async (latitude, longitude) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops/popular?Latitude=${latitude}&Longitude=${longitude}`
    );
    return response.data;
};

export const getPetCoffeeShopDetail = async ({ id, latitude, longitude }) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops/${id}/${latitude}/${longitude}`
    );
    return response.data;
};

export const getPetCoffeeShopTaxCode = async (taxCode) => {
    const response = await api.get(`/api/v1/petcoffeeshops/taxCode/${taxCode}`);
    return response.data;
};

export const updateShopStatus = async (data) => {
    const response = await api.put(`/api/v1/petcoffeeshops/status`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
