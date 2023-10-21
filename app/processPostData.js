// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood

import parse from 'html-react-parser'; // html-react-parser Converts an HTML string to one or more React elements.
import { hasDefinition } from "./api/dictionary";
import { getRedditPosts, getAllTopComments } from "./api/reddit";
import timeago from 'epoch-timeago'; // Converts Unix Timestamp to formatted string of amount of time past

// General game related terms
const gameTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia"];

// Roman numerals (from 1 to 20)
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

export async function processPosts(accessToken, gameTitle, gameTags, gamePlatforms, matchTitleExactly) {
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
    const { formattedGameTitle, hasRomanNumerals } = formatGameTitle(title);

    // Extract the game tags
    const tags = gameTags.map(e => e.name.toLowerCase());

    // Extract the platforms
    const platforms = gamePlatforms.map(e => e.platform.name.toLowerCase());

    // Combine the arrays of terms, game title and formatted game title into single array without duplicates using SET
    const combinedTerms = [...new Set([...gameTerms, ...tags, ...platforms, ...[title], ...[formattedGameTitle]])];

    // Search Reddit for this game. Returns an array of posts                 
    const redditSearchResults = await getRedditPosts(accessToken, gameTitle, matchTitleExactly);

    console.log(redditSearchResults);
    console.log(combinedTerms);

    // Filter / remove posts with Subredit names in a removePosts array    
    const removePosts = ["gamecollecting", "gameswap", "indiegameswap", "steamgameswap", "gametrade", "gamesale", "steam_giveaway", "gamedeals", "emulation", "vitahacks", "vitapiracy", "greatxboxdeals", "ama"];
    const filteredPosts = redditSearchResults.filter(post => !removePosts.includes(post.data.subreddit.toLowerCase()));

    // Get the weight for the game title and the formatted game title
    const { gameTitleWeight, formattedGameTitleWeight } = await determineTitleWeights(title, formattedGameTitle, combinedTerms, hasRomanNumerals);

    // For each post in filteredPosts, determine if the post is related to the game title.
    // If so, add the post to the validatedPosts array. Otherwise, skip the post.
    const validatedPosts = [];
    filteredPosts.forEach(post => {
        const isValid = validatePost(post.data.title, post.data.subreddit, post.data.selftext_html, combinedTerms, gameTitleWeight, formattedGameTitleWeight, title, formattedGameTitle)
        if (isValid) {
            validatedPosts.push(post);
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

    // Toggle boolean if game title has roman numerals or not
    let hasRomanNumerals = false;

    // RegEx: replace numbers (and all that come after), colons (and all that come after), apostrophes and parentheses with nothing(""), globally in the string.
    let formattedGameTitle = gameTitle.replace(/[0-9](.*)|:(.*)|'|\(|\)|/g, "");

    // Remove roman numerals: Get the index of the last whitespace character in the string.
    const indexOfLastWhitespace = formattedGameTitle.lastIndexOf(" ");

    // Remove roman numerals: Get the string of characters that follow the last whitespace character in the string.
    const charsAfterLastWhitespace = formattedGameTitle.substring(indexOfLastWhitespace + 1, formattedGameTitle.length);

    // Remove roman numerals
    if (romanNumerals.includes(charsAfterLastWhitespace)) {
        hasRomanNumerals = true;
        formattedGameTitle = formattedGameTitle.replace(charsAfterLastWhitespace, "");
    }

    // Finally, remove all whitespace characters in the string
    formattedGameTitle = formattedGameTitle.replace(/ /g, "");

    return { formattedGameTitle, hasRomanNumerals };
}

// Determines the weights of gameTitle and formattedGameTitle
export async function determineTitleWeights(title, formattedGameTitle, combinedTerms, hasRomanNumerals) {

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

    // Create an array made up of the words in the game's title
    const titleWordsArray = titleWordsToArray(title);

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

    return { gameTitleWeight, formattedGameTitleWeight }
}

// Determines if a given post is about the game title. If it is, return TRUE, otherwise return FALSE
export function validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitleWeight, formattedGameTitleWeight, gameTitle, formattedGameTitle) {
    
    // Represents the likelihood of a valid post - 4+ is considered valid
    let validityScore = 0;

    // We only want to include the gameTitle weight in the validityScore once.
    // Either in the Reddit post title OR the Reddit post text body but NOT both.
    let gameTitleWeightAdded = false;

    // Check if post includes terms
    combinedTerms.forEach(term => {

        // Check post title
        if (postTitle.toLowerCase().includes(term)) {
            if (term === gameTitle) {
                if (!gameTitleWeightAdded) {
                    validityScore += gameTitleWeight;
                    gameTitleWeightAdded = true;
                }
            } else {
                validityScore++;
            }
        }

        // Check post subreddit name
        if (postSubreddit.toLowerCase().includes(term)) {
            if (term === formattedGameTitle) {
                validityScore += formattedGameTitleWeight;
            } else {
                validityScore++;
            }
        }

        // Check post body
        if (postText !== null && postText.toLowerCase().includes(term)) {
            if (term === gameTitle) {
                if (!gameTitleWeightAdded) {
                    validityScore += gameTitleWeight;
                    gameTitleWeightAdded = true;
                }
            } else {
                validityScore++;
            }
        }
    });

    // Return TRUE if validityScore is 5 or greater
    return validityScore >= 4 ? true : false;
}

// Returns an array of words that make up the game title
export function titleWordsToArray(gameTitle) {

    // Put each word in the gameTitle into an array
    // RegEx: 4 digit numbers, space followed by single number at end of string, space followed by number followed by space,
    // space followed by number followed by colon, colon, hyphen.
    const titleWordsArray = gameTitle.replace(/\d{4}|\s[0-9]$|\s[0-9]\s|\s[0-9]:|:|-/, "").trim().split(" ");

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
    postObj.id = post.data.id                           // Post ID
    postObj.title = post.data.title;                    // Post Title
    postObj.subreddit = post.data.subreddit;            // Post Subreddit      
    postObj.author = post.data.author;                  // Post Author
    postObj.upvotes = post.data.ups;                    // Post Up-votes
    postObj.date = timeago(post.data.created * 1000);   // Post Date (Unix Timestamp) Converted to 'time ago' string

    // Create a new DOMParser object                                                     
    const parser = new DOMParser();

    // Get the post's text html (selftext_html) returned by Reddit API        
    const postHTMLStr = post.data.selftext_html;

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
    if (post.data.domain === "youtu.be" || post.data.domain === "youtube.com") {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "youtube";
    }
    // TWITTER
    else if (post.data.domain === "twitter.com" || post.data.domain === "mobile.twitter.com") {        
        // Tweets will be rendered using the Tweet ID of the Tweet URL.                         
        const matchID = post.data.url.match(/\/[0-9]+/g);   // Match a '/' followed by any number of digits
        if (matchID) {
            const tweetID = matchID[0].replace("/", "");    // Remove the '/'
            postObj.mediaURL = tweetID;
            postObj.mediaType = "twitter";
        }
        else {
            postObj.mediaURL = post.data.url;
            postObj.mediaType = "link";
        }
    }
    // IMAGE
    else if (post.data.domain === "i.reddit.com" || post.data.domain === "i.imgur.com" || post.data.domain === "i.redd.it" || post.data.domain === "gfycat.com") {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "image";
    }
    // VIDEO
    else if (post.data.domain === "v.redd.it") {
        if (post.data.media) {
            postObj.mediaURL = post.data.media.reddit_video.fallback_url;
            postObj.mediaType = "video";
        }
        else {
            postObj.mediaURL = post.data.url;
            postObj.mediaType = "link";
        }
    }
    // LINK
    else {
        // For all other values of 'post.data.domain' we render 'post.data.url' in a <Link> component
        // The only exception is if 'post.data.domain' contains the world 'self'. 
        // If these cases, the url is redundant as it is simply a url back to the Reddit post itself.
                
        if (!post.data.domain.includes('self')) {
            postObj.mediaURL = post.data.url;
            postObj.mediaType = "link";
        }
    }
    return postObj;
}