import {createSlice} from '@reduxjs/toolkit';
import {getMomentsFromPetThunk} from '../../apiThunk/momentThunk';

export const momentsFromPetSlice = createSlice({
  name: 'momentsFromPet',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getMomentsFromPetThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getMomentsFromPetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getMomentsFromPetThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default momentsFromPetSlice.reducer;
