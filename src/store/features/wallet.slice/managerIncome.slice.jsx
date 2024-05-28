import { createSlice } from "@reduxjs/toolkit";
import { getManagerIncomeThunk } from "../../apiThunk/walletThunk";

export const managerIncomeSlice = createSlice({
    name: "managerIncome",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getManagerIncomeThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getManagerIncomeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getManagerIncomeThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default managerIncomeSlice.reducer;
