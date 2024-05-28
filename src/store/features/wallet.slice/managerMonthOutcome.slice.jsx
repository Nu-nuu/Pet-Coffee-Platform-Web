import { createSlice } from "@reduxjs/toolkit";
import { getManagerMonthOutcomeThunk } from "../../apiThunk/walletThunk";

export const managerMonthOutcomeSlice = createSlice({
    name: "managerMonthOutcome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getManagerMonthOutcomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getManagerMonthOutcomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getManagerMonthOutcomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default managerMonthOutcomeSlice.reducer;
