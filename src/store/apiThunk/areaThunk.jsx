import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createArea,
  deleteArea,
  editArea,
  getAreasFromShop,
  getAreaDetail,
} from '../../api/area';

export const getAreaDetailThunk = createAsyncThunk(
  'area/getAreaDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getAreaDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAreasFromShopThunk = createAsyncThunk(
  'area/getAreasFromShop',
  async (id, thunkAPI) => {
    try {
      const response = await getAreasFromShop(id);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createAreaThunk = createAsyncThunk(
  'area/createArea',
  async (data, thunkAPI) => {
    try {
      const response = await createArea(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteAreaThunk = createAsyncThunk(
  'area/deleteArea',
  async (id, thunkAPI) => {
    try {
      const response = await deleteArea(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const editAreaThunk = createAsyncThunk(
  'area/editArea',
  async (data, thunkAPI) => {
    try {
      const response = await editArea(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
