import {createSlice} from '@reduxjs/toolkit';
import {getPetsFromAreaThunk} from '../../apiThunk/petThunk';

export const petsFromAreaSlice = createSlice({
  name: 'petsFromArea',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getPetsFromAreaThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getPetsFromAreaThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getPetsFromAreaThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default petsFromAreaSlice.reducer;
