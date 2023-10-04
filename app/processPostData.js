// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood
// - Removing duplicate posts

// Dictionary of general game related terms
const gameTerms = ["game", "videogame", "video game", "nintendo", "xbox", "playstation", "nds", "3ds", "handheld", "vita", "psp", "steam deck", "xbone", "xbox360", "ps2", "ps3", "ps4", "ps5", "series s", "series x", "console", " pc ", "controller", "backlog", "steam", "playtime", "gamer", "emulation", "emulator", "gamecube", "arcade"];

// Array of valid posts to return
let validatedPosts = [];

// Process Reddit posts
export function processPosts(posts, gameTagsArray, gamePlatformsArray) {

    let gameTags = [];          // Array of tags relating to the game title
    let gamePlatforms = [];     // Array of platforms the game released on

    // Extract the game tags
    if (gameTagsArray.length > 0)
        gameTags = gameTagsArray.map(e => e.name.toLowerCase());

    // Extract the platforms
    if (gamePlatformsArray.length > 0)
        gamePlatforms = gamePlatformsArray.map(e => e.platform.name.toLowerCase());

    // Combine the arrays of terms into single array without duplicates using Set
    const combinedTerms = [...new Set([...gameTerms, ...gameTags, ...gamePlatforms])];

    // For each post, determine if it is related to the game title
    // If so, continue to process the data. Otherwise, skip it
    posts.forEach(post => {
        const isValid = validatePost(post.data.title, post.data.subreddit, post.data.selftext, combinedTerms)

        if (isValid) {
            // Format data by creating Post Object with only relevant properties:
            const postObject = formatPost(post);

            // Get top comment and add to object

            // Add the object to the validatedPosts array
        }
    });
}

// Determines if a given post is about the game title. If it is, return TRUE, otherwise return FALSE
function validatePost(postTitle, postSubreddit, postText, combinedTerms) {

    // Represents the likelihood of a valid post - 5+ is considered valid
    let validityScore = 0;

    // Bool to indicate whether post is valid or not
    let isValid = false;

    // Check subreddit name

    // Check post title

    // Check post body

    // return true / false
}

// Formats post data and returns a Post Object
function formatPost(post) {
    /*
    Response data to extract:
    =========================    

    General post data:
    ==================
    post.data.title = post title
    post.data.subreddit = subreddit name    
    post.data.ups = post upvotes

    Post Content: Media:
    ====================
    post.data.domain indicates the media type. 
    
    The following domain values's content can be retrieved from post.data.url:
    youtube.com
    youtu.be 
    twitter.com 
    mobile.twitter.com
    i.reddit.com
    i.imgur.com

    If domain value = v.redd.it, that indicates a Reddit hosted video. 
    The URL to the video can be retrieved from post.data.media.reddit_video.fallback_url

    In all other cases, create a <Link> to the post.data.url value
    
    Post Content: Text:
    ===================
    post.data.selftext = text body

    */
}
