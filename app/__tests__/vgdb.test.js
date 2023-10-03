// vgdb.test.js - This file tests the function in the vgdb.js file

import { checkGameTitle } from "../videogame-db-api/vgdb";
import axios from "axios";

// Tell Jest to mock the axios module
jest.mock('axios');

it('tests the checkGameTitle() method which searches the RAWG API for a game matching the search query', async () => {
    // arrange
    const expectedValue = "Valid Game Title";

    // Mocked response of a POST request sent to the Reddit API route: https://www.reddit.com/api/v1/access_token
    const mockResponse = {
        config: {},
        data: {
          results: [{
            name: "Valid Game Title"
          }]  
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.get.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await checkGameTitle("valid game title");

    // assert
    expect(actualResponse).toEqual(expectedValue);
});

it('tests checkGameTitle() if a valid game title is NOT found', async () => {
    // arrange
    const expectedValue = "";

    // Mocked response of a POST request sent to the Reddit API route: https://www.reddit.com/api/v1/access_token
    const mockResponse = {
        config: {},
        data: {
          results: []  
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.get.mockResolvedValueOnce(mockResponse);

    // act
    const actualResponse = await checkGameTitle("invalid game title");

    // assert
    expect(actualResponse).toEqual(expectedValue);
});