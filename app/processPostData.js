// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood
// - Removing duplicate posts

// General game related terms
const gameTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "emulation", "emulator"];

// Roman numerals (from 1 to 20)
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

// Process Reddit posts
export function processPosts(posts, gameTagsArray, gamePlatformsArray, title) {

    // Array of valid posts to return
    let validatedPosts = [];

    let gameTags = [];          // Array of tags relating to the game title
    let gamePlatforms = [];     // Array of platforms the game released on

    // Set the game date if it is in the gameTitle. 
    // *RAWG will append the date in parentheses to some games, mainly retro games.
    // RegEx: a 4 digit number    
    let gameDate = "";
    const extractedDate = title.match(/\d{4}/);
    if (extractedDate)
        gameDate = extractedDate[0];

    console.log(`gameDate = ${gameDate}`);

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

    // For each post, determine if it is related to the game title
    // If so, continue to process the data. Otherwise, skip it
    posts.forEach(post => {
        const isValid = validatePost(post.data.title, post.data.subreddit, post.data.selftext, combinedTerms, gameTitle, formattedGameTitle, hasRomanNumerals)

        if (isValid) {
            // Format data by creating Post Object with only relevant properties:
            const postObject = formatPost(post);

            // Get top comment and add to object

            // Add the object to the validatedPosts array
        }
    });
}

// Formats the game title to resemble Subreddit format
// Example: "street fighter ii: the world warrior" converts to "streetfighter" which would match the subreddit r/streetfighter
function formatGameTitle(gameTitle) {

    // Toggle boolean if game title has roman numerals or not
    let hasRomanNumerals = false;

    // RegEx: replace numbers (and all that come after), colons (and all that come after), apostrophes and parentheses with nothing(""), globally in the string.
    let formattedGameTitle = gameTitle.replace(/[0-9](.*)|:(.*)|'|\(|\)|/g, "");

    // Get the index of the last whitespace character in the string
    const indexOfLastWhitespace = formattedGameTitle.lastIndexOf(" ");

    // Get the string of characters that follow the last whitespace character in the string
    const charsAfterLastWhitespace = formattedGameTitle.substring(indexOfLastWhitespace + 1, formattedGameTitle.length);
    console.log(`charsAfterLastWhitespace = ${charsAfterLastWhitespace}`);

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
function validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitle, formattedGameTitle, hasRomanNumerals) {

    // Represents the likelihood of a valid post - 5+ is considered valid
    let validityScore = 0;

    // Bool to indicate whether post is valid or not
    let isValid = false;

    // Determine weight of titles
    determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals);

    // Check if post includes terms
    combinedTerms.forEach(term => {
        // Check post title
        if (postTitle.toLowerCase().includes(term)) {
            console.log(`postTitle contains: ${term}`);
            validityScore++;
        }


        // Check post subreddit name
        if (postSubreddit.toLowerCase().includes(term)) {
            console.log(`postSubreddit contains: ${term}`);
            validityScore++;
        }


        // Check post body
        if (postText.toLowerCase().includes(term)) {
            console.log(`postText contains: ${term}`);
            validityScore++;
        }
    });

    console.log(`Post validity score: ${validityScore}`);
    console.log(postTitle);
    console.log(postSubreddit);
    console.log(postText);

    // return true / false
}

// Determines and sets the value of the title weights
function determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals) {

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

    // Common words = 1, Uncommon words = 2. The more words in the title, the more specific Reddit's search results will be,
    // and the higher the overall weight of the gameTitle will be as well.
    
    // Put each word in the gameTitle into an array
    console.log(`gameTitle before split into array: ${gameTitle}`);

    const array = gameTitle.replace(/[0-9]$|\s[0-9]:|:|-/, "").trim().split(" ");

    console.log(`gameTitle after replace + split operations: ${gameTitle}`);
    console.log(`gameTitle after split into array: ${array}`);
    
    // TODO: remove the array element that contains a roman numeral
    
    // 1. For each element in array, search library to see if it returns a definition. If so, add 1 to weight, if not, add 2 to weight.

    // 2. If weighFormattedGameTitle = true, set the weight

    // 3. Check for number(s) or roman numerals in gameTitle
    const hasNumber = gameTitle.match(/[0-9]/);
    if (hasNumber || hasRomanNumerals)
        gameTitleWeight++;

    // return an object {gameTitleWeight, formattedGameTitleWeight} instead of setting global vars...
    // In the call from validatePost(), I can destructure the results...
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
