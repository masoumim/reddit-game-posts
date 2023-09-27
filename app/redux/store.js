// store.js - This file is the main source of state for the app
// Each of the app's slice's reducers are imported, combined and exported as a single reducer.
// The resulting reducer is imported into root layout.js file so that state can be accessed from anywhere in the app.

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./features/Posts/postsSlice.js"

export const store = configureStore({
    reducer: {
        posts: postsReducer
    }
})