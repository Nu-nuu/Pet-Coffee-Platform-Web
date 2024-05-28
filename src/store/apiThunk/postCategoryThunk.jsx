import { createAsyncThunk } from '@reduxjs/toolkit';
import { createPostCategory, deletePostCategory, getPostCategory, updatePostCategory } from '../../api/postCategory';

export const updatePostCategoryThunk = createAsyncThunk(
    'postCategory/updatePostCategory',
    async (data, thunkAPI) => {
        try {
            const response = await updatePostCategory(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createPostCategoryThunk = createAsyncThunk(
    'postCategory/createPostCategory',
    async (data, thunkAPI) => {
        try {
            const response = await createPostCategory(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);


export const getPostCategoryThunk = createAsyncThunk(
    'postCategory/getPostCategory',
    async (id, thunkAPI) => {
        try {
            const response = await getPostCategory(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const deletePostCategoryThunk = createAsyncThunk(
    'postCategory/deletePostCategory',
    async (id, thunkAPI) => {
        try {
            const response = await deletePostCategory(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);