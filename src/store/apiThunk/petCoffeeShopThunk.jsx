import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createPetCoffeeShop,
    getPetCoffeeShopDetail,
    getPetCoffeeShopTaxCode,
    getPetCoffeeShops,
    updatePetCoffeeShop,
    getPopularPetCoffeeShops,
    getRandomPetCoffeeShops,
    getAllPetCoffeeShops,
    getAllPopularPetCoffeeShops,
    getAllShopsDistance,
    getAllPopularShopsDistance,
    updateShopStatus,
} from "../../api/petCoffeeShop";

export const updateShopStatusThunk = createAsyncThunk(
    "petCoffeeShop/updateShopStatus",
    async (data, thunkAPI) => {
        try {
            const response = await updateShopStatus(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllPopularShopsDistanceThunk = createAsyncThunk(
    "petCoffeeShop/getAllPopularShopsDistance",
    async ({ latitude, longitude }, thunkAPI) => {
        try {
            const response = await getAllPopularShopsDistance(
                latitude,
                longitude
            );
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updatePetCoffeeShopThunk = createAsyncThunk(
    "petCoffeeShop/updatePetCoffeeShop",
    async (data, thunkAPI) => {
        try {
            const response = await updatePetCoffeeShop(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const getPetCoffeeShopTaxCodeThunk = createAsyncThunk(
    "petCoffeeShop/getPetCoffeeShopTaxCode",
    async (data, thunkAPI) => {
        try {
            const response = await getPetCoffeeShopTaxCode(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getRandomPetCoffeeShopsThunk = createAsyncThunk(
    "petCoffeeShop/getRandomPetCoffeeShops",
    async ({ type, latitude, longitude, size }, thunkAPI) => {
        try {
            const response = await getRandomPetCoffeeShops(
                type,
                latitude,
                longitude,
                size
            );
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPopularPetCoffeeShopsThunk = createAsyncThunk(
    "petCoffeeShop/getPopularPetCoffeeShops",
    async ({ latitude, longitude, type, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getPopularPetCoffeeShops(
                latitude,
                longitude,
                type,
                pageNumber,
                pageSize
            );
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllPopularPetCoffeeShopsThunk = createAsyncThunk(
    "petCoffeeShop/getAllPopularPetCoffeeShops",
    async (thunkAPI) => {
        try {
            const response = await getAllPopularPetCoffeeShops();
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllShopsDistanceThunk = createAsyncThunk(
    "petCoffeeShop/getAllShopsDistance",
    async ({ latitude, longitude }, thunkAPI) => {
        try {
            const response = await getAllShopsDistance(latitude, longitude);
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllPetCoffeeShopsThunk = createAsyncThunk(
    "petCoffeeShop/getAllPetCoffeeShops",
    async ({ type, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getAllPetCoffeeShops(
                type,
                pageNumber,
                pageSize
            );
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPetCoffeeShopsThunk = createAsyncThunk(
    "petCoffeeShop/getAllPetCoffeeShops",
    async (
        { searchQuery, type, latitude, longitude, pageNumber, pageSize },
        thunkAPI
    ) => {
        try {
            const response = await getPetCoffeeShops(
                searchQuery,
                type,
                latitude,
                longitude,
                pageNumber,
                pageSize
            );
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createPetCoffeeShopThunk = createAsyncThunk(
    "petCoffeeShop/createPetCoffeeShop",
    async (data, thunkAPI) => {
        try {
            const response = await createPetCoffeeShop(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

export const getPetCoffeeShopDetailThunk = createAsyncThunk(
    "petCoffeeShop/getPetCoffeeShopDetail",
    async ({ id, latitude, longitude }, thunkAPI) => {
        try {
            const response = await getPetCoffeeShopDetail({
                id,
                latitude,
                longitude,
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
