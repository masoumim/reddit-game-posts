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
                embeddedMedia = <><Link className="break-all text-emerald-200 hover:text-emerald-50 font-bold text-center" href={post.mediaURL}>{post.mediaURL}</Link><br/></>
                break;
        }
        return embeddedMedia;
    }

    return (
        <>
            <div className="collapse bg-gray-600 w-64 mx-auto mb-5 p-3 hover:outline outline-2 outline-emerald-500">
                <input type="checkbox" />
                <div className="collapse-title p-0">
                    {/* Post Title */}
                    <p className="text-white font-bold text-center text-md mb-2">{post.title}</p>                    
                    {/* Subreddit */}
                    <p className="text-yellow-300 font-bold text-sm">r/{post.subreddit}</p>
                    {/* Username */}
                    <p className="text-emerald-500 font-bold text-sm">u/{post.author}</p>
                    {/* Comment time posted and upvotes */}
                    <div className="flex flex-row gap-2">
                    <p className="text-lime-500 font-bold text-sm">{post.date}</p>
                    <p className="text-lime-400 font-bold text-sm">{post.upvotes} upvotes</p>
                    </div>
                    <br/>
                    {/* User Comment */}
                    <div className="user-comment text-white italic text-center" style={{overflowWrap: "anywhere"}}>{post.topCommentText}</div>
                    {/* Comment icon and Comment username  */}
                    <div className="flex flex-row gap-1">
                    <div className="bg-comment bg-contain bg-center bg-no-repeat w-5 h-5 pt-6"/>
                    <p className="text-emerald-100 font-bold text-sm">u/{post.topCommentAuthor}</p>
                    </div>
                    {/* Comment time posted and upvotes */}
                    <div className="flex flex-row gap-2">
                    <p className="text-lime-500 font-bold text-sm">{post.commentDate}</p>
                    <p className="text-lime-400 font-bold text-sm">{post.topCommentUpVotes} upvotes</p>
                    </div>
                </div>
                <div className="collapse-content p-0 mt-5">
                    {/* Post content */}
                    <div className="post-text text-white" style={{overflowWrap: "anywhere"}}>{post.text}</div>
                    {embedPostMedia(post)}
                    <br />
                    {loggedIn ?
                        !post.archived ?
                            <>
                                <div>
                                    {/* Submit comment button */}
                                    <form onSubmit={handleCommentSubmit}>
                                        {/* Input text field (comment) */}
                                        <input required autoComplete="off" onChange={(e) => setCommentInput(e.currentTarget.value)} value={commentInput} placeholder="enter a comment" name="comment" className="outline-none text-center h-10 w-full px-5 mb-3" minLength={1} maxLength={40000} />
                                        {/* Submit comment button */}
                                        <input type="submit" className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white font-bold py-2 px-4 rounded h-10 w-full" />
                                        {/* Comment Submission status message */}
                                        <div className="text-white text-sm text-center">{submitStatusMsg}</div>
                                    </form>
                                </div>
                            </>
                            : <b className="text-white italic text-sm break-normal">Sorry, thread is archived. New comments cannot be posted.</b>
                        : <><p className="text-sm text-white"><button onClick={userAuthorizeApp} className="font-bold text-emerald-300 hover:text-emerald-50">Log in to Reddit</button> to post comments</p></>}
                </div>
            </div>
        </>
    )
}