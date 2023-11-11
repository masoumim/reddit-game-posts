// reddit.js - This file contains client-side methods which perform server-side API calls to the Reddit API
// These methods are called on the client-side, make a server-side API call and then return that fetched data.

// Fetches and returns an access token
export async function getAccessToken(url, options) {
    // Call the route handler
    const res = await fetch(url, options);
    const data = await res.json();

    // Return access token        
    return data.data.access_token;
}

// Fetches and returns the user's Reddit username
export async function getUsername(url, options) {
    // Call the route handler
    const res = await fetch(url, options);
    const data = await res.json();

    // Return the username
    return data.data.name;
}

// Fetches and returns Reddit posts based on a game title
export async function getRedditPosts(url, options) {
    // Call the route handler
    const res = await fetch(url, options);
    const data = await res.json();

    // Return the username
    return data.data.data.children;
}

// Fetches and returns an array of comments sorted by Top, for each reddit post in array.
export async function getRedditPostComments(validatedPosts, accessToken) {
    const promisesArray = [];

    for (const post in validatedPosts) {
        // Call the route handler
        const promise = fetch(`/api/comments?postid=${validatedPosts[post].post.data.id}&subreddit=${validatedPosts[post].post.data.subreddit}&accesstoken=${accessToken}`, { method: 'GET' });
        
        // Store each returned promise in promisesArray
        promisesArray.push(promise);        
    }
    
    // Resolve all promises at once
    const resolvedPromisesArray = await Promise.all(promisesArray).then((responses) => { return Promise.all(responses.map((response) => { return response.json() })) });
    
    // Return the username
    return resolvedPromisesArray;
}

// Posts a comment on a Reddit post
export async function postComment(url, options) {
    // Call the route handler
    const res = await fetch(url, options);
    const data = await res.json();

    // Return the username
    return data;
}