import 'server-only';

// Route Handler for route: /api/rawg
// This route is for handling calls to the RAWG API
// Docs: https://api.rawg.io/docs/#operation/games_list

// Make a GET request using the user input (game title) and return the results
export async function GET(request){
            
    // Get the user input (game title)        
    const { searchParams } = new URL(request.url);
    const userInput = searchParams.get('searchBarInput');
                            
    // Send the GET request
    const res = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${userInput}`, { method: 'GET' });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}