import { createSlice } from "@reduxjs/toolkit";
import { getPlatformIncomeThunk } from "../../apiThunk/walletThunk";

export const platformIncomeSlice = createSlice({
    name: "platformIncome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getPlatformIncomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getPlatformIncomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getPlatformIncomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default platformIncomeSlice.reducer;
