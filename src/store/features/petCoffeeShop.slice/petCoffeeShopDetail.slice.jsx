import { createSlice } from "@reduxjs/toolkit";
import { getPetCoffeeShopDetailThunk } from "../../apiThunk/petCoffeeShopThunk";

export const petCoffeeShopDetailSlice = createSlice({
    name: "petCoffeeShopDetail",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
             
            .addCase(getPetCoffeeShopDetailThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPetCoffeeShopDetailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPetCoffeeShopDetailThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default petCoffeeShopDetailSlice.reducer;
