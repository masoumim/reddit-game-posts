// vgdb.js - This file handles interacting with the RAWG videogame database API

import axios from "axios";

// Call API using user input for the URL 'search' parameter
export async function checkGameTitle(userInput) {                
    try {        
        const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${userInput}`);        
        
        if(response.data.results.length > 0){                                                
            return response.data.results;            
        }
        else{            
            return "";
        }
    } catch (error) {
        console.error(error);
    }
}