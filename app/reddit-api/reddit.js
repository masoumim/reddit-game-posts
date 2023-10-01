// reddit.js - This file handles interacting with the Reddit API which includes:
// - Authorizing App via oauth2 grant
// - Getting Access Token
// - Fetching Post data
// Reddit OAuth2 Documentation: https://github.com/reddit-archive/reddit/wiki/OAuth2
// To search for POSTS use https://www.reddit.com/dev/api/#GET_search and set restrict_sr to FALSE

import axios from "axios";

// Authorize App + User
// *User grants this client app permission to access their Reddit profile data
export function userAuthorizeApp(stateString) { 
    // Use NODE_ENV to set "redirect_uri" depending on environment
    // TODO: Set the production URI after deploying to VERCEL 
    const redirectURI = process.env.NODE_ENV === "development" ? "http://localhost:3000/app" : "[productionURL]/app";

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

// Returns the Access Token using URL params 'state' and 'code'
export async function getUserAuthAccessToken(returnedStateString, code){
    console.log('inside getUserAuthAccessToken()');
}

// Authorize App Only
// *Authorizes this client app without a user context.
export async function authorizeAppOnly() {
    // As per Reddit API spec, Application Only OAuth uses HTTP Basic Auth to authorize this app.
    // Basic Auth uses an "Authorization" header to set the username / password.
    // This implementation uses Axios's 'auth' property instead of the Authorization Header
    const options = {
        method: 'POST',
        url: 'https://www.reddit.com/api/v1/access_token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: { username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID, password: process.env.NEXT_PUBLIC_REDDIT_SECRET },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'read'
        })
    };

    // Send the POST request containing Access Token
    const accessTokenObject = await axios.request(options);
    
    // Return the response object
    return accessTokenObject;
}

// TODO: Get Access Token

// TODO: Search Reddit POSTS for game in POST TITLE

// TODO: Search Reddit POSTS for game in POST BODY

// TODO: Search Reddit COMMUNITIES for game in SUBREDDIT NAME