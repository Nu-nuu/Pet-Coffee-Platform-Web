import {createSlice} from '@reduxjs/toolkit';
import {getVaccinationDetailThunk} from '../../apiThunk/vaccinationThunk';

export const vaccinationDetailSlice = createSlice({
  name: 'vaccinationDetail',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getVaccinationDetailThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getVaccinationDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getVaccinationDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default vaccinationDetailSlice.reducer;
