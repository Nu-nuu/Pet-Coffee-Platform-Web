import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createEvent,
    createEventField,
    getEventDetail,
    getEventsFromShop,
    deleteEvent,
    deleteEventField,
    getEventDetailForCustomer,
    getJoinEvents,
    joinEvent,
    updateEvent,
    getAllEventSubmits,
    updateEventField,
} from "../../api/event";

export const updateEventFieldThunk = createAsyncThunk(
    "event/updateEventField",
    async (data, thunkAPI) => {
        try {
            const response = await updateEventField(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllEventSubmitsThunk = createAsyncThunk(
    "event/getAllEventSubmits",
    async (id, thunkAPI) => {
        try {
            const response = await getAllEventSubmits(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateEventThunk = createAsyncThunk(
    "event/updateEvent",
    async (data, thunkAPI) => {
        try {
            const response = await updateEvent(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const joinEventThunk = createAsyncThunk(
    "event/joinEvent",
    async (data, thunkAPI) => {
        try {
            const response = await joinEvent(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getJoinEventsThunk = createAsyncThunk(
    "event/getJoinEvents",
    async (thunkAPI) => {
        try {
            const response = await getJoinEvents();
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getEventDetailForCustomerThunk = createAsyncThunk(
    "event/getEventDetailForCustomer",
    async (id, thunkAPI) => {
        try {
            const response = await getEventDetailForCustomer(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteEventFieldThunk = createAsyncThunk(
    "event/deleteEventField",
    async (id, thunkAPI) => {
        try {
            const response = await deleteEventField(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteEventThunk = createAsyncThunk(
    "event/deleteEvent",
    async (id, thunkAPI) => {
        try {
            const response = await deleteEvent(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createEventThunk = createAsyncThunk(
    "event/createEvent",
    async (data, thunkAPI) => {
        try {
            const response = await createEvent(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createEventFieldThunk = createAsyncThunk(
    "event/createEventField",
    async (data, thunkAPI) => {
        try {
            const response = await createEventField(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getEventsFromShopThunk = createAsyncThunk(
    "event/getEventsFromShop",
    async ({ id, pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getEventsFromShop(id, pageNumber, pageSize);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getEventDetailThunk = createAsyncThunk(
    "event/getEventDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getEventDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
