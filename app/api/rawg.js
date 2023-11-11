// rawg.js - This file contains a client-side method which performs a server-side API call to the RAWG API
// This method is called on the client-side, makes a server-side API call and then returns that fetched data.

// Fetches and returns games matching the user search input
export async function getGameResults(url, options) {
    // Call the route handler
    const res = await fetch(url, options);
    const data = await res.json();

    // Return access token        
    return data.data.results;
}