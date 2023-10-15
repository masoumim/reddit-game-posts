// processPostData.js - This file handles the validating processing of fetched posts by:
// - Determining and measuring the likelihood that a post is about the game
// - Removing / Filtering out posts with low likelihood

// General game related terms
const gameTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia"];

// Roman numerals (from 1 to 20)
const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

export function processPosts(posts, gameTags, gamePlatforms, gameTitle) {
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
    const { formattedGameTitle, hasRomanNumerals } = formatGameTitle(gameTitle);

    // Extract the game tags
    const tags = gameTags.map(e => e.name.toLowerCase());
                    
    // Extract the platforms
    const platforms = gamePlatforms.map(e => e.platform.name.toLowerCase());
    
    // Combine the arrays of terms, game title and formatted game title into single array without duplicates using SET
    const combinedTerms = [...new Set([...gameTerms, ...tags, ...platforms, ...[title], ...[formattedGameTitle]])];
    
    // Filter / remove posts with Subredit names in a removePosts array
    const removePosts = ["gamecollecting", "gameswap", "gamesale", "emulation", "vitahacks", "vitapiracy", "greatxboxdeals"];    
    const filteredPosts = posts.filter(post => !removePosts.includes(post.data.subreddit.toLowerCase()));
    
    return {title, formattedGameTitle, hasRomanNumerals, combinedTerms, filteredPosts};

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

// Determines if a given post is about the game title. If it is, return TRUE, otherwise return FALSE
export function validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitleWeight, formattedGameTitleWeight, gameTitle, formattedGameTitle) {

    // Represents the likelihood of a valid post - 5+ is considered valid
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
        if (postText.toLowerCase().includes(term)) {
            if (term === gameTitle) {
                if (!gameTitleWeightAdded) {                    
                    validityScore += gameTitleWeight;
                    gameTitleWeightAdded = false;
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
    postObj.id = post.data.id                   // Post ID
    postObj.title = post.data.title;            // Post Title
    postObj.subreddit = post.data.subreddit;    // Post Subreddit
    postObj.text = post.data.selftext;          // Post Text Body
    postObj.author = post.data.author;          // Post Author
    postObj.upvotes = post.data.ups;            // Post Up-votes
    postObj.date = post.data.created;           // Post Date (Unix Timestamp)
    
    // Add top comment data to object
    postObj.topCommentText = topComment.data[1].data.children[0].data.body;         // Comment Text
    postObj.topCommentAuthor = topComment.data[1].data.children[0].data.author;     // Comment Author
    postObj.commentDate = topComment.data[1].data.children[0].data.created;         // Comment Date (Unix Timestamp)
    postObj.topCommentUpVotes = topComment.data[1].data.children[0].data.ups;       // Comment Up-Votes

    // Get the URL to the post's media content and set the content type
    if (post.data.domain === "youtu.be" || post.data.domain === "youtube.com") {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "youtube";
    }
    else if (post.data.domain === "twitter.com" || post.data.domain === "mobile.twitter.com") {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "twitter";
    }
    else if (post.data.domain === "i.reddit.com" || post.data.domain === "i.imgur.com") {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "image";
    }
    else if (post.data.domain === "v.redd.it") {
        postObj.mediaURL = post.data.media.reddit_video.fallback_url;
        postObj.mediaType = "video";
    }
    else {
        postObj.mediaURL = post.data.url;
        postObj.mediaType = "link";
    }

    return postObj;
}