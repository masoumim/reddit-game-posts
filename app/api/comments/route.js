import 'server-only'

// Route Handler for route: /api/comments

// Calls Reddit API to get the top comment for a post
export async function GET(request){
            
    // Get the url parameters to be used in the API call
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accesstoken');
    const postID = searchParams.get('postid');
    const subreddit = searchParams.get('subreddit');
    
    // Send the GET request
    const res = await fetch(`https://oauth.reddit.com/r/${subreddit}/comments/${postID}/?sort=top`, {
        method: 'GET',
        headers: { 'Authorization': `bearer ${accessToken}` },        
    });
        
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}

// Calls the Reddit API to Post a comment on a Reddit post

