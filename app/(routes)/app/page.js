"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useState, useEffect, useRef, useContext } from "react";
import { userAuthorizeApp, authorizeAppOnly, getUserAuthAccessToken, getUserInfo } from "@/app/api/reddit.js";
import { checkGameTitle } from "@/app/api/vgdb";
import { processPosts } from "@/app/processPostData";
import SearchForm from "@/app/components/SearchForm";
import Tile from "@/app/components/Tile.js";
import Link from "next/link";
import { ctx } from "@/app/components/providers";

export default function App() {

    const context = useContext(ctx);                                            // The React Context 'Provider' component    
    const setNavContent = context[1];                                           // Used to set the state of the navbar content        
    const [accessToken, setAccessToken] = useState("");                         // Reddit access token
    const [loggedIn, setLoggedIn] = useState(false);                            // Status representing if user is logged in to Reddit or not        
    const [searchBarInput, setSearchBarInput] = useState("");                   // The text entered into the search bar
    const [gameTitles, setGameTitles] = useState([]);                           // Array of results returned by RAWG API
    const [matchTitleExactly, setMatchTitleExactly] = useState(false);          // Toggled by the 'match title exactly' checkbox    
    const [gameTitle, setGameTitle] = useState("");                             // Title of game being searched for
    const [gameYear, setGameYear] = useState("");                               // Release year of game being searched for
    const [gamePlatform, setGamePlatform] = useState([]);                       // Platform of the game being searched for
    const [platformOptions, setPlatformOptions] = useState([]);                 // Used to populate the <select> element of playforms the game has released on
    const [selectedPlatform, setSelectedPlatform] = useState("");               // The platform that the user has selected from the drop-down menu
    const [searchButtonDisabled, setSearchButtonDisabled] = useState(true);     // Toggles the search button enabled / disabled   
    const [gameMetacritic, setGameMetacritic] = useState("");                   // The Metacritic score of the game being searched for
    const [posts, setPosts] = useState([]);                                     // The array of formatted post objects to be rendered
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);                // Used for conditionally rendering the posts or "Loading..." if fetching posts    
    const [selectedGame, setSelectedGame] = useState({});                       // An object returned by RAWG API representing the selected game
    const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);        // Used for conditionally rendering the platforms <select> element

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
                    // Set the navbar content to a Login button
                    setNavContent(<button onClick={userAuthorizeApp} className="text-emerald-50 transition ease-in-out bg-emerald-800 hover:bg-emerald-900 duration-300 font-bold text-sm p-2 rounded sm:text-lg sm:mr-5">Log in to Reddit</button>);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    // Get user's Reddit profile name
    useEffect(() => {
        if (loggedIn) {
            // Set navbar content to loading message while fetching username
            setNavContent("Loading...");
            getUserInfo(accessToken)
                .then(res => {
                    // Set the navbar content to the Reddit username which links to their Reddit profile
                    setNavContent(<Link href={`https://www.reddit.com/user/${res}`} className="text-emerald-500 transition ease-in-out hover:text-emerald-200 duration-300 font-bold text-sm sm:text-lg sm:mr-5">u/{res}</Link>);
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
    }

    // This useEffect instance:
    // 1. Populates the Game titles drop down list
    // 2. Populates the Platforms drop down list
    // Debouncing function:
    // This useEffect instance RUNS every time there is a change to searchBarInput,
    // including when a game is selected from the drop-down list (which counts as a change to searchBarInput and a call to RAWG API)
    // However, "fetchData" is only EXECUTED once every 300ms to prevent calling RAWG API for every char entered in input.
    useEffect(() => {
        // Clear the platform options
        setPlatformOptions([]);

        // Disable search button
        setSearchButtonDisabled(true);

        // Debouncing function:
        const fetchData = setTimeout(async () => {
            // Check for input in the search bar
            if (searchBarInput) {
                // Do a search for games matching user input:
                setIsLoadingPlatforms(true);
                let gameTitleSearchResults = await checkGameTitle(searchBarInput);

                // Populate the games menu
                const matchingGameTitles = [];
                if (gameTitleSearchResults && !gameTitles.includes(searchBarInput)) {
                    gameTitleSearchResults.forEach(result => {
                        matchingGameTitles.push(result.name);
                    });
                    // Set the state variable
                    setGameTitles(matchingGameTitles);
                }

                // If the search bar input matches a game in the results:
                if (matchingGameTitles.includes(searchBarInput) || gameTitles.includes(searchBarInput)) {
                    // Display platforms
                    gameTitleSearchResults.forEach(result => {
                        if (result.name === searchBarInput) {
                            // Set the platforms
                            setPlatformOptions(result.platforms);
                            // Set the selected game
                            setSelectedGame(result);
                        }
                    });
                    setIsLoadingPlatforms(false);
                }
            }
            else {
                // If search bar is empty, clear the drop down menu of game titles
                setGameTitles([]);
                setIsLoadingPlatforms(false);
            }
        }, 300)

        // Destroy instance of the useEffect Hook using return
        // Then call clearTimeout to cancel the previous 'timeOut' that was created using 'callTimeout'
        return () => clearTimeout(fetchData);
    }, [searchBarInput])

    // Handles the selection of an <option> from the platform <select> element
    // Also toggles the search button enabled / disabled depending on if a platform has been selected
    function handleSelectPlatform(event) {
        if (event.target.value) {
            setSelectedPlatform(event.target.value);
            setSearchButtonDisabled(false);
        }
        else {
            setSearchButtonDisabled(true);
        }
    }

    // Handle 'match title exactly' checkbox
    function handleMatchExactlyCheckbox() {
        // Toggle match exactly true/false
        setMatchTitleExactly(!matchTitleExactly);
    }

    // Sets the game info
    function setGameInfo(game) {        
        // Set the values for the game
        setGameTitle(game.name);
        if (game.released) {
            setGameYear(game.released.match(/\d{4}/));
        }
        else {
            setGameYear("N/A");
        }
        setGamePlatform(selectedPlatform);
        setGameMetacritic(game.metacritic);
    }

    // Handle search form submit
    async function handleSearchSubmit(event) {
        // Prevents the page from reloading on submit
        event.preventDefault();

        // Set loading to true when fetching data
        setIsLoadingPosts(true);

        // Set the game info to display
        setGameInfo(selectedGame);

        // Get an array of formatted post objects ready for rendering        
        const formattedPostsArray = await processPosts(accessToken, selectedGame.name, selectedPlatform, matchTitleExactly);

        // Set the state variable
        setPosts(formattedPostsArray);

        // Set loading to false after fetching data
        setIsLoadingPosts(false);
    }

    return (
        <>
            <SearchForm isLoadingPlatforms={isLoadingPlatforms} handleSearchSubmit={handleSearchSubmit} searchBarInput={searchBarInput} searchButtonDisabled={searchButtonDisabled} platformOptions={platformOptions} selectedPlatform={selectedPlatform} handleSelectPlatform={handleSelectPlatform} handleSearchBarInput={handleSearchBarInput} gameTitles={gameTitles} handleMatchExactlyCheckbox={handleMatchExactlyCheckbox} matchTitleExactly={matchTitleExactly} />            
            <div className="bg-gray-500 rounded-xl text-white my-5 mx-3 py-4 text-center sm:text-lg lg:w-[1000px] lg:mx-auto">
                <div>
                    {isLoadingPosts ? <p><b className="text-emerald-100">Search Results: </b>Loading...</p> : <p><b className="text-emerald-100">Search Results: </b>{posts.length}</p>}
                    <br />
                    <p><b className=" text-emerald-100">Title: </b>{gameTitle}</p>
                    <p><b className=" text-emerald-100">Release Year: </b>{gameYear}</p>
                    <p><b className=" text-emerald-100">Platform: </b>{gamePlatform}</p>
                    <p><b className=" text-emerald-100">Metacritic score: </b>{gameMetacritic ? gameMetacritic : ""}</p>                    
                </div>
            </div>
            {isLoadingPosts ? <p className="text-white font-bold text-center">Loading posts...</p> : posts.map((post, index) => { return <Tile key={index} post={post} loggedIn={loggedIn} userAuthorizeApp={userAuthorizeApp} accessToken={accessToken} /> })}
        </>
    )
}