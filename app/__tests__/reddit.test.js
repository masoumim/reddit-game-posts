// reddit.test.js - This file tests the functions in the reddit.js file

import { authorizeAppOnly, getUserAuthAccessToken, getUserInfo, getRedditPosts } from "../api/reddit";
import axios from "axios";

// Tell Jest to mock the axios module
jest.mock('axios');

it('tests the authorizeAppOnly() method which returns an access token', async () => {
    // arrange
    const expectedValue = "abc123";

    // Mocked response of a POST request sent to the Reddit API route: https://www.reddit.com/api/v1/access_token
    const mockResponse = {
        config: {},
        data: {
            access_token: "abc123",
            expires_in: 86400,
            scope: "read",
            token_type: "bearer"
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.request.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await authorizeAppOnly();

    // assert
    expect(actualResponse).toEqual(expectedValue);
});

it('tests the getUserAuthAccessToken() method which returns an access token', async () => {
    // arrange
    const expectedValue = "abc123";

    // Mocked response of a POST request sent to the Reddit API route: https://www.reddit.com/api/v1/access_token
    const mockResponse = {
        config: {},
        data: {
            access_token: "abc123",
            expires_in: 86400,
            scope: "read",
            token_type: "bearer"
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.request.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await getUserAuthAccessToken('code');

    // assert
    expect(actualResponse).toEqual(expectedValue);
});

it('gets user info by calling the getUserInfo() method', async () => {
    // arrange
    const expectedValue = "user123";

    // Mocked response of a GET request sent to the Reddit API route: https://oauth.reddit.com/api/v1/me/
    const mockResponse = {
        config: {},
        data: {
            name: "user123",
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.request.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await getUserInfo();

    // assert
    expect(actualResponse).toEqual(expectedValue);
});

it('gets an array reddit posts based on the search query by calling getRedditPosts()', async () => {
    // arrange
    const expectedValue = [{ data: {} }, { data: {} }, { data: {} }];

    // Mocked response of a GET request sent to the Reddit API route: https://oauth.reddit.com/search
    const mockResponse = {
        config: {},
        data: {
            data: {
                children: [{ data: {} }, { data: {} }, { data: {} }]
            }
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.request.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await getRedditPosts();

    // assert
    expect(actualResponse).toEqual(expectedValue);
});