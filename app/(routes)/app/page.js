"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authorizeAppOnly, getUserAuthAccessToken, getUserInfo } from "@/app/reddit-api/reddit.js";
import { checkGameTitle } from "@/app/videogame-db-api/vgdb";
import { setAccessToken } from "@/app/redux/features/Reddit/redditSlice";
import { setLoggedIn, selectLoggedInStatus } from "@/app/redux/features/User/userSlice";
import SearchForm from "@/app/components/SearchForm";

export default function App() {
    // store hook in variable so it can be used in the body of
    // functions other than Component Functions
    const dispatch = useDispatch();

    const [accessToken, setAccessToken] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [redditUsername, setRedditUsername] = useState("");

    /*
     The useRef Hook allows you to persist values between renders.
     It can be used to store a mutable value that does not cause a re-render when updated.
     It is used here to prevent calling useEffect and twice which causes the 'code' URL parameter to
     be parsed twice, resulting in the second value being passed as a function parameter to getUserAuthAccessToken()
     This causes the API call to fail with a 404 status as it is expecting the first 'code' url parameter value.
    */
    const accessTokenRef = useRef(false);

    // Get Access Token
    useEffect(() => {
        // If we have already fetched the access token, return.
        if (accessTokenRef.current) return;

        // Otherwise, set accessTokenRef to true and get access token
        accessTokenRef.current = true;

        // We check to see if the URL has params named "state" and "code". 
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
                // Get the Access Token using code                
                getUserAuthAccessToken(code)
                    .then(token => {
                        // Set the access token state variable
                        setAccessToken(token);

                        // Set bool to indicate User is logged in to their Reddit account
                        setLoggedIn(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                return "State strings do not match!";
            }
        }
        else {
            authorizeAppOnly()
                .then(token => {

                    // Set the access token state variable
                    setAccessToken(token);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    
    // Get user's Reddit profile name
    useEffect(() => {
        if (loggedIn) {
            getUserInfo(accessToken)
                .then(res => {
                    setRedditUsername(res.data.name);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [loggedIn]);

    // State variable for the Search Bar input
    const [searchBarInput, setSearchBarInput] = useState("");

    // State variable for the game title search result
    const [gameTitleSearchResult, setGameTitleSearchResult] = useState("");

    // Updates the searchBarInput state on every change to the input field
    function handleSearchBarInput(event) {
        // Set the state variable
        setSearchBarInput(event.target.value);
    }

    // Handle search form submit
    async function handleSearchSubmit(event) {
        event.preventDefault(); // Prevents the page from reloading on submit

        // Confirm user input is a valid game title by calling RAWG API
        const result = await checkGameTitle(searchBarInput);

        if (result) {
            setGameTitleSearchResult(`Searching for: ${result}`);

            // TODO: Search Reddit for this game...

        } else {
            setGameTitleSearchResult(`Sorry, no game found`);
        }

        // Get the access token from the Reddit Slice
        const accessToken = "";

        // Call the Reddit API
        // let searchResults = await someFunc(searchBarInput);

        // Process response
        // const postsArray = getPosts(searchResults);

        // Add posts to the posts slice        
    }


    return (
        <>
            <p>{redditUsername}</p>
            <SearchForm handleSearchSubmit={handleSearchSubmit} searchBarInput={searchBarInput} handleSearchBarInput={handleSearchBarInput} />
            <br />
            <p>{gameTitleSearchResult}</p>
        </>
    )
}