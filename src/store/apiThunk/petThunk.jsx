import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getPetDetail,
  getPetsFromShop,
  createPet,
  updatePet,
  deletePet,
  getPetsFromArea,
  updatePetsFromArea
} from '../../api/pet';

export const updatePetsFromAreaThunk = createAsyncThunk(
  'pet/updatePetsFromArea',
  async (data, thunkAPI) => {
    try {
      const response = await updatePetsFromArea(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getPetsFromAreaThunk = createAsyncThunk(
  'pet/getPetsFromArea',
  async (id, thunkAPI) => {
    try {
      const response = await getPetsFromArea(id);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deletePetThunk = createAsyncThunk(
  'pet/deletePet',
  async (id, thunkAPI) => {
    try {
      const response = await deletePet(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updatePetThunk = createAsyncThunk(
  'pet/updatePet',
  async (data, thunkAPI) => {
    try {
      const response = await updatePet(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createPetThunk = createAsyncThunk(
  'pet/createPet',
  async (data, thunkAPI) => {
    try {
      const response = await createPet(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getPetsFromShopThunk = createAsyncThunk(
  'pet/getPetsFromShop',
  async (shopId, thunkAPI) => {
    try {
      const response = await getPetsFromShop(shopId);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getPetDetailThunk = createAsyncThunk(
  'pet/getPetDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getPetDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
