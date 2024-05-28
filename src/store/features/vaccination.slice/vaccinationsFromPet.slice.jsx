import {createSlice} from '@reduxjs/toolkit';
import {getVaccinationsFromPetThunk} from '../../apiThunk/vaccinationThunk';

export const vaccinationsFromPetSlice = createSlice({
  name: 'vaccinationsFromPet',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getVaccinationsFromPetThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getVaccinationsFromPetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getVaccinationsFromPetThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default vaccinationsFromPetSlice.reducer;
