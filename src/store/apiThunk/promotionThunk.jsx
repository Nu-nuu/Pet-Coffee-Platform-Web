import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createPromotion,
    deletePromotion,
    getPromotionDetail,
    getPromotionsFromShop,
    updatePromotion,
} from "../../api/promotion";

export const updatePromotionThunk = createAsyncThunk(
    "promotion/updatePromotion",
    async (data, thunkAPI) => {
        try {
            const response = await updatePromotion(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createPromotionThunk = createAsyncThunk(
    "promotion/createPromotion",
    async (data, thunkAPI) => {
        try {
            const response = await createPromotion(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deletePromotionThunk = createAsyncThunk(
    "promotion/deletePromotion",
    async (id, thunkAPI) => {
        try {
            const response = await deletePromotion(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPromotionDetailThunk = createAsyncThunk(
    "promotion/getPromotionDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getPromotionDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPromotionsFromShopThunk = createAsyncThunk(
    "promotion/getPromotionsFromShop",
    async ({ id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getPromotionsFromShop(
                id,
                pageNumber,
                pageSize
            );
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
