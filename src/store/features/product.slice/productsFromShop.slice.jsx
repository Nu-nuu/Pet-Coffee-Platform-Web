import { createSlice } from "@reduxjs/toolkit";
import { getProductsFromShopThunk } from "../../apiThunk/productThunk";

export const productsFromShopSlice = createSlice({
    name: "productsFromShop",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getProductsFromShopThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getProductsFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getProductsFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default productsFromShopSlice.reducer;
