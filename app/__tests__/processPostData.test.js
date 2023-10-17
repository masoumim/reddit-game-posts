// postProcessData.test.js - This file tests the functions in the processPostData.js file

import "@testing-library/jest-dom";
import { processPosts, formatGameTitle, validatePost, determineTitleWeights } from "../processPostData";
import { getRedditPosts, getAllTopComments } from "../api/reddit"; // Import the actual function from the module we want mocked

// Tell Jest to mock the implementation of this module
// *This will use the mocked version of the module in the __mocks__ folder.
jest.mock("../api/reddit");

// Implement test once processPosts() is fully implemented.
it("tests the processPosts() function which returns an array of valid posts", async () => {
    // Arrange
    const accessToken = "";
    const gameTitle = "Super Mario World";
    const gameTags = [{ name: "platformer" }, { name: "retro" }, { name: "nostalgia" }];
    const gamePlatforms = [{ platform: { name: "Super Nintendo" } }, { platform: { name: "Game Boy Advance" } }];
    const matchTitleExactly = false;

    // Mock response for getRedditPosts()
    const getRedditPostsMockResponse = [
        { data: { author: "author1", created: 1455703937, domain: "twitter.com", id: "123", selftext: "SMW on Super Nintendo is my favorite retro platformer.", subreddit: "subreddit1", title: "Super Mario World is my favorite game!", ups: 100, url: "www.abc.com" } },
        { data: { author: "author2", created: 1893738948, domain: "youtube.com", id: "456", selftext: "I love Super Mario World on Super Nintendo. I get such nostalgia when I play that retro platformer", subreddit: "subreddit2", title: "Super Mario World is pure nostalgia", ups: 75, url: "www.xyz.com" } },
        { data: { author: "author3", created: 8343290834, domain: "i.reddit.com", id: "789", selftext: "I remember playing SMW on Game Boy Advance. Such a great retro platformer", subreddit: "subreddit3", title: "Anyone play Super Mario World on Game Boy Advance?", ups: 150, url: "www.foo.com" } }
    ]

    // Mock response for getAllTopComments()
    const getAllTopCommentsMockResponse = [
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor1", body: "commentAuthor1's comment", created: 1455723984, ups: 100 } }] } }] },
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor2", body: "commentAuthor2's comment", created: 1455723985, ups: 200 } }] } }] },
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor3", body: "commentAuthor3's comment", created: 1455723986, ups: 150 } }] } }] }
    ]

    // Set the mocked return value for getRedditPosts
    getRedditPosts.mockResolvedValue(getRedditPostsMockResponse);

    // Set the mocked return value for getAllTopComments
    getAllTopComments.mockResolvedValue(getAllTopCommentsMockResponse);

    // Expected response
    const expectedResponse = [
        { id: "123", title: "Super Mario World is my favorite game!", subreddit: "subreddit1", text: "SMW on Super Nintendo is my favorite retro platformer.", author: "author1", upvotes: 100, date: 1455703937, topCommentText: "commentAuthor1's comment", topCommentAuthor: "commentAuthor1", commentDate: 1455723984, topCommentUpVotes: 100, mediaURL: "www.abc.com", mediaType: "twitter" },
        { id: "456", title: "Super Mario World is pure nostalgia", subreddit: "subreddit2", text: "I love Super Mario World on Super Nintendo. I get such nostalgia when I play that retro platformer", author: "author2", upvotes: 75, date: 1893738948, topCommentText: "commentAuthor2's comment", topCommentAuthor: "commentAuthor2", commentDate: 1455723985, topCommentUpVotes: 200, mediaURL: "www.xyz.com", mediaType: "youtube" },
        { id: "789", title: "Anyone play Super Mario World on Game Boy Advance?", subreddit: "subreddit3", text: "I remember playing SMW on Game Boy Advance. Such a great retro platformer", author: "author3", upvotes: 150, date: 8343290834, topCommentText: "commentAuthor3's comment", topCommentAuthor: "commentAuthor3", commentDate: 1455723986, topCommentUpVotes: 150, mediaURL: "www.foo.com", mediaType: "image" }
    ]

    // Act
    const actualResponse = await processPosts(accessToken, gameTitle, gameTags, gamePlatforms, matchTitleExactly);

    // Assert
    expect(actualResponse).toEqual(expectedResponse);
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

it("tests determineTitleWeights() which returns an integer value for titleWight and formattedTitleWight", async () => {
    // Arrange
    const gameTitle = "street fighter ii: the world warrior";
    const formattedGameTitle = "streetfighter";
    const combinedTerms = ["game", "gaming", "videogame", "video game", "sega", "nintendo", "xbox", "playstation", "console", "controller", "backlog", "steam", "playtime", "nostalgia", "singleplayer", "2 players", "pc", "playstation 3", "wii u", "wii", "game boy", "snes", "commodore / amiga", "atari st", "genesis", "3do", "street fighter ii: the world warrior", "streetfighter", "1991"];
    const hasRomanNumerals = true;

    // Act
    const { gameTitleWeight, formattedGameTitleWeight } = await determineTitleWeights(gameTitle, formattedGameTitle, combinedTerms, hasRomanNumerals);

    // Assert
    expect(gameTitleWeight).toEqual(6);
    expect(formattedGameTitleWeight).toEqual(2);
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