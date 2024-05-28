import { createSlice } from "@reduxjs/toolkit";
import { getShopOutcomeThunk } from "../../apiThunk/walletThunk";

export const shopOutcomeSlice = createSlice({
    name: "shopOutcome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getShopOutcomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getShopOutcomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getShopOutcomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default shopOutcomeSlice.reducer;
