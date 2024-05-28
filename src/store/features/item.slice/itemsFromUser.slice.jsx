import {createSlice} from '@reduxjs/toolkit';
import {getItemsFromUserThunk} from '../../apiThunk/itemThunk';

export const itemsFromUserSlice = createSlice({
  name: 'itemsFromUser',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getItemsFromUserThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getItemsFromUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getItemsFromUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default itemsFromUserSlice.reducer;
