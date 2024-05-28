import {createSlice} from '@reduxjs/toolkit';
import {getAllPetCoffeeShopsThunk} from '../../apiThunk/petCoffeeShopThunk';

export const allPetCoffeeShopsSlice = createSlice({
  name: 'allPetCoffeeShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getAllPetCoffeeShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getAllPetCoffeeShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getAllPetCoffeeShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default allPetCoffeeShopsSlice.reducer;
