// postsSlice.js - This file creates a Posts 'slice' including the corresponding Reducer and Action Creators

import { createSlice } from "@reduxjs/toolkit";

// Create Slice
export const postsSlice = createSlice({
    name: 'posts',
    initialState: { posts: {} },
    reducers: {
        addPost: (state, action) => {
            
        },
        removePost: (state, action) => {
            
        }
    }
})

// Export action creator(s)
export const { addPost } = postsSlice.actions;
export const { removePost } = postsSlice.actions;

// Export the selectors
export const selectPosts = (state) => state.posts;

// Export the reducer
export default postsSlice.reducer;
