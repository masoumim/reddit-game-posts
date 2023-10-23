// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood

import parse from 'html-react-parser'; // html-react-parser Converts an HTML string to one or more React elements.
import { getRedditPosts, getAllTopComments } from "./api/reddit";
import timeago from 'epoch-timeago'; // Converts Unix Timestamp to formatted string of amount of time past

// Roman numerals (from 1 to 20)
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

export async function processPosts(accessToken, gameTitle, gamePlatform, matchTitleExactly) {
    let gameDate = "";
    let title = gameTitle;
    let dateRegEx = /\(\d{4}\)/; // RegEx: a 4 digit number between parentheses.

    // Set the game date if it is in the gameTitle.
    // *RAWG will append the date in parentheses to some games, mainly retro games.        
    const extractedDate = title.match(dateRegEx);
    if (extractedDate) {
        const dateWithParentheses = extractedDate[0];           // get the date (first element in array returned by match())
        gameDate = dateWithParentheses.replace(/\(|\)/g, "");   // extract the date by removing parentheses        
    }

    // remove date from the title (if it exists)
    title = title.replace(dateRegEx, "").toLowerCase().trim();

    // Get the formattedGameTitle and hasRomanNumerals boolean by destructuring
    const formattedGameTitle = formatGameTitle(title);

    // Search Reddit for this game. Returns an array of posts                 
    const redditSearchResults = await getRedditPosts(accessToken, title, gamePlatform, matchTitleExactly);

    // Filter / remove posts with Subredit names in a removePosts array    
    const removePosts = ["gamecollecting", "gameswap", "3dsqrcodes", "indiegameswap", "steamgameswap", "gametrade", "gamesale", "steam_giveaway", "gamedeals", "emulation", "vitahacks", "vitapiracy", "greatxboxdeals", "ama", "digitalcodesell", "uvtrade"];
    const filteredPosts = redditSearchResults.filter(post => !removePosts.includes(post.data.subreddit.toLowerCase()));

    // For each post in filteredPosts, determine if the post is related to the game title.
    // If so, add the post to the validatedPosts array. Otherwise, skip the post.
    const validatedPosts = [];
    filteredPosts.forEach(post => {
        const validityScore = validatePost(post.data.title, post.data.subreddit, post.data.selftext, title, formattedGameTitle, gamePlatform)
        if (validityScore) {            
            validatedPosts.push({post, validityScore});
        }
    });

    // Get the top comment for each post
    const topCommentsArray = await getAllTopComments(validatedPosts, accessToken);

    // Create a final array of formatted post objects to be returned.
    let formattedPostsArray = [];

    // Create a formatted post object out of each post + comment
    // Add the object to the formattedPostsArray
    for (const post in validatedPosts) {
        const postObj = formatPost(validatedPosts[post], topCommentsArray[post]);
        formattedPostsArray.push(postObj);
    }

    return formattedPostsArray;
}

