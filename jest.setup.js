// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// 'fetch' an API built-in to browsers. NodeJs does not contain 'fetch'. 
// In order to mock fetch api calls we use the 'jest-fetch-mock' package
// https://www.npmjs.com/package/jest-fetch-mock
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();