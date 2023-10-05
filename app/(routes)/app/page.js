"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useState, useEffect, useRef } from "react";
import { authorizeAppOnly, getUserAuthAccessToken, getUserInfo, getRedditPosts } from "@/app/reddit-api/reddit.js";
import { checkGameTitle } from "@/app/videogame-db-api/vgdb";
import SearchForm from "@/app/components/SearchForm";
import { processPosts } from "@/app/processPostData";

export default function App() {

    const [isLoading, setIsLoading] = useState(false);                          // Used to conditionally render data while fetching
    const [accessToken, setAccessToken] = useState("");                         // Reddit access token
    const [loggedIn, setLoggedIn] = useState(false);                            // Status representing if user is logged in to Reddit or not    
    const [redditUsername, setRedditUsername] = useState("");                   // The user's Reddit username
    const [searchBarInput, setSearchBarInput] = useState("");                   // The text entered into the search bar
    const [gameTitle, setGameTitle] = useState("");                             // Set to a valid title if returned by RAWG API call

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
            setIsLoading(true);
            getUserInfo(accessToken)
                .then(res => {
                    setRedditUsername(res.data.name);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [loggedIn]);

    // Updates the searchBarInput state on every change to the input field
    function handleSearchBarInput(event) {
        // Set the state variable
        setSearchBarInput(event.target.value);
    }

    // Handle search form submit
    async function handleSearchSubmit(event) {
        event.preventDefault(); // Prevents the page from reloading on submit

        // Confirm user input is a valid game title by calling RAWG API
        const gameTitleSearchResult = await checkGameTitle(searchBarInput);

        if (gameTitleSearchResult) {
            // Display the game title                        
            setGameTitle(`Searching for: ${gameTitleSearchResult.name}`);

            // Search Reddit for this game            
            const redditSearchResults = await getRedditPosts(accessToken, gameTitleSearchResult.name);

            // Process response - Returns a formatted array of Post Objects
            // redditSearchResults.data.data.children = array of returned reddit posts
            // gameTitleSearchResult.tags = array of tags related to the game title
            // gameTitleSearchResult.platforms = array of platforms the game released on
            const postsArray = processPosts(redditSearchResults.data.data.children, gameTitleSearchResult.tags, gameTitleSearchResult.platforms, gameTitleSearchResult.name);
        } else {
            setGameTitle(`Sorry, no game found`);
        }
    }


    return (
        <>
            {isLoading ? <p>Loading...</p> : redditUsername}
            <SearchForm handleSearchSubmit={handleSearchSubmit} searchBarInput={searchBarInput} handleSearchBarInput={handleSearchBarInput} />
            <br />
            <p>{gameTitle}</p>
        </>
    )
}