// Formats the game title to resemble Subreddit format
// Example: "street fighter ii: the world warrior" converts to "streetfighter" which would match the subreddit r/streetfighter
export function formatGameTitle(gameTitle) {

    // RegEx: replace numbers (and all that come after), colons (and all that come after), apostrophes and parentheses with nothing(""), globally in the string.
    let formattedGameTitle = gameTitle.replace(/[0-9](.*)|:(.*)|'|\(|\)|/g, "");

    // Remove roman numerals: Get the index of the last whitespace character in the string.
    const indexOfLastWhitespace = formattedGameTitle.lastIndexOf(" ");

    // Remove roman numerals: Get the string of characters that follow the last whitespace character in the string.
    const charsAfterLastWhitespace = formattedGameTitle.substring(indexOfLastWhitespace + 1, formattedGameTitle.length);

    // Remove roman numerals
    if (romanNumerals.includes(charsAfterLastWhitespace)) {        
        formattedGameTitle = formattedGameTitle.replace(charsAfterLastWhitespace, "");
    }

    // Finally, remove all whitespace characters in the string
    formattedGameTitle = formattedGameTitle.replace(/ /g, "");

    return formattedGameTitle;
}

// Determines if a given post is about the game title. If it is, return TRUE, otherwise return FALSE
export function validatePost(postTitle, postSubreddit, postText, gameTitle, formattedGameTitle, gamePlatform) {
    // Toggles T/F depending on if the subreddit has been analyzed 
    // and given a validity score (we only want to score it once)    
    let hasSubredditScore = false;

    // Initialize validity score to 0
    let validityScore = 0;

    // 1. Analyze the Post Title:
    /////////////////////////////
    
    // Check for game title
    if (containsGameTitle(gameTitle, postTitle.toLowerCase()) === true) {
        console.log(`validatePost() - post title contains game title!`);
        validityScore++;
    }
    
    // Check for platform
    if (containsPlatform(gamePlatform, postTitle.toLowerCase()) === true) {
        console.log(`validatePost() - post title contains platform!`);
        validityScore++;
    }

    // 2. Analyze the Post Subreddit:
    /////////////////////////////////
    
    // Check for platform
    if (containsPlatform(gamePlatform, postSubreddit.toLowerCase()) === true) {
        console.log(`validatePost() - post subreddit contains platform!`);
        validityScore++;
        hasSubredditScore = true;
    }
    
    // Check for formattedTitle (game title formatted in subreddit naming style / convention)
    if(!hasSubredditScore && (postSubreddit.toLowerCase() === formattedGameTitle)){
        validityScore++;
        hasSubredditScore = true;
        console.log(`validatePost() - subreddit === ${formattedGameTitle}!`);
    }

    // Check for game title word      
    if (!hasSubredditScore) {
        const gameTitleWords = titleWordsToArray(gameTitle);
        gameTitleWords.forEach(word => {
            if (word.includes(postSubreddit.toLowerCase())) {
                validityScore++;
                hasSubredditScore = true;
                console.log(`validatePost() - subreddit contains game title word!`);
                return;
            }
        });
    }

    // Check for game related subreddits
    const gameSubreddits = ["gaming", "games", "truegaming", "gamernews", "indiegaming", "speedrun", "retrogaming", "tipofmyjoystick", "nostalgia"];
    if(!hasSubredditScore && gameSubreddits.includes(postSubreddit.toLowerCase())){
        validityScore++;
        console.log(`validatePost() - post subreddit is gaming related!`);
    }
    
    // 3. Analyze the Post Text:
    ////////////////////////////
    
    // Check for game title
    if (postText && (containsGameTitle(gameTitle, postText.toLowerCase()) === true)) {
        console.log(`validatePost() - post text contains game title!`);
        validityScore++;
    }
       
    // Check for platform
    if (postText && (containsPlatform(gamePlatform, postText.toLowerCase()) === true)) {
        console.log(`validatePost() - post text contains platform!`);
        validityScore++;
    }

    // Return validity score
    return validityScore;    
}

// Returns true if supplied text contains the game title, false otherwise.
export function containsGameTitle(gameTitle, text) {
    const gameTitleWordsArray = titleWordsToArray(gameTitle);
    let wordsFound = 0;

    console.log(`containsGameTitle():`);
    console.log(`gameTitle: ${gameTitle}`);
    console.log(`text: ${text}`);
    console.log(`gameTitleWordsArray: ${gameTitleWordsArray}`);


    gameTitleWordsArray.forEach(word => {
        if (text.includes(word))
            wordsFound++;
    });

    console.log(`(wordsFound / gameTitleWordsArray.length) * 100: ${(wordsFound / gameTitleWordsArray.length) * 100}`);

    // There must be at least 75% of the title's words present in the text
    if (((wordsFound / gameTitleWordsArray.length) * 100) >= 75) {
        return true;
    }
    else {
        return false;
    }
}

// Returns true if supplied text contains the game platform, false otherwise.
export function containsPlatform(platform, text) {
    // Get array of platform aliases
    const platformAliases = getPlatformAliases(platform);    
    let doesContainPlatform = false;
    console.log(`containsPlatform() - platformAliases: ${platformAliases}`);

    platformAliases.forEach(platform => {        
        if (text.includes(platform.toLowerCase())) {                        
            doesContainPlatform = true;
            return;
        }
    });
    return doesContainPlatform;
}

// Returns an array of platform name aliases
export function getPlatformAliases(platform) {
    // https://www.reddit.com/r/gaming/wiki/list-sorted-by-subscribers/
    
    let platformAliases;

    // TODO: Add remaining platforms
    switch (platform) {
        case "NES":
            platformAliases = ["NES", "Nintendo Entertainment System"];
            break;
    }

    return platformAliases;
}

// Returns an array of words that make up the game title
export function titleWordsToArray(gameTitle) {
    // Put each word in the gameTitle into an array
    // RegEx: 4 digit numbers, space followed by single number at end of string, space followed by number followed by space,
    // space followed by number followed by colon, colon, hyphen, period.
    const titleWordsArray = gameTitle.replace(/\d{4}|\s[0-9]$|\s[0-9]\s|\s[0-9]:|:|-|\./g, "").trim().split(" ");

    // Remove roman numerals from title words array
    titleWordsArray.forEach(word => {
        if (romanNumerals.includes(word)) {
            const index = titleWordsArray.indexOf(word);
            titleWordsArray.splice(index, 1);
        }
    });

    // Return the array
    return titleWordsArray;
}

// Formats post data and returns a Post Object
export function formatPost(post, topComment) {

    // Create post object
    const postObj = {};

    // Add post data to object
    postObj.rank = post.validityScore;                       // The validity ranking of the post   
    postObj.id = post.post.data.id;                          // Post ID
    postObj.title = post.post.data.title;                    // Post Title
    postObj.subreddit = post.post.data.subreddit;            // Post Subreddit      
    postObj.author = post.post.data.author;                  // Post Author
    postObj.upvotes = post.post.data.ups;                    // Post Up-votes
    postObj.date = timeago(post.post.data.created * 1000);   // Post Date (Unix Timestamp) Converted to 'time ago' string

    // Create a new DOMParser object                                                     
    const parser = new DOMParser();

    // Get the post's text html (selftext_html) returned by Reddit API        
    const postHTMLStr = post.post.data.selftext_html;

    // If post isn't null, convert the post's text body into HTML:
    if (postHTMLStr !== null) {
        // Convert selftext_html's HTML character entities to HTML element tags     
        const postHTMLElements = parser.parseFromString(postHTMLStr, 'text/html');

        // Extract just the <body> portion of the converted HTML
        const postBody = postHTMLElements.body;

        // Convert the HTML string to a React element using html-react-parser    
        const parsedBody = parse(postBody.textContent);

        // Body Text
        postObj.text = parsedBody;
    }
    else {
        postObj.text = "";
    }

    // Add top comment data to object  
    if (topComment.data[1].data.children.length > 0) {
        postObj.topCommentAuthor = topComment.data[1].data.children[0].data.author;                 // Comment Author        
        postObj.commentDate = timeago(topComment.data[1].data.children[0].data.created * 1000);     // Post Date (Unix Timestamp) Converted to 'time ago' string
        postObj.topCommentUpVotes = topComment.data[1].data.children[0].data.ups;                   // Comment Up-Votes

        // Convert the comment into HTML:

        // Get the comment text returned by Reddit API
        const commentHTMLStr = topComment.data[1].data.children[0].data.body_html;

        // Convert the HTML string's character entities into HTML element tags
        const commentHTMLElements = parser.parseFromString(commentHTMLStr, 'text/html')

        // Extract just the <body> portion of the converted HTML
        const commentBody = commentHTMLElements.body;

        // Convert the HTML string to a React element using html-react-parser
        const parsedComment = parse(commentBody.textContent);

        // Comment Text
        postObj.topCommentText = parsedComment;
    }
    else {
        postObj.topCommentText = "No comments";
    }

    // Use the Data.Domain value returned by the Reddit API to determine:
    // 1. The media type of the post content
    // 2. The url to the post content

    // YOUTUBE 
    if (post.post.data.domain === "youtu.be" || post.post.data.domain === "youtube.com") {
        postObj.mediaURL = post.post.data.url;
        postObj.mediaType = "youtube";
    }
    // TWITTER
    else if (post.post.data.domain === "twitter.com" || post.post.data.domain === "mobile.twitter.com") {
        // Tweets will be rendered using the Tweet ID of the Tweet URL.                         
        const matchID = post.post.data.url.match(/\/[0-9]+/g);   // Match a '/' followed by any number of digits
        if (matchID) {
            const tweetID = matchID[0].replace("/", "");    // Remove the '/'
            postObj.mediaURL = tweetID;
            postObj.mediaType = "twitter";
        }
        else {
            postObj.mediaURL = post.post.data.url;
            postObj.mediaType = "link";
        }
    }
    // IMAGE
    else if (post.post.data.domain === "i.reddit.com" || post.post.data.domain === "i.imgur.com" || post.post.data.domain === "i.redd.it" || post.post.data.domain === "gfycat.com") {
        postObj.mediaURL = post.post.data.url;
        postObj.mediaType = "image";
    }
    // VIDEO
    else if (post.post.data.domain === "v.redd.it") {
        if (post.post.data.media) {
            postObj.mediaURL = post.post.data.media.reddit_video.fallback_url;
            postObj.mediaType = "video";
        }
        else {
            postObj.mediaURL = post.post.data.url;
            postObj.mediaType = "link";
        }
    }
    // LINK
    else {
        // For all other values of 'post.data.domain' we render 'post.data.url' in a <Link> component
        // The only exception is if 'post.data.domain' contains the world 'self'. 
        // If these cases, the url is redundant as it is simply a url back to the Reddit post itself.

        if (!post.post.data.domain.includes('self')) {
            postObj.mediaURL = post.post.data.url;
            postObj.mediaType = "link";
        }
    }
    return postObj;
}