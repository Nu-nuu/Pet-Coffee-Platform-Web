import { createSlice } from "@reduxjs/toolkit";
import { getTransationsFromShopThunk } from "../../apiThunk/transactionThunk";

export const transactionsFromShopSlice = createSlice({
    name: "transactionsFromShop",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getTransationsFromShopThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getTransationsFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getTransationsFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default transactionsFromShopSlice.reducer;
