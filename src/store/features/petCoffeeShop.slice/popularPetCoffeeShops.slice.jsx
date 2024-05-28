import {createSlice} from '@reduxjs/toolkit';
import {getPopularPetCoffeeShopsThunk} from '../../apiThunk/petCoffeeShopThunk';

export const popularPetCoffeeShopsSlice = createSlice({
  name: 'popularPetCoffeeShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getPopularPetCoffeeShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getPopularPetCoffeeShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getPopularPetCoffeeShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default popularPetCoffeeShopsSlice.reducer;
