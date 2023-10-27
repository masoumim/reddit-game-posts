// reddit.js - This file handles interacting with the Reddit API which includes:
// - Authorizing App via oauth2 grant
// - Getting Access Token
// - Fetching Post data
// Reddit OAuth2 Documentation: https://github.com/reddit-archive/reddit/wiki/OAuth2

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// Use NODE_ENV to set "redirect_uri" depending on environment
// TODO: Set the production URI after deploying to VERCEL 
const redirectURI = process.env.NODE_ENV === "development" ? "http://localhost:3000/app" : "[productionURL]/app";

// Base URL for Reddit API
const base_url = 'https://oauth.reddit.com';

// Authorize App + User
// *User grants this client app permission to access their Reddit account.
export function userAuthorizeApp() {
    // Use UUID to generate key for the "state" URL parameter required by Reddit API
    const stateString = uuidv4();

    // Save the state string to session storage so it can persist
    // when the user is redirected back to the /app route after authorization on Reddit.
    window.sessionStorage.setItem("stateString", stateString);

    // Set url parameters
    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID);
    params.append("response_type", "code");
    params.append("state", stateString);
    params.append("redirect_uri", redirectURI);
    params.append("duration", 'permanent');
    params.append("scope", "identity read submit");

    // Redirect user to Reddit 'authorization' URL where user can grant this app access to their profile data.
    document.location = `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

// Returns the Access Token using URL param 'code'
export async function getUserAuthAccessToken(code) {
    // Set the object to use in the POST request
    const options = {
        method: 'POST',
        url: 'https://www.reddit.com/api/v1/access_token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: { username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID, password: process.env.NEXT_PUBLIC_REDDIT_SECRET },
        data: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectURI,
            scope: "identity read submit",
            duration: 'permanent'
        }
    };

    // Send the POST request
    const responseObject = await axios.request(options);

    // Delete the state string in sessionStore
    window.sessionStorage.clear();

    // Return access token from the responseObject
    return responseObject.data.access_token;
}

// Authorize App Only
// *Authorizes this client app without a user context.
export async function authorizeAppOnly() {
    // Set the object to use in the POST request
    const options = {
        method: 'POST',
        url: 'https://www.reddit.com/api/v1/access_token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: { username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID, password: process.env.NEXT_PUBLIC_REDDIT_SECRET },
        data: {
            grant_type: 'client_credentials',
            scope: 'read',
            duration: 'permanent'
        }
    };

    // Send the POST request
    const responseObject = await axios.request(options);

    // Return access token from the responseObject
    return responseObject.data.access_token;
}

// POST a comment to a Reddit Post
export async function postComment(postID, commentInput, accessToken) {
    // Set the object to use in the POST request
    const options = {
        method: 'POST',
        url: `${base_url}/api/comment`,
        headers: { 'Authorization': `bearer ${accessToken}`, 'content-type': 'application/x-www-form-urlencoded' },        
        data: {            
            thing_id: `t3_${postID}`,
            text: commentInput                     
        }
    };

    try {
        const responseObject = await axios.request(options);
        return responseObject;
    }
    catch (err) {
        console.log(`postComment() error: ${err}`);
    }
}


// Calls Reddit API to get Reddit username
export async function getUserInfo(accessToken) {        
    // Set the object to use in the GET request
    const options = {
        method: 'GET',
        url: `${base_url}/api/v1/me/`,
        headers: { 'Authorization': `bearer ${accessToken}` }
    };

    try {
        const response = await axios.request(options);        
        return response.data.name;
    }
    catch (err) {
        console.log(`getUserInfo() error: ${err}`);
    }
}

// Calls Reddit API to search for posts about game title
export async function getRedditPosts(accessToken, gameTitle, gamePlatform, matchTitleExactly) {

    // If matching title exactly, wrap title in quotes
    const title = matchTitleExactly ? `"${gameTitle}"` : `${gameTitle}`;

    // Set the object to use in the GET request
    const options = {
        method: 'GET',
        url: `${base_url}/search`,
        headers: { 'Authorization': `bearer ${accessToken}` },
        params: {
            q: title + ` ${gamePlatform}`,
            limit: 100,
            restrict_sr: false
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response);
        return response.data.data.children;
    }
    catch (err) {
        console.log(`getRedditPosts() error: ${err}`);
    }
}

// Calls Reddit API to get the top comment for each post in the array
export async function getAllTopComments(posts, accessToken) {
    try {        
        // Create and send api request for each reddit post
        // Store each returned promise in promisesArray
        const promisesArray = [];
        for (const post in posts) {
            // promisesArray.push(axios.request({ method: 'GET', url: `${base_url}/r/${posts[post].data.subreddit}/comments/${posts[post].data.id}/`, headers: { 'Authorization': `bearer ${accessToken}` }, params: { sort: top } }));
            promisesArray.push(axios.request({ method: 'GET', url: `${base_url}/r/${posts[post].post.data.subreddit}/comments/${posts[post].post.data.id}/?sort=top`, headers: { 'Authorization': `bearer ${accessToken}` } }));
        }
        // Resolve all promises at once
        return await Promise.all(promisesArray);
    } catch (err) {
        console.log(`Error getting comments: ${err}`);
    }
}