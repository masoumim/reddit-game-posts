// tile.js - This file displays a posts's data formatted within a tile object.
// A single tile is a container for a single post. When clicked, a tile will expand to display:
// - the post's body (text, image, embedded video / YouTube video, Tweet etc.)
// - A text input element for inputting a comment along with submission button
// - Buttons for Upvoting and Downvoting the post

// Collapse component: https://daisyui.com/components/collapse/

import Image from "next/image";
import Link from "next/link";
import ReactPlayer from 'react-player/youtube';
import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function Tile({ post, handleCommentSubmit, loggedIn, userAuthorizeApp, handleCommentInput, commentInput, setCommentInput, handleCommentSubmitButtonClick }) {

    // Embeds the post's media depending on mediaType
    function embedPostMedia(post) {
        let embeddedMedia = "";

        switch (post.mediaType) {
            case "image":
                embeddedMedia = <Image src={post.mediaURL} width={500} height={500} alt="" />;
                break;
            case "video":
                embeddedMedia = <video autoPlay width={320} height={240} controls src={post.mediaURL} type="video/mp4" />;
                break;
            case "youtube":
                embeddedMedia = <ReactPlayer url={post.mediaURL} />
                break;
            case "twitter":
                embeddedMedia = <TwitterTweetEmbed tweetId={post.mediaURL} />
                break;
            case "link":
                embeddedMedia = <Link href={post.mediaURL}>{post.mediaURL}</Link>
                break;
        }
        return embeddedMedia;
    }

    // Render Tile component
    return (
        <>
            <div>
                <div className="collapse bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <p>{post.title}</p>
                        <p>{post.subreddit}</p>
                        <p>{post.author}</p>
                        <p>{post.date}</p>
                        <p>{post.upvotes}</p>
                        {post.topCommentText}
                        <p>{post.topCommentAuthor}</p>
                        <p>{post.commentDate}</p>
                        <p>{post.topCommentUpVotes}</p>
                    </div>
                    <div className="collapse-content">
                        {post.text}
                        {embedPostMedia(post)}
                        <br />
                        {loggedIn ?
                            !post.archived ?
                                <>
                                    <div>
                                        {/* Submit comment button */}
                                        <form onSubmit={handleCommentSubmit}>
                                            {/* Input text field (comment) */}
                                            <input required autoComplete="off" onInput={handleCommentInput} input={commentInput} placeholder="enter a comment" name="comment" className="comment" minLength={1} maxLength={40000} />
                                            {/* Submit comment button */}
                                            <input type="submit" onClick={() => { handleCommentSubmitButtonClick(post.id); setCommentInput("") }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:text-slate-500" />
                                        </form>
                                    </div>
                                </>
                                : <b>Sorry, thread is archived. New comments cannot be posted.</b>
                            : <><button onClick={userAuthorizeApp}>Log in to Reddit</button> to submit comments</>}
                    </div>
                </div>
            </div>
        </>
    )
}