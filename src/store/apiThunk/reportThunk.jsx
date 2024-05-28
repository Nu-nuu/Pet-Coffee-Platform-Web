import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllReports,
    updateReportStatus,
    getShopReports,
} from "../../api/report";

export const getShopReportsThunk = createAsyncThunk(
    "report/getShopReports",
    async ({ id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getShopReports(id, pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllReportsThunk = createAsyncThunk(
    "report/getAllReports",
    async ({ pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getAllReports(pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateReportStatusThunk = createAsyncThunk(
    "report/updateReportStatus",
    async (data, thunkAPI) => {
        try {
            const response = await updateReportStatus(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
