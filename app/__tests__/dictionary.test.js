// dictionary.test.js - This file tests the Dictionary API

import { hasDefinition } from "../api/dictionary";
import axios from "axios";

// Tell Jest to mock the axios module
jest.mock('axios');

it('tests the hasDefinition() method which returns TRUE or FALSE depending on if a word is found in dictionary', async () => {
    // Arrange
    const expectedValue = true;

    // Mocked response of a GET request sent to the Merriam-Webster Dictionary API
    // *The 'shortdef' array is returned when the word is found in the dictionary, otherwise, the array is not included in the response
    const mockResponse = {
        data: [{
            meta: { id: "foo" },
            shortdef: []
        }]
    };

    // Set the mocked response to be what is returned by 'axios.request'
    axios.get.mockResolvedValue(mockResponse);

    // Act
    const actualResponse = await hasDefinition("foo");

    // Assert
    expect(actualResponse).toEqual(expectedValue);
});