"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authorizeAppOnly, getUserAuthAccessToken } from "@/app/reddit-api/reddit.js";
import { setAccessToken } from "@/app/redux/features/Reddit/redditSlice";

export default function App() {
    // store hook in variable so it can be used in the body of
    // functions other than Component Functions
    const dispatch = useDispatch();

    useEffect(() => {
        // We check to see if the URL has a params named "state" and "code". 
        // If it does, it signifies the User has authorized the app and has been redirected successfully.
        // *window can only be accessed in the browser which we can access in useState.
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");
        const code = params.get("code");

        if (state && code) {
            // Retrieve the initially generated state string
            const stateString = window.sessionStorage.getItem("stateString");

            // Check if the state string in the URL matches the initially generated string
            if (stateString === state) {
                // Get the Access Token using state and code
                getUserAuthAccessToken(state, code);
            }
            else {
                return "State strings do not match!";
            }
        }
        else {
            authorizeAppOnly()
                .then(token => {                                        
                    dispatch(setAccessToken(token));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    return (
        <>
            <p>App content...</p>
        </>
    )
}