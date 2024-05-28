import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllNotifications,
    getUnreadNotifications,
    readAllNotifications,
} from "../../api/notification";

export const readAllNotificationsThunk = createAsyncThunk(
    "notification/readAllNotifications",
    async (thunkAPI) => {
        try {
            const response = await readAllNotifications();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllNotificationsThunk = createAsyncThunk(
    "notification/getAllNotifications",
    async (thunkAPI) => {
        try {
            const response = await getAllNotifications();
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getUnreadNotificationsThunk = createAsyncThunk(
    "notification/getUnreadNotifications",
    async (thunkAPI) => {
        try {
            const response = await getUnreadNotifications();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
