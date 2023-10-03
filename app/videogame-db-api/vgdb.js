// vgdb.js - This file handles interacting with the RAWG videogame database API

import axios from "axios";

// Call API using user input for the URL 'search' parameter
export async function checkGameTitle(userInput) {
    // *The page_size parameter indicates how many results we want per page. 
    // Since each search is for a single game title, we set it to 1.
    try {
        const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${userInput}&page_size=1`);        
        console.log(response);
        if(response.data.results.length > 0){                        
            return response.data.results[0].name;
        }
        else{            
            return "";
        }
    } catch (error) {
        console.error(error);
    }
}