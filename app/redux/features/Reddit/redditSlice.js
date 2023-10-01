// redditSlice.js - This file creates a Reddit 'slice' including the corresponding Reducer and Action Creators
// This slice handles the state of values used by the Reddit API: https://github.com/reddit-archive/reddit/wiki/OAuth2

import { createSlice } from "@reduxjs/toolkit";

// Create Slice
export const redditSlice = createSlice({
    name: 'reddit',
    initialState: { generatedStateString: "", accessToken: "", redditCode: ""},
    reducers: {
        setGeneratedStateString: (state, action) => {
            console.log(`inside redditSlice - setGeneratedStateString - action.payload = ${action.payload.generatedStateString}`);
            state.generatedStateString = action.payload.generatedStateString;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRedditCode: (state, action) => {
            state.redditCode = action.payload;
        }
    }
})

// Export action creator(s)
export const { setGeneratedStateString, setAccessToken, setRedditCode } = redditSlice.actions;

// Export the selectors
export const selectGeneratedString = (state) => state.generatedStateString;
export const selectAccessToken = (state) => state.accessToken;
export const selectRedditCode = (state) => state.redditCode;

// Export the reducer
export default redditSlice.reducer;
