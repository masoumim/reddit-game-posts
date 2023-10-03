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
    params.append("duration", 'temporary');
    params.append("scope", "read");

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
            scope: 'read',
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

// TODO: Search Reddit POSTS for game in POST TITLE

// TODO: Search Reddit POSTS for game in POST BODY

// TODO: Search Reddit COMMUNITIES for game in SUBREDDIT NAME
