// tile.js - This file displays a posts's data formatted within a tile object.
// A single tile is a container for a single post. When clicked, a tile will expand to display:
// - the post's body (text, image, embedded video / YouTube video, Tweet etc.)
// - A text input element for inputting a comment along with submission button
// - Buttons for Upvoting and Downvoting the post

export default function Tile({post}){    
    // TODO: Implement onClick expansion of post
    return(
        <>
            <div>                
                <p>{post.title}</p>
                <p>{post.subreddit}</p>
                <p>{post.author}</p>
                <p>{post.date}</p>
                <p>{post.upvotes}</p>
                <p>{post.text}</p>
                <br/>
                <p>{post.topCommentText}</p>
                <p>{post.topCommentAuthor}</p>
                <p>{post.commentDate}</p>
                <p>{post.topCommentUpVotes}</p>
            </div>

            <div>
                <div>
                    {post.content}
                </div>
                {/* Upvote button */}
                {/* Downvote button */}
                {/* Input text field (comment) */}
                {/* Submit comment button */}
            </div>
            <br/>
        </>
    )
}