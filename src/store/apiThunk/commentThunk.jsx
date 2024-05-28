import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createComment,
    getComment,
    getReply,
    updateComment,
    getCommentDetail,
} from "../../api/comment";

export const getCommentDetailThunk = createAsyncThunk(
    "comment/getCommentDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getCommentDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateCommentThunk = createAsyncThunk(
    "comment/updateComment",
    async (data, thunkAPI) => {
        try {
            const response = await updateComment(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createCommentThunk = createAsyncThunk(
    "comment/createComment",
    async (data, thunkAPI) => {
        try {
            const response = await createComment(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getCommentThunk = createAsyncThunk(
    "comment/getComment",
    async (id, thunkAPI) => {
        try {
            const response = await getComment(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getReplyThunk = createAsyncThunk(
    "comment/getReply",
    async (id, thunkAPI) => {
        try {
            const response = await getReply(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
