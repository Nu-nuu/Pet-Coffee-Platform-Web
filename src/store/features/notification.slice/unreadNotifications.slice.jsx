import { createSlice } from "@reduxjs/toolkit";
import { getUnreadNotificationsThunk } from "../../apiThunk/notificationThunk";

export const unreadNotificationsSlice = createSlice({
    name: "unreadNotifications",
    initialState: {
        entities: [],
        draft: [],
        loading: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getUnreadNotificationsThunk.pending, (state) => {
                state.loading = true;
                state.loading = "loading";
                state.error = null;
            })
            .addCase(getUnreadNotificationsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = "succeeded";
                state.entities = action.payload;
            })
            .addCase(getUnreadNotificationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export default unreadNotificationsSlice.reducer;
