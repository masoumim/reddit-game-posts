// dictionary.js - This file handles calls to the Merriam-Webster Dictionary API

import axios from "axios";

// Returns TRUE or FALSE depending on if a definition for the word was returned by the API call
export async function hasDefinition(word) {
    // Base URL: https://www.dictionaryapi.com/api/v3/references/collegiate/json/word-to-search-for?key=your-api-key
    
    try {
        // Call the API using the word
        const response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.NEXT_PUBLIC_DICTIONARY_KEY}`);
    
        // Check response for definition
        if(response.data[0].shortdef){
            console.log(`Definition found for: ${word}`);
            return true;
        }
        else{
            console.log(`No definition found for: ${word}`);
            return false;
        }
    } catch (error) {
        console.error(error);
    }

} 