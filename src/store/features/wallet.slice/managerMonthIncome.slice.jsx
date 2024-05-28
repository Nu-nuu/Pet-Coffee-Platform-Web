import { createSlice } from "@reduxjs/toolkit";
import { getManagerMonthIncomeThunk } from "../../apiThunk/walletThunk";

export const managerMonthIncomeSlice = createSlice({
    name: "managerMonthIncome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getManagerMonthIncomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getManagerMonthIncomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getManagerMonthIncomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default managerMonthIncomeSlice.reducer;
