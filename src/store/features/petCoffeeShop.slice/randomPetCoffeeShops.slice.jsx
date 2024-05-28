import {createSlice} from '@reduxjs/toolkit';
import {getRandomPetCoffeeShopsThunk} from '../../apiThunk/petCoffeeShopThunk';

export const randomPetCoffeeShopsSlice = createSlice({
  name: 'randomPetCoffeeShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRandomPetCoffeeShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getRandomPetCoffeeShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getRandomPetCoffeeShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default randomPetCoffeeShopsSlice.reducer;
