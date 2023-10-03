// userSlice.js - This file creates a User 'slice' including the corresponding Reducer and Action Creators

import { createSlice } from "@reduxjs/toolkit";

// Create Slice
export const userSlice = createSlice({
    name: 'user',
    initialState: { loggedIn: false, name: "" },
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;   
        }
    }
})

// Export action creator(s)
export const { setLoggedIn, setName } = userSlice.actions;

// Export the selectors
export const selectLoggedInStatus = (state) => state.loggedIn;
export const selectName = (state) => state.name;

// Export the reducer
export default userSlice.reducer;
