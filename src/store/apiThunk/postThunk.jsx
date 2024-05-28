import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getPost,
    createPost,
    getCurrentAccountPost,
    getPostNewsFeed,
    getPostDetail,
    LikePost,
    UnlikePost,
} from "../../api/post";

export const getPostThunk = createAsyncThunk(
    "post/getPost",
    async (thunkAPI) => {
        try {
            const response = await getPost();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPostNewsFeedThunk = createAsyncThunk(
    "post/getPostNewsFeed",
    async ({ pageNumber, pageSize }, thunkAPI) => {
        try {
            const response = await getPostNewsFeed({ pageNumber, pageSize });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getCurrentAccountPostThunk = createAsyncThunk(
    "post/getCurrentAccountPost",
    async (thunkAPI) => {
        try {
            const response = await getCurrentAccountPost();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createPostThunk = createAsyncThunk(
    "post/createPost",
    async (data, thunkAPI) => {
        try {
            const response = await createPost(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPostDetailThunk = createAsyncThunk(
    "post/getPostDetail",
    async (id, thunkAPI) => {
        try {
            const response = await getPostDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const LikePostThunk = createAsyncThunk(
    "post/likePost",
    async (id, thunkAPI) => {
        try {
            const response = await LikePost(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const UnLikePostThunk = createAsyncThunk(
    "post/unlikePost",
    async (id, thunkAPI) => {
        try {
            const response = await UnlikePost(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);