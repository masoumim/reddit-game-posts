// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood

import { hasDefinition } from "./api/dictionary";

// General game related terms
const gameTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia"];

// Roman numerals (from 1 to 20)
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

// Process Reddit posts
export async function processPosts(posts, gameTagsArray, gamePlatformsArray, title) {

    // Array of valid posts to return
    let validatedPosts = [];

    let gameTags = [];          // Array of tags relating to the game title
    let gamePlatforms = [];     // Array of platforms the game released on

    // Set the game date if it is in the gameTitle. 
    // *RAWG will append the date in parentheses to some games, mainly retro games.
    // RegEx: a 4 digit number between parentheses.
    let gameDate = "";
    const extractedDate = title.match(/\(\d{4}\)/);
    if (extractedDate) {
        const dateWithParentheses = extractedDate[0];
        gameDate = dateWithParentheses.replace(/\(|\)/g, "");
    }

    // console.log(`gameDate = ${gameDate}`);

    // Set the game title (remove the date in parentheses if it exists, then convert to lower case)
    // RegEx: a 4 digit number in parentheses
    const gameTitle = title.replace(/\(\d{4}\)/, "").toLowerCase().trim();

    // Get the formattedGameTitle and hasRomanNumerals boolean by destructuring
    const { formattedGameTitle, hasRomanNumerals } = formatGameTitle(gameTitle);

    // Extract the game tags
    if (gameTagsArray.length > 0)
        gameTags = gameTagsArray.map(e => e.name.toLowerCase());

    // Extract the platforms
    if (gamePlatformsArray.length > 0)
        gamePlatforms = gamePlatformsArray.map(e => e.platform.name.toLowerCase());

    // Combine the arrays of terms, game title and formatted game title into single array without duplicates using SET
    const combinedTerms = [...new Set([...gameTerms, ...gameTags, ...gamePlatforms, ...[gameTitle], ...[formattedGameTitle]])];

    // Add gameDate to combinedTerms if a date was set
    if (gameDate)
        combinedTerms.push(gameDate);

    console.log(combinedTerms);

    // Get the title weights (gameTitle and formattedGameTitle)
    const { gameTitleWeight, formattedGameTitleWeight } = await determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals);

    // Filter / remove posts with Subredit names in a removePosts array
    const removePosts = ["gamecollecting", "gameswap", "gamesale", "emulation", "vitahacks", "vitapiracy", "greatxboxdeals"];
    const filteredPosts = posts.filter(post => !removePosts.includes(post.data.subreddit.toLowerCase()));

    // For each post, determine if it is related to the game title
    // If so, continue to process the data. Otherwise, skip it
    filteredPosts.forEach(post => {
        const isValid = validatePost(post.data.title, post.data.subreddit, post.data.selftext, combinedTerms, gameTitleWeight, formattedGameTitleWeight, gameTitle, formattedGameTitle)

        if (isValid) {
            // Format data by creating Post Object with only relevant properties:
            const postObject = formatPost(post);

            // Get top comment and add to object

            // Add the object to the validatedPosts array
        }
    });

    // Return the validatedPosts array
    return validatedPosts;
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
    // console.log(`charsAfterLastWhitespace = ${charsAfterLastWhitespace}`);

    // Remove roman numerals
    if (romanNumerals.includes(charsAfterLastWhitespace)) {
        hasRomanNumerals = true;
        formattedGameTitle = formattedGameTitle.replace(charsAfterLastWhitespace, "");
    }

    // Finally, remove all whitespace characters in the string
    formattedGameTitle = formattedGameTitle.replace(/ /g, "");

    return { formattedGameTitle, hasRomanNumerals };
}

// Determines if a given post is about the game title. If it is, return TRUE, otherwise return FALSE
export function validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitleWeight, formattedGameTitleWeight, gameTitle, formattedGameTitle) {

    // console.log(`validatePost() - gameTitleWeight: ${gameTitleWeight}`);
    // console.log(`validatePost() - formattedGameTitleWeight: ${formattedGameTitleWeight}`);

    // Represents the likelihood of a valid post - 5+ is considered valid
    let validityScore = 0;

    // Bool to indicate whether post is valid or not
    let isValid = false;

    // We only want to include the gameTitle weight in the validityScore once.
    // Either in the Reddit post title OR the Reddit post text body but NOT both.
    let gameTitleWeightAdded = false;

    // Check if post includes terms
    combinedTerms.forEach(term => {
        
        // Check post title
        if (postTitle.toLowerCase().includes(term)) {
            if (term === gameTitle) {
                if (!gameTitleWeightAdded) {
                    // console.log(`postTitle contains: ${term}`);
                    validityScore += gameTitleWeight;
                    gameTitleWeightAdded = true;
                }
            } else {
                // console.log(`postTitle contains: ${term}`);
                validityScore++;

            }
        }

        // Check post subreddit name
        if (postSubreddit.toLowerCase().includes(term)) {
            if (term === formattedGameTitle) {
                // console.log(`postSubreddit contains: ${term}`);
                validityScore += formattedGameTitleWeight;
            } else {
                // console.log(`postSubreddit contains: ${term}`);
                validityScore++;

            }
        }

        // Check post body
        if (postText.toLowerCase().includes(term)) {
            if (term === gameTitle) {
                if (!gameTitleWeightAdded) {
                    // console.log(`postText contains: ${term}`);
                    validityScore += gameTitleWeight;
                    gameTitleWeightAdded = false;
                }
            } else {
                // console.log(`postText contains: ${term}`);
                validityScore++;

            }
        }
    });

    if (validityScore >= 4) {
        console.log(validityScore);
        console.log(postTitle);
        console.log(postSubreddit);
        console.log(postText);
    }

    // Return TRUE if validityScore is 5 or greater
    return validityScore >= 5 ? true : false;
}

// Determines and sets the value of the title weights
export async function determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals) {

    // Variables to store the gameTitle weight and the formattedGameTitle weight
    let gameTitleWeight = 0;
    let formattedGameTitleWeight = 0;

    // The combinedTerms array does not contain duplicates.
    // If game title is a single word and no numbers (ie: Destiny),
    // it will appear in the combinedTerms array only once
    // Because of this, we only want to weigh the formattedGameTitle if it is in the combinedTerms array AND not equal to gameTitle
    let weighFormattedGameTitle = false;
    if (gameTitle !== formattedGameTitle && combinedTerms.includes(formattedGameTitle)) {
        weighFormattedGameTitle = true;
    }

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

    // console.log(`titleWordsArray: ${titleWordsArray}`);

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
    const hasNumber = gameTitle.match(/[0-9]/);
    if (hasNumber || hasRomanNumerals)
        gameTitleWeight++;

    // Return the weight values
    return { gameTitleWeight, formattedGameTitleWeight };
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
