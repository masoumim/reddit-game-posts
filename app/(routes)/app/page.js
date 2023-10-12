"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useState, useEffect, useRef } from "react";
import { authorizeAppOnly, getUserAuthAccessToken, getUserInfo, getRedditPosts } from "@/app/api/reddit.js";
import { checkGameTitle } from "@/app/api/vgdb";
import SearchForm from "@/app/components/SearchForm";
import { processPosts } from "@/app/processPostData";

export default function App() {

    const [isLoading, setIsLoading] = useState(false);                          // Used to conditionally render data while fetching
    const [accessToken, setAccessToken] = useState("");                         // Reddit access token
    const [loggedIn, setLoggedIn] = useState(false);                            // Status representing if user is logged in to Reddit or not    
    const [redditUsername, setRedditUsername] = useState("");                   // The user's Reddit username
    const [searchBarInput, setSearchBarInput] = useState("");                   // The text entered into the search bar
    const [gameTitles, setGameTitles] = useState([]);                           // Array of results returned by RAWG API
    const [matchTitleExactly, setMatchTitleExactly] = useState(false);          // Toggled by the 'match title exactly' checkbox
    const [displayGameInfo, setDisplayGameInfo] = useState(false);              // Toggled when search for title is performed and result is received
    const [gameTitle, setGameTitle] = useState("");                             // Title of game being searched for
    const [gameYear, setGameYear] = useState("");                               // Release year of game being searched for
    const [gamePlatforms, setGamePlatforms] = useState([]);                     // Platforms of the game being searched for
    const [gameMetacritic, setGameMetacritic] = useState("");                   // The Metacritic score of the game being searched for

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
                    setRedditUsername(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [loggedIn]);

    // Updates the searchBarInput state on every change to the input field
    async function handleSearchBarInput(event) {

        // Set the state variable
        setSearchBarInput(event.target.value);

        // Create empty array to hold matching game titles
        const matchingGameTitles = [];

        // Do a search for games matching user input
        const gameTitleSearchResults = await checkGameTitle(event.target.value);

        // Populate the matchingGameTitles array for each result returned by the API
        if (gameTitleSearchResults) {
            gameTitleSearchResults.forEach(result => {
                matchingGameTitles.push(result.name);
            });
        }

        // Set the state variable
        setGameTitles(matchingGameTitles);
    }

    // Handle 'match title exactly' checkbox
    function handleMatchExactlyCheckbox() {
        // Toggle match exactly true/false
        setMatchTitleExactly(!matchTitleExactly);
    }

    // Sets the game info
    function setGameInfo(game) {
        // Toggle state boolean
        setDisplayGameInfo(true);
        
        // Get the name each platform the game released on
        const platforms = game.platforms.map(e => {return e.platform.name});
        
        // Set the values for the game
        setGameTitle(game.name);
        setGameYear(game.released.match(/\d{4}/));        
        setGamePlatforms(platforms);
        setGameMetacritic(game.metacritic);
    }

    // Handle search form submit
    async function handleSearchSubmit(event) {
        event.preventDefault(); // Prevents the page from reloading on submit

        // We want the first result (index 0) in the returned array
        const gameTitleSearchResult = await checkGameTitle(searchBarInput);
        
        // Set the game info (title, year, platforms etc)
        setGameInfo(gameTitleSearchResult[0]);

        // Search Reddit for this game. Returns an array of posts         
        const redditSearchResults = await getRedditPosts(accessToken, gameTitleSearchResult[0].name, matchTitleExactly);
        
        // Process response - Returns a formatted array of Post Objects
        // redditSearchResults.data.data.children = array of returned reddit posts
        // gameTitleSearchResult[0].tags = array of tags related to the game title
        // gameTitleSearchResult[0].platforms = array of platforms the game released on
        if (redditSearchResults) {            
            const postsArray = processPosts(redditSearchResults, gameTitleSearchResult[0].tags, gameTitleSearchResult[0].platforms, gameTitleSearchResult[0].name);
        }
    }

    return (
        <>
            {isLoading ? <p>Loading...</p> : redditUsername}
            <SearchForm handleSearchSubmit={handleSearchSubmit} searchBarInput={searchBarInput} handleSearchBarInput={handleSearchBarInput} gameTitles={gameTitles} handleMatchExactlyCheckbox={handleMatchExactlyCheckbox} matchTitleExactly={matchTitleExactly} />
            <br />
            {displayGameInfo ?
                <>
                    <p><b>Title: </b>{gameTitle}</p>
                    <p><b>Release Year: </b>{gameYear}</p>
                    <p><b>Platform(s): </b>{gamePlatforms.join(", ")}</p>
                    <p><b>Metacritic score: </b>{gameMetacritic ? gameMetacritic : "N/A"}</p>
                </>
                : ""}

        </>
    )
}