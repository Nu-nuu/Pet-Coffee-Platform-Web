import { createSlice } from "@reduxjs/toolkit";
import { getPlatformMonthIncomeThunk } from "../../apiThunk/walletThunk";

export const platformMonthIncomeSlice = createSlice({
    name: "platformMonthIncome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getPlatformMonthIncomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPlatformMonthIncomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPlatformMonthIncomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default platformMonthIncomeSlice.reducer;
