import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getTransationDetail,
    getTransationsFromShop,
} from "../../api/transaction";

export const getTransationDetailThunk = createAsyncThunk(
    "transaction/getTransationDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getTransationDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getTransationsFromShopThunk = createAsyncThunk(
    "transaction/getTransationsFromShop",
    async ({ type, id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getTransationsFromShop(
                type,
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
