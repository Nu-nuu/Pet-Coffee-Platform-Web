import {createSlice} from '@reduxjs/toolkit';
import {getEventsFromShopThunk} from '../../apiThunk/eventThunk';

export const eventsFromShopSlice = createSlice({
  name: 'eventsFromShop',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getEventsFromShopThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getEventsFromShopThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getEventsFromShopThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default eventsFromShopSlice.reducer;
