import 'server-only'

// Route Handler for route: /api/authapp
// This route is for Application Only OAuth (no user auth / Reddit Login): https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth
// Here we make a call to the Reddit API to retrieve and return an access token

export async function POST(){                                
    // Send the POST request
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString('base64'),
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials`
    });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}