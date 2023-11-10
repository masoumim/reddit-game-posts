import 'server-only'

// Route Handler for route: /api/user
// Here we make a call to the Reddit API to retrieve and return the user's Reddit username
// Docs: https://www.reddit.com/dev/api#GET_api_v1_me
export async function GET(request){
            
    // Get the access token from the url parameter        
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accesstoken');
                            
    // Send the GET request
    const res = await fetch(`https://oauth.reddit.com/api/v1/me/`, {
        method: 'GET',
        headers: { 'Authorization': `bearer ${accessToken}` }
    });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}