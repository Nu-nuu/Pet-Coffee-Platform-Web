import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createItem,
    donatePet,
    getAllItems,
    getItemDetail,
    getItemsFromUser,
    deleteItem,
    updateItem,
} from "../../api/item";

export const updateItemThunk = createAsyncThunk(
    "item/updateItem",
    async (data, thunkAPI) => {
        try {
            const response = await updateItem(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteItemThunk = createAsyncThunk(
    "item/deleteItem",
    async (id, thunkAPI) => {
        try {
            const response = await deleteItem(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getItemDetailThunk = createAsyncThunk(
    "item/getItemDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getItemDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createItemThunk = createAsyncThunk(
    "item/createItem",
    async (data, thunkAPI) => {
        try {
            const response = await createItem(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getItemsFromUserThunk = createAsyncThunk(
    "item/getItemsFromUser",
    async (id, thunkAPI) => {
        try {
            const response = await getItemsFromUser(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllItemsThunk = createAsyncThunk(
    "item/getAllItems",
    async ({ pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getAllItems(pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const donatePetThunk = createAsyncThunk(
    "item/donatePet",
    async (data, thunkAPI) => {
        try {
            const response = await donatePet(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
