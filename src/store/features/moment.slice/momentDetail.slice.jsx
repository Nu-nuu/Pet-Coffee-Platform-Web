import {createSlice} from '@reduxjs/toolkit';
import {getMomentDetailThunk} from '../../apiThunk/momentThunk';

export const momentDetailSlice = createSlice({
  name: 'momentDetail',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getMomentDetailThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getMomentDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getMomentDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default momentDetailSlice.reducer;
