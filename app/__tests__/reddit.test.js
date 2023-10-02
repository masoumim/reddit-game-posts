// reddit.test.js - This file tests the functions in the reddit.js file

import { authorizeAppOnly } from "../reddit-api/reddit";
import axios from "axios";

// Tell Jest to mock the axios module
jest.mock('axios');

it('tests the authorizeAppOnly method which returns an access token', async () => {
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
    axios.request.mockResolvedValue(mockResponse);

    // act
    const actualResponse = await authorizeAppOnly();

    // assert
    expect(actualResponse).toEqual(expectedValue);
})