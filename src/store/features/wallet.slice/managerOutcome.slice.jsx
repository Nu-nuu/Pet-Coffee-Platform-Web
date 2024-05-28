import { createSlice } from "@reduxjs/toolkit";
import { getManagerOutcomeThunk } from "../../apiThunk/walletThunk";

export const managerOutcomeSlice = createSlice({
    name: "managerOutcome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getManagerOutcomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getManagerOutcomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getManagerOutcomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default managerOutcomeSlice.reducer;
