import {createSlice} from '@reduxjs/toolkit';
import {getAreaDetailThunk} from '../../apiThunk/areaThunk';

export const areaDetailSlice = createSlice({
  name: 'areaDetail',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getAreaDetailThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getAreaDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getAreaDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default areaDetailSlice.reducer;
