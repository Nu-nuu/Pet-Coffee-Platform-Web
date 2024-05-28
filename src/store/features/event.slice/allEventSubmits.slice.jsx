import { createSlice } from "@reduxjs/toolkit";
import { getAllEventSubmitsThunk } from "../../apiThunk/eventThunk";

export const allEventSubmitsSlice = createSlice({
    name: "allEventSubmits",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getAllEventSubmitsThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getAllEventSubmitsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getAllEventSubmitsThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default allEventSubmitsSlice.reducer;
