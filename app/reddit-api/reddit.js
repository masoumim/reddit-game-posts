// reddit.js - This file handles interacting with the Reddit API which includes:
// - Authorizing App via oauth2 grant
// - Getting Access Token
// - Fetching Post data

import axios from "axios";

export function Foo() {
    console.log(`foo called`);
}

// Authorize App Only
// *Authorizes this client app without a user context.
export async function authorizeAppOnly() {
    console.log(`authorizeAppOnly called`);

    var options = {
        method: 'POST',
        url: 'https://www.reddit.com/api/v1/access_token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    };

    axios.request(options)
        .then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });

    // Redirect user too /app after getting the access token

}

// Authorize App + User
// *User grants this client app permission to access their Reddit profile data
export function authorizeApp() {

}

// TODO: Get Access Token

// TODO: Search Reddit POSTS for game in POST TITLE

// TODO: Search Reddit POSTS for game in POST BODY

// TODO: Search Reddit COMMUNITIES for game in SUBREDDIT NAME