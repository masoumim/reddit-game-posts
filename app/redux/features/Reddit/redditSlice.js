// redditSlice.js - This file creates a Reddit 'slice' including the corresponding Reducer and Action Creators
// This slice handles the state of values used by the Reddit API: https://github.com/reddit-archive/reddit/wiki/OAuth2

import { createSlice } from "@reduxjs/toolkit";

// Create Slice
export const redditSlice = createSlice({
    name: 'reddit',
    initialState: { accessToken: "", redditCode: ""},
    reducers: {
        setAccessToken: (state, action) => {            
            state.accessToken = action.payload;
        },
        setRedditCode: (state, action) => {
            state.redditCode = action.payload;
        }
    }
})

// Export action creator(s)
export const { setAccessToken, setRedditCode } = redditSlice.actions;

// Export the selectors
export const selectAccessToken = (state) => state.reddit.accessToken;
export const selectRedditCode = (state) => state.reddit.redditCode;

// Export the reducer
export default redditSlice.reducer;
