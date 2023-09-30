// reddit.js - This file handles interacting with the Reddit API which includes:
// - Authorizing App via oauth2 grant
// - Getting Access Token
// - Fetching Post data
// Reddit OAuth2 Documentation: https://github.com/reddit-archive/reddit/wiki/OAuth2
// To search for POSTS use https://www.reddit.com/dev/api/#GET_search and set restrict_sr to FALSE

import axios from "axios";

// Authorize App + User
// *User grants this client app permission to access their Reddit profile data
export function authorizeApp() {

    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID);
    params.append("response_type", "code");
    params.append("state", "abc123");
    params.append("redirect_uri", "http://localhost:3000/app");
    params.append("duration", 'temporary');
    params.append("scope", "read");

    document.location = `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

// Authorize App Only
// *Authorizes this client app without a user context.
export async function authorizeAppOnly() {
    const options = {
        method: 'POST',
        url: 'https://www.reddit.com/api/v1/access_token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: { username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID, password: process.env.NEXT_PUBLIC_REDDIT_SECRET },
        data: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });

}

// TODO: Get Access Token

// TODO: Search Reddit POSTS for game in POST TITLE

// TODO: Search Reddit POSTS for game in POST BODY

// TODO: Search Reddit COMMUNITIES for game in SUBREDDIT NAME