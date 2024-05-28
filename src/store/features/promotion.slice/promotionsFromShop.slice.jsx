import { createSlice } from "@reduxjs/toolkit";
import { getPromotionsFromShopThunk } from "../../apiThunk/promotionThunk";

export const promotionsFromShopSlice = createSlice({
    name: "promotionsFromShop",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getPromotionsFromShopThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPromotionsFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPromotionsFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default promotionsFromShopSlice.reducer;
