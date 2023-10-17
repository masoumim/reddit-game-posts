// postProcessData.test.js - This file tests the functions in the processPostData.js file

import "@testing-library/jest-dom";
import { processPosts, formatGameTitle, validatePost, determineTitleWeights } from "../processPostData";

// TODO: Implement test once processPosts() is fully implemented.
it("tests the processPosts() function which returns an array of valid posts", () => {
});

it("tests formatGameTitle() which returns subreddit-formatted title and whether the title had roman numerals", () => {
    // Arrange
    const gameTitle = "street fighter ii: the world warrior"
    
    // Act
    const { formattedGameTitle, hasRomanNumerals } = formatGameTitle(gameTitle);

    // Assert
    expect(formattedGameTitle).toEqual("streetfighter");
    expect(hasRomanNumerals).toEqual(true);
});

it("tests validatePost() using data that should result in the function returning true", () => {
    // Arrange
    const postTitle = "Street Fighter II is my favorite game";
    const postSubreddit = "streetfighter";
    const postText = "I remember playing Street Fighter II: The World Warrior on my SNES, Genesis and 3do. It was my favorite game back in 1991. I get nostalgia when I pickup my controller and play. Definitely my favorite video game";
    const combinedTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia", "singleplayer", "2 players", "pc", "playstation 3", "wii u", "wii", "game boy", "snes", "commodore / amiga", "atari st", "genesis", "3do", "street fighter ii: the world warrior", "streetfighter", "1991"];
    const gameTitleweight = 5;
    const formattedGameTitleWeight = 2;
    const gameTitle = "street fighter ii: the world warrior";
    const formattedGameTitle = "streetfighter";

    // Act
    const isValid = validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitleweight, formattedGameTitleWeight, gameTitle, formattedGameTitle);

    // Assert
    expect(isValid).toEqual(true);    
});

it("tests validatePost() using data that should result in the function returning false", () => {
    // Arrange
    const postTitle = "Looking for a cool spot to hangout";
    const postSubreddit = "toronto";
    const postText = "Anybody know any cool places where we can hangout in Toronto?";
    const combinedTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia", "pc", "snes", "genesis", "cool spot", "coolspot"];
    const gameTitleweight = 2;
    const formattedGameTitleWeight = 2;
    const gameTitle = "cool spot";
    const formattedGameTitle = "coolspot";

    // Act
    const isValid = validatePost(postTitle, postSubreddit, postText, combinedTerms, gameTitleweight, formattedGameTitleWeight, gameTitle, formattedGameTitle);

    // Assert
    expect(isValid).toEqual(false);    
});

it("tests determineTitleWeights() which returns an integer value for titleWight and formattedTitleWight", async () => {
    // Arrange
    const gameTitle = "street fighter ii: the world warrior";
    const formattedGameTitle = "streetfighter";
    const combinedTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia", "singleplayer", "2 players", "pc", "playstation 3", "wii u", "wii", "game boy", "snes", "commodore / amiga", "atari st", "genesis", "3do", "street fighter ii: the world warrior", "streetfighter", "1991"];
    const hasRomanNumerals = true;
    
    // Act
    const{ gameTitleWeight, formattedGameTitleWeight } = await determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals);

    // Assert
    expect(gameTitleWeight).toEqual(6);
    expect(formattedGameTitleWeight).toEqual(2);    
});

// TODO: Test formatPost()