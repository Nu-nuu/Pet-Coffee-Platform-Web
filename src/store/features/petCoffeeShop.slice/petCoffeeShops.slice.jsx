import {createSlice} from '@reduxjs/toolkit';
import {getPetCoffeeShopsThunk} from '../../apiThunk/petCoffeeShopThunk';

export const petCoffeeShopsSlice = createSlice({
  name: 'petCoffeeShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getPetCoffeeShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getPetCoffeeShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getPetCoffeeShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default petCoffeeShopsSlice.reducer;
