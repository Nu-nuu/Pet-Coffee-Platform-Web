import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createProduct,
    deleteProduct,
    getProductDetail,
    getProductsFromShop,
    updateProduct,
} from "../../api/product";

export const createProductThunk = createAsyncThunk(
    "product/createProduct",
    async (data, thunkAPI) => {
        try {
            const response = await createProduct(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteProductThunk = createAsyncThunk(
    "product/deleteProduct",
    async (id, thunkAPI) => {
        try {
            const response = await deleteProduct(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getProductDetailThunk = createAsyncThunk(
    "product/getProductDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getProductDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateProductThunk = createAsyncThunk(
    "product/updateProduct",
    async (data, thunkAPI) => {
        try {
            const response = await updateProduct(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getProductsFromShopThunk = createAsyncThunk(
    "product/getProductsFromShop",
    async ({ id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getProductsFromShop(
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
