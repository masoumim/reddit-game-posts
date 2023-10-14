"use client";
// page.js - This file establishes the route: /app
// This page will render all of the content for the app.

import { useState, useEffect, useRef } from "react";
import { authorizeAppOnly, getUserAuthAccessToken, getUserInfo, getRedditPosts, getPostTopComment } from "@/app/api/reddit.js";
import { checkGameTitle } from "@/app/api/vgdb";
import { hasDefinition } from "@/app/api/dictionary";
import SearchForm from "@/app/components/SearchForm";
import Tile from "@/app/components/Tile";
import { processPosts, titleWordsToArray, validatePost, formatPost } from "@/app/processPostData";

export default function App() {

    const [isLoading, setIsLoading] = useState(false);                          // Used to conditionally render when fetching username
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
    const [gameTags, setGameTags] = useState([]);                               // Tags associated with the game title
    const [gameMetacritic, setGameMetacritic] = useState("");                   // The Metacritic score of the game being searched for
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState (false);

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

        // Get the name of each platform the game released on
        const platforms = game.platforms.map(e => { return e.platform.name });

        // Get the tags associated with the game        
        const tags = game.tags.map(e => { return e.name });

        // Set the values for the game
        setGameTitle(game.name);
        setGameYear(game.released.match(/\d{4}/));
        setGamePlatforms(platforms);
        setGameTags(tags);
        setGameMetacritic(game.metacritic);
    }

    // Handle search form submit
    async function handleSearchSubmit(event) {
        // Set loading to true when fetching data
        setIsLoadingPosts(true);
        
        // Prevents the page from reloading on submit
        event.preventDefault();

        // We want the first result (index 0) in the returned array
        const gameTitleSearchResult = await checkGameTitle(searchBarInput);

        // Set the game info (title, year, platforms etc)
        setGameInfo(gameTitleSearchResult[0]);

        // Search Reddit for this game. Returns an array of posts                 
        const redditSearchResults = await getRedditPosts(accessToken, gameTitleSearchResult[0].name, matchTitleExactly);

        // Process the Reddit post
        const { title, formattedGameTitle, hasRomanNumerals, combinedTerms, filteredPosts } = processPosts(redditSearchResults, gameTitleSearchResult[0].tags, gameTitleSearchResult[0].platforms, gameTitleSearchResult[0].name);

        // Create an array made up of the words in the game's title
        const titleWordsArray = titleWordsToArray(title);

        // Variables to store the gameTitle weight and the formattedGameTitle weight
        let gameTitleWeight = 0;
        let formattedGameTitleWeight = 0;
        let weighFormattedGameTitle = false;

        // The combinedTerms array does not contain duplicates.
        // If game title is a single word and no numbers (ie: Destiny), it will appear in the combinedTerms array only once
        // Because of this, we only want to weigh the formattedGameTitle if it is in the combinedTerms array AND not equal to gameTitle        
        if (title !== formattedGameTitle && combinedTerms.includes(formattedGameTitle)) {
            weighFormattedGameTitle = true;
        }

        // 1. For each element in array, search library to see if it returns a definition. 
        // If so, add 1 to weight, if not, add 2 to weight.
        for (const word in titleWordsArray) {
            const definitionFound = await hasDefinition(titleWordsArray[word]);
            if (definitionFound) {
                gameTitleWeight++;
                if (weighFormattedGameTitle && formattedGameTitle.includes(titleWordsArray[word]))
                    formattedGameTitleWeight++;
            }
            else {
                gameTitleWeight += 2;
                if (weighFormattedGameTitle && formattedGameTitle.includes(titleWordsArray[word]))
                    formattedGameTitleWeight += 2;
            }
        }

        // 2. If the gameTitle contains any kind of number (integer, data, roman numeral), add 1 to gameTitle weight.
        const hasNumber = title.match(/[0-9]/);
        if (hasNumber || hasRomanNumerals)
            gameTitleWeight++;

        // For each post, determine if it is related to the game title
        // If so, continue to process the data. Otherwise, skip it
        const validatedPosts = [];
        filteredPosts.forEach(post => {
            const isValid = validatePost(post.data.title, post.data.subreddit, post.data.selftext, combinedTerms, gameTitleWeight, formattedGameTitleWeight, title, formattedGameTitle)
            if (isValid) {
                validatedPosts.push(post);
            }
        });

        // Create a final array of formatted post objects to be rendered.
        const formattedPostsArray = [];
        for(const post in validatedPosts){
            const postObj = formatPost(validatedPosts[post]);                
            // Get the top comment for this post and add it to the object
            const topComment = await getPostTopComment(validatedPosts[post].data.id, postObj.subreddit, accessToken);
            if (topComment) {
                postObj.topCommentAuthor = topComment.data.author;  // Top Comment Author
                postObj.topCommentText = topComment.data.body;      // Top Comment Text
                postObj.topCommentUpVotes = topComment.data.ups;    // Top Comment Up-votes
                postObj.commentDate = topComment.data.created;      // Top Comment Date (Unix Timestamp)
            }
            formattedPostsArray.push(postObj);
        }
                
        setPosts(formattedPostsArray);  // Set the state variable
        setIsLoadingPosts(false);       // Set loading to false after fetching data
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
            {isLoadingPosts ? <p>Loading posts...</p> : posts.map((post, index) => { return <Tile key={index} post={post} /> })}
        </>
    )
}