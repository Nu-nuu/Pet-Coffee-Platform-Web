import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllOrders,
    cancelOrder,
    getOrdersFromShop,
    getOrderDetail,
} from "../../api/order";

export const getOrderDetailThunk = createAsyncThunk(
    "order/getOrderDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getOrderDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getOrdersFromShopThunk = createAsyncThunk(
    "order/getOrdersFromShop",
    async ({ id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getOrdersFromShop(id, pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const cancelOrderThunk = createAsyncThunk(
    "order/cancelOrder",
    async (id, thunkAPI) => {
        try {
            const response = await cancelOrder(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllOrdersThunk = createAsyncThunk(
    "order/getAllOrders",
    async ({ shopId,pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getAllOrders(shopId,pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
