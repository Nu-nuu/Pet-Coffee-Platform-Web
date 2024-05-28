import { createSlice } from "@reduxjs/toolkit";
import { getOrdersFromShopThunk } from "../../apiThunk/orderThunk";

export const ordersFromShopSlice = createSlice({
    name: "ordersFromShop",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getOrdersFromShopThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getOrdersFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getOrdersFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default ordersFromShopSlice.reducer;
