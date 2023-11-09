import 'server-only'

// Route Handler for route: /api/authuser
// This route is for the Reddit Token Retrieval (code flow): https://github.com/reddit-archive/reddit/wiki/OAuth2#token-retrieval-code-flow
// Here we make a call to the Reddit API to retrieve and return an access token on behalf of the Reddit User

// Set the redirect URI based on the environment
const redirectURI = process.env.NODE_ENV === "development" ? "http://localhost:3000/app" : "https://reddit-game-posts.vercel.app/app";

// Returns the Access Token using URL param 'code'
export async function POST(request){
            
    // Get the code that is in the URL
    const code = await request.json();
                    
    // Send the POST request
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString('base64'),
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectURI}`
    });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}