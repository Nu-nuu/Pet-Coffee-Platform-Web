import {createSlice} from '@reduxjs/toolkit';
import {getJoinEventsThunk} from '../../apiThunk/eventThunk';

export const joinEventsSlice = createSlice({
  name: 'joinEvents',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getJoinEventsThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getJoinEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getJoinEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default joinEventsSlice.reducer;
