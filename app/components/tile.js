// tile.js - This file displays a posts's data formatted within a tile object.
// A single tile is a container for a single post. When clicked, a tile will expand to display:
// - the post's body (text, image, embedded video / YouTube video, Tweet etc.)
// - A text input element for inputting a comment along with submission button
// - Buttons for Upvoting and Downvoting the post

// Collapse component: https://daisyui.com/components/collapse/

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactPlayer from 'react-player/youtube';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { postComment } from "../api/reddit";

export default function Tile({ post, loggedIn, userAuthorizeApp, accessToken }) {

    const [commentInput, setCommentInput] = useState("");           // Comment text
    const [submitStatusMsg, setSubmitStatusMsg] = useState("");     // Comment submission status message

    // Handle submission of a comment
    async function handleCommentSubmit(event) {
        event.preventDefault();

        try {
            // POST the comment using the Reddit API
            await postComment(post.id, commentInput, accessToken);

            // Clear the input field
            setCommentInput("");

            // Set the status message
            setSubmitStatusMsg("Comment submitted successfully!");
        }
        catch (err) {
            setSubmitStatusMsg(`There was an error submitting your comment: ${err}`);
        }
    }

    // Clears the submit status message after 3 seconds
    useEffect(() => {
        setTimeout(() => {
            setSubmitStatusMsg("");
        }, 3000);
    }, [submitStatusMsg]);

    // Embeds the post's media depending on mediaType
    function embedPostMedia(post) {
        let embeddedMedia = "";

        switch (post.mediaType) {
            case "image":
                // Nextjs method for making images responsive: https://nextjs.org/docs/app/api-reference/components/image#responsive-image-with-aspect-ratio
                embeddedMedia = <Image src={post.mediaURL} sizes="100vw" style={{ width: '100%', height: 'auto' }} width={500} height={300} alt="" />;
                break;
            case "video":
                embeddedMedia = <video autoPlay width={320} height={240} controls src={post.mediaURL} type="video/mp4" />;
                break;
            case "youtube":
                // Hack for making Youtube videos responsive: https://github.com/CookPete/react-player#responsive-player
                embeddedMedia = <div style={{ position: 'relative', paddingTop: '56.25%' }}><ReactPlayer style={{ position: 'absolute', top: 0, left: 0 }} width={"100%"} height={"100%"} url={post.mediaURL} /></div>
                break;
            case "twitter":
                embeddedMedia = <TwitterTweetEmbed tweetId={post.mediaURL} />
                break;
            case "link":                
                embeddedMedia = <><Link href={post.mediaURL}>{post.mediaURL}</Link><br/></>
                break;
        }
        return embeddedMedia;
    }

    return (
        <>
            <div className="collapse bg-gray-600 w-64 mx-auto mb-5 p-3">
                <input type="checkbox" />
                <div className="collapse-title p-0">
                    <p className="text-white font-bold text-center">{post.title}</p>
                    <p className="">{post.subreddit}</p>
                    <p>{post.author}</p>
                    <p>{post.date}</p>
                    <p>{post.upvotes}</p>
                    {post.topCommentText}
                    <p>{post.topCommentAuthor}</p>
                    <p>{post.commentDate}</p>
                    <p>{post.topCommentUpVotes}</p>
                </div>
                <div className="collapse-content break-all p-0">
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
                                        <input required autoComplete="off" onChange={(e) => setCommentInput(e.currentTarget.value)} value={commentInput} placeholder="enter a comment" name="comment" className="comment" minLength={1} maxLength={40000} />
                                        {/* Submit comment button */}
                                        <input type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:text-slate-500" />
                                        {/* Comment Submission status message */}
                                        {submitStatusMsg}
                                    </form>
                                </div>
                            </>
                            : <b>Sorry, thread is archived. New comments cannot be posted.</b>
                        : <><p className="text-sm text-white"><button onClick={userAuthorizeApp} className="font-bold text-emerald-100">Log in to Reddit</button> to post comments</p></>}
                </div>
            </div>
        </>
    )
}