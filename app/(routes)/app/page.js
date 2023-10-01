"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authorizeAppOnly, getUserAuthAccessToken } from "@/app/reddit-api/reddit.js";
import { setAccessToken } from "@/app/redux/features/Reddit/redditSlice";
import { getStateString } from "@/app/utilities";
import { selectGeneratedString } from "@/app/redux/features/Reddit/redditSlice";


export default function App() {
    // store hook in variable so it can be used in the body of
    // functions other than Component Functions
    const dispatch = useDispatch();

    // Get the state string from Reddit slice
    const generatedStateString = getStateString();

    // Variables to store url parameter values
    let params = "";
    let state = "";
    let code = "";

    useEffect(() => {
        // We check to see if the URL has a params named "state" and "code". 
        // If it does, it signifies the User has authorized the app and has been redirected successfully.
        // *window can only be accessed in the browser which we can access in useState.
        params = new URLSearchParams(window.location.search);
        state = params.get("state");
        code = params.get("code");

        if (state && code) {
            console.log(`generatedStateString = ${generatedStateString}, state param = ${state}`);
            // Check if the returned state string matches the stored / generated state string
            if (generatedStateString === state) {
                // Get the Access Token using state and code
                getUserAuthAccessToken(state, code);
            }
            else {
                console.log('state strings do not match!');
            }
        }
        else {
            authorizeAppOnly()
                .then(token => {
                    // setAccessToken(token.data.access_token);
                    dispatch(setAccessToken({ accessToken: token.data.access_token }));
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