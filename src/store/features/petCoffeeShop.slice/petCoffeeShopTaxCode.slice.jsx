import { createSlice } from "@reduxjs/toolkit";
import { getPetCoffeeShopTaxCodeThunk } from "../../apiThunk/petCoffeeShopThunk";

export const petCoffeeShopTaxCodeSlice = createSlice({
    name: "petCoffeeShopTaxCode",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
             
            .addCase(getPetCoffeeShopTaxCodeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPetCoffeeShopTaxCodeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPetCoffeeShopTaxCodeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default petCoffeeShopTaxCodeSlice.reducer;
