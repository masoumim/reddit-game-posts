import 'server-only'

// Route Handler for route: /api/posts
// Here we make a call to the Reddit API to retrieve and return Reddit posts about a game title
// Docs: https://www.reddit.com/dev/api#GET_search
export async function GET(request){
            
    // Get the url parameters to be used in the API call
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accesstoken');
    const gameTitle = searchParams.get('gametitle');
    const gamePlatform = searchParams.get('gameplatform');
    const matchTitleExactly = searchParams.get('matchtitleexactly');
    
    // If matching title exactly, wrap title in quotes
    const title = matchTitleExactly === 'true' ? `"${gameTitle}"` : `${gameTitle}`;
                                
    // Send the GET request
    const res = await fetch(`https://oauth.reddit.com/search?q=${title}+${gamePlatform}&limit=100&restrict_sr=false`, {
        method: 'GET',
        headers: { 'Authorization': `bearer ${accessToken}` },        
    });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}