import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  followShops,
  unfollowShops,
  getFollowShops,
  getAllFollowShops,
  getAllFollowShopsDistance,
} from '../../api/followShop';

export const getAllFollowShopsDistanceThunk = createAsyncThunk(
  'followShops/getAllFollowShopsDistance',
  async ({latitude, longitude}, thunkAPI) => {
    try {
      const response = await getAllFollowShopsDistance(latitude, longitude);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getFollowShopsThunk = createAsyncThunk(
  'followShops/getFollowShops',
  async (
    {searchQuery, type, latitude, longitude, pageNumber, pageSize},
    thunkAPI,
  ) => {
    try {
      const response = await getFollowShops(
        searchQuery,
        type,
        latitude,
        longitude,
        pageNumber,
        pageSize,
      );
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAllFollowShopsThunk = createAsyncThunk(
  'followShops/getAllFollowShops',
  async thunkAPI => {
    try {
      const response = await getAllFollowShops();
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const followShopsThunk = createAsyncThunk(
  'followShops/followShops',
  async (id, thunkAPI) => {
    try {
      const response = await followShops(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const unfollowShopsThunk = createAsyncThunk(
  'followShops/unfollowShops',
  async (id, thunkAPI) => {
    try {
      const response = await unfollowShops(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
