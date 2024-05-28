import {createSlice} from '@reduxjs/toolkit';
import {getAreasFromShopThunk} from '../../apiThunk/areaThunk';

export const areasFromShopSlice = createSlice({
  name: 'areasFromShop',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getAreasFromShopThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getAreasFromShopThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getAreasFromShopThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default areasFromShopSlice.reducer;
