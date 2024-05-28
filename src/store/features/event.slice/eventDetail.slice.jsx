import {createSlice} from '@reduxjs/toolkit';
import {getEventDetailThunk} from '../../apiThunk/eventThunk';

export const eventDetailSlice = createSlice({
  name: 'eventDetail',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getEventDetailThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getEventDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getEventDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default eventDetailSlice.reducer;
