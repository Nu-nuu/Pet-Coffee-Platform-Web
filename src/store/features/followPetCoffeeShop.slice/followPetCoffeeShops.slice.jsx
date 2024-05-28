import {createSlice} from '@reduxjs/toolkit';
import {getFollowShopsThunk} from '../../apiThunk/followShopThunk';

export const followPetCoffeeShopsSlice = createSlice({
  name: 'followPetCoffeeShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getFollowShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getFollowShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getFollowShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default followPetCoffeeShopsSlice.reducer;
