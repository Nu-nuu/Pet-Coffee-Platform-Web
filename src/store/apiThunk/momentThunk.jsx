import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createMoment,
  deleteMoment,
  editMoment,
  getMomentsFromPet,
  getMomentDetail,
} from '../../api/moment';

export const getMomentDetailThunk = createAsyncThunk(
  'moment/getMomentDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getMomentDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createMomentThunk = createAsyncThunk(
  'moment/createMoment',
  async (data, thunkAPI) => {
    try {
      const response = await createMoment(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getMomentsFromPetThunk = createAsyncThunk(
  'moment/getMomentsFromPet',
  async (id, thunkAPI) => {
    try {
      const response = await getMomentsFromPet(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const editMomentThunk = createAsyncThunk(
  'moment/editMoment',
  async (data, thunkAPI) => {
    try {
      const response = await editMoment(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteMomentThunk = createAsyncThunk(
  'moment/deleteMoment',
  async (id, thunkAPI) => {
    try {
      const response = await deleteMoment(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
