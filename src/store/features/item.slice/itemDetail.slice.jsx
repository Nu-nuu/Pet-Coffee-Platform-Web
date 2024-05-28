import {createSlice} from '@reduxjs/toolkit';
import {getItemDetailThunk} from '../../apiThunk/itemThunk';

export const itemDetailSlice = createSlice({
  name: 'itemDetail',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getItemDetailThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getItemDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getItemDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default itemDetailSlice.reducer;
