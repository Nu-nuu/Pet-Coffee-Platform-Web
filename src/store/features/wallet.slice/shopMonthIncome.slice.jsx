import { createSlice } from "@reduxjs/toolkit";
import { getShopMonthIncomeThunk } from "../../apiThunk/walletThunk";

export const shopMonthIncomeSlice = createSlice({
    name: "shopMonthIncome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getShopMonthIncomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getShopMonthIncomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getShopMonthIncomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default shopMonthIncomeSlice.reducer;
