import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    buyPackage,
    createPackage,
    deletePackage,
    getPackages,
    updatePackage,
    getPackageDetail,
} from "../../api/package";

export const getPackageDetailThunk = createAsyncThunk(
    "package/getPackageDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getPackageDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const buyPackageThunk = createAsyncThunk(
    "package/buyPackage",
    async (data, thunkAPI) => {
        try {
            const response = await buyPackage(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createPackageThunk = createAsyncThunk(
    "package/createPackage",
    async (data, thunkAPI) => {
        try {
            const response = await createPackage(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deletePackageThunk = createAsyncThunk(
    "package/deletePackage",
    async (id, thunkAPI) => {
        try {
            const response = await deletePackage(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPackagesThunk = createAsyncThunk(
    "package/getPackages",
    async (thunkAPI) => {
        try {
            const response = await getPackages();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updatePackageThunk = createAsyncThunk(
    "package/updatePackage",
    async (data, thunkAPI) => {
        try {
            const response = await updatePackage(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
