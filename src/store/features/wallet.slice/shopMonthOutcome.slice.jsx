import { createSlice } from "@reduxjs/toolkit";
import { getShopMonthOutcomeThunk } from "../../apiThunk/walletThunk";

export const shopMonthOutcomeSlice = createSlice({
    name: "shopMonthOutcome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getShopMonthOutcomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getShopMonthOutcomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getShopMonthOutcomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default shopMonthOutcomeSlice.reducer;
