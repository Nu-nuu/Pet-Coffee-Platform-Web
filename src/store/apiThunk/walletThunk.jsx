import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getWallet,
    getManagerIncome,
    getManagerOutcome,
    getManagerMonthIncome,
    getManagerMonthOutcome,
    getShopMonthIncome,
    getShopMonthOutcome,
    getPlatformIncome,
    getPlatformMonthIncome,
    getShopIncome,
    getShopOutcome,
} from "../../api/wallet";

export const getPlatformIncomeThunk = createAsyncThunk(
    "wallet/getPlatformIncome",
    async (thunkAPI) => {
        try {
            const response = await getPlatformIncome();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPlatformMonthIncomeThunk = createAsyncThunk(
    "wallet/getPlatformMonthIncome",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await getPlatformMonthIncome(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getShopIncomeThunk = createAsyncThunk(
    "wallet/getShopIncome",
    async (id, thunkAPI) => {
        try {
            const response = await getShopIncome(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getShopOutcomeThunk = createAsyncThunk(
    "wallet/getShopOutcome",
    async (id, thunkAPI) => {
        try {
            const response = await getShopOutcome(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getManagerMonthIncomeThunk = createAsyncThunk(
    "wallet/getManagerMonthIncome",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await getManagerMonthIncome(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getManagerMonthOutcomeThunk = createAsyncThunk(
    "wallet/getManagerMonthOutcome",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await getManagerMonthOutcome(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getShopMonthIncomeThunk = createAsyncThunk(
    "wallet/getShopMonthIncome",
    async ({ from, to, id }, thunkAPI) => {
        try {
            const response = await getShopMonthIncome(from, to, id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getShopMonthOutcomeThunk = createAsyncThunk(
    "wallet/getShopMonthOutcome",
    async ({ from, to, id }, thunkAPI) => {
        try {
            const response = await getShopMonthOutcome(from, to, id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getManagerIncomeThunk = createAsyncThunk(
    "wallet/getManagerIncome",
    async (thunkAPI) => {
        try {
            const response = await getManagerIncome();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getManagerOutcomeThunk = createAsyncThunk(
    "wallet/getManagerOutcome",
    async (thunkAPI) => {
        try {
            const response = await getManagerOutcome();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getWalletThunk = createAsyncThunk(
    "wallet/getWallet",
    async (thunkAPI) => {
        try {
            const response = await getWallet();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
