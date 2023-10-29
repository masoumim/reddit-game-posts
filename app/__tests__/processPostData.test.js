// postProcessData.test.js - This file tests the functions in the processPostData.js file

import "@testing-library/jest-dom";
import { processPosts, formatGameTitle, validatePost, determineTitleWeights } from "../processPostData";
import { getRedditPosts, getAllTopComments } from "../api/reddit"; // Import the actual function from the module we want mocked

// Tell Jest to mock the implementation of this module
// *This will use the mocked version of the module in the __mocks__ folder.
jest.mock("../api/reddit");

it("tests the processPosts() function which returns an array of valid posts", async () => {
    // Arrange
    const accessToken = "";
    const gameTitle = "Super Mario World";
    const gamePlatform = "SNES";
    const matchTitleExactly = false;

    // Mock response for getRedditPosts()
    const getRedditPostsMockResponse = [
        { data: { author: "author1", created: 1455703937, domain: "abc.com", id: "123", selftext_html: "SMW on Super Nintendo is my favorite retro platformer.", subreddit: "subreddit1", title: "Super Mario World is my favorite game!", ups: 100, url: "www.abc.com", archived: "false", permalink: "r/link1" } },
        { data: { author: "author2", created: 1893738948, domain: "xyz.com", id: "456", selftext_html: "I love Super Mario World on Super Nintendo. I get such nostalgia when I play that retro platformer", subreddit: "subreddit2", title: "Super Mario World is pure nostalgia", ups: 75, url: "www.xyz.com", archived: "false", permalink: "r/link2" } },
        { data: { author: "author3", created: 8343290834, domain: "foo.com", id: "789", selftext_html: "I remember playing SMW on Game Boy Advance. Such a great retro platformer", subreddit: "subreddit3", title: "Anyone play Super Mario World on Game Boy Advance?", ups: 150, url: "www.foo.com", archived: "false", permalink: "r/link3" } }
    ]

    // Mock response for getAllTopComments()
    const getAllTopCommentsMockResponse = [
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor1", body_html: "commentAuthor1's comment", created: 1455723984, ups: 100 } }] } }] },
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor2", body_html: "commentAuthor2's comment", created: 1455723985, ups: 200 } }] } }] },
        { data: [{}, { data: { children: [{ data: { author: "commentAuthor3", body_html: "commentAuthor3's comment", created: 1455723986, ups: 150 } }] } }] }
    ]

    // Set the mocked return value for getRedditPosts
    getRedditPosts.mockResolvedValue(getRedditPostsMockResponse);

    // Set the mocked return value for getAllTopComments
    getAllTopComments.mockResolvedValue(getAllTopCommentsMockResponse);

    // Expected response
    const expectedResponse = [
        { id: "123", rank: 1, title: "Super Mario World is my favorite game!", subreddit: "subreddit1", text: "SMW on Super Nintendo is my favorite retro platformer.", author: "author1", upvotes: 100, date: "7 years ago", topCommentText: "commentAuthor1's comment", topCommentAuthor: "commentAuthor1", commentDate: "7 years ago", topCommentUpVotes: 100, mediaURL: "www.abc.com", mediaType: "link", archived: "false", link: "r/link1"  },
        { id: "456", rank: 1, title: "Super Mario World is pure nostalgia", subreddit: "subreddit2", text: "I love Super Mario World on Super Nintendo. I get such nostalgia when I play that retro platformer", author: "author2", upvotes: 75, date: "just now", topCommentText: "commentAuthor2's comment", topCommentAuthor: "commentAuthor2", commentDate: "7 years ago", topCommentUpVotes: 200, mediaURL: "www.xyz.com", mediaType: "link", archived: "false", link: "r/link2" },
        { id: "789", rank: 1, title: "Anyone play Super Mario World on Game Boy Advance?", subreddit: "subreddit3", text: "I remember playing SMW on Game Boy Advance. Such a great retro platformer", author: "author3", upvotes: 150, date: "just now", topCommentText: "commentAuthor3's comment", topCommentAuthor: "commentAuthor3", commentDate: "7 years ago", topCommentUpVotes: 150, mediaURL: "www.foo.com", mediaType: "link", archived: "false", link: "r/link3" }
    ]

    // Act
    const actualResponse = await processPosts(accessToken, gameTitle, gamePlatform, matchTitleExactly);

    // Assert
    expect(actualResponse).toEqual(expectedResponse);
});

it("tests formatGameTitle() which returns subreddit-formatted title and tests whether the title had roman numerals", () => {
    // Arrange
    const gameTitle = "street fighter ii: the world warrior"

    // Act
    const formattedGameTitle = formatGameTitle(gameTitle);

    // Assert
    expect(formattedGameTitle).toEqual("streetfighter");
});

it("tests validatePost() using data that should result in the function returning a validity score of 3", () => {
    // Arrange
    const postTitle = "Street Fighter II is my favorite game";
    const postSubreddit = "streetfighter";
    const postText = "I remember playing Street Fighter II: The World Warrior on my SNES, Genesis and 3do. It was my favorite game back in 1991. I get nostalgia when I pickup my controller and play. Definitely my favorite video game";
    const gameTitle = "street fighter ii: the world warrior";
    const formattedGameTitle = "streetfighter";
    const gamePlatform = "SNES";

    // Act
    const validityScore = validatePost(postTitle, postSubreddit, postText, gameTitle, formattedGameTitle, gamePlatform);

    // Assert
    expect(validityScore).toEqual(3);
});

it("tests validatePost() using data that should result in the function returning a validity score of 1", () => {
    // Arrange
    const postTitle = "Cool spot in Toronto?";
    const postSubreddit = "toronto";
    const postText = "I am looking for a cool areas of the city to hang out, can anyone help?";
    const gameTitle = "cool spot";
    const formattedGameTitle = "coolspot";
    const gamePlatform = "SNES";

    // Act
    const validityScore = validatePost(postTitle, postSubreddit, postText, gameTitle, formattedGameTitle, gamePlatform);

    // Assert
    expect(validityScore).toEqual(1);
});