import {createSlice} from '@reduxjs/toolkit';
import {getPetsFromShopThunk} from '../../apiThunk/petThunk';

export const petsFromShopSlice = createSlice({
  name: 'petsFromShop',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getPetsFromShopThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getPetsFromShopThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getPetsFromShopThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default petsFromShopSlice.reducer;
