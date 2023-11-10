import 'server-only'

// Route Handler for route: /api/comments

// Calls Reddit API to get the top comment for a post
// Docs: https://www.reddit.com/dev/api#GET_comments_{article}
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
// Docs: https://www.reddit.com/dev/api#POST_api_comment
export async function POST(request){

    // Get the url parameters to be used in the API call
    const { searchParams } = new URL(request.url);
    const postID = searchParams.get('postid');
    const comment = searchParams.get('comment');    
    const accessToken = searchParams.get('accesstoken');

    // Send the POST request
    const res = await fetch(`https://oauth.reddit.com/api/comment`, {
        method: 'POST',
        headers: { 'Authorization': `bearer ${accessToken}`, 'content-type': 'application/x-www-form-urlencoded' },
        body: `thing_id=t3_${postID}&text=${comment}`
    });
    
    // Return the response data
    const data = await res.json();
    return Response.json({ data });
}
