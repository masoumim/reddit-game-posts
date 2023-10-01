"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useEffect } from "react";
import { authorizeAppOnly } from "@/app/reddit-api/reddit";

export default function App() {    
    let params = "";
    let state = "";
    let code = "";
        
    // We check to see if the URL has a params named "state" and "code". 
    // If it does, it signifies the User has authorized the app and has been redirected successfully.
    // *window can only be accessed in the browser, node has no 'window' definition.
    useEffect(() => {        
        params = new URLSearchParams(window.location.search);
        state = params.get("state");
        code = params.get("code");
        
        if(state && code){
            // TODO: Get the Access Token using state and code
            // TODO: Set a 'redditSlice's state's state, code and accessToken state
        }
        else{
            // TODO: Have authorizeAppOnly() set 'redditSlice's state's accessToken state
            authorizeAppOnly();
        }
    }, []);

    return (
        <>

        </>
    )
}