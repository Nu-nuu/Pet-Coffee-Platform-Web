import {createSlice} from '@reduxjs/toolkit';
import {getAllFollowShopsThunk} from '../../apiThunk/followShopThunk';

export const allFollowShopsSlice = createSlice({
  name: 'allFollowShops',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getAllFollowShopsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getAllFollowShopsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getAllFollowShopsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default allFollowShopsSlice.reducer;
