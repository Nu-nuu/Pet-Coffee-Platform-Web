import { createAsyncThunk } from "@reduxjs/toolkit";
import { createTopup, updatePaymentData } from "../../api/topup";

export const updatePaymentDataThunk = createAsyncThunk(
    "topup/updatePaymentData",
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await updatePaymentData(id, status);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createTopupThunk = createAsyncThunk(
    "topup/createTopup",
    async (data, thunkAPI) => {
        try {
            const response = await createTopup(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
