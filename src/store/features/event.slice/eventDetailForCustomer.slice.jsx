import {createSlice} from '@reduxjs/toolkit';
import {getEventDetailForCustomerThunk} from '../../apiThunk/eventThunk';

export const eventDetailForCustomerSlice = createSlice({
  name: 'eventDetailForCustomer',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getEventDetailForCustomerThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getEventDetailForCustomerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getEventDetailForCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default eventDetailForCustomerSlice.reducer;
