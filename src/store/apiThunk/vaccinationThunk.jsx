import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createVaccination,
  deleteVaccination,
  editVaccination,
  getVaccinationsFromPet,
  getVaccinationDetail
} from '../../api/vaccination';

export const getVaccinationDetailThunk = createAsyncThunk(
  'vaccination/getVaccinationDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getVaccinationDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getVaccinationsFromPetThunk = createAsyncThunk(
  'vaccination/getVaccinationsFromPet',
  async (id, thunkAPI) => {
    try {
      const response = await getVaccinationsFromPet(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createVaccinationThunk = createAsyncThunk(
  'vaccination/createVaccination',
  async (data, thunkAPI) => {
    try {
      const response = await createVaccination(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteVaccinationThunk = createAsyncThunk(
  'vaccination/deleteVaccination',
  async (id, thunkAPI) => {
    try {
      const response = await deleteVaccination(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const editVaccinationThunk = createAsyncThunk(
  'vaccination/editVaccination',
  async (data, thunkAPI) => {
    try {
      const response = await editVaccination(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
