import 'client-only';
// tile.js - This file displays a posts's data formatted within a tile object.
// A single tile is a container for a single post. When clicked, a tile will expand to display:
// - the post's body (text, image, embedded video / YouTube video, Tweet etc.)
// - A text input element for inputting a comment along with submission button
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
            const res = await postComment(`/api/comments?postid=${post.id}&comment=${commentInput}&accesstoken=${accessToken}`, { method: 'POST' })

            // Throw error if user tries to make more than one comment within 2 min limit
            if (!res.data.success) {
                throw "Wait a couple minutes before posting again."
            }

            // Clear the input field
            setCommentInput("");

            // Set the status message
            setSubmitStatusMsg("Comment submitted successfully!");
        }
        catch (err) {
            setSubmitStatusMsg(err);
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
                embeddedMedia = <Image className="p-3" src={post.mediaURL} sizes="100vw" style={{ width: '100%', height: 'auto' }} width={500} height={300} alt="" />;
                break;
            case "video":
                embeddedMedia = <video className="p-3" autoPlay width={"100%"} height={"100%"} controls src={post.mediaURL} type="video/mp4" />;
                break;
            case "youtube":
                // Hack for making Youtube videos responsive: https://github.com/CookPete/react-player#responsive-player
                embeddedMedia = <div className="p-3"><div style={{ position: 'relative', paddingTop: '56.25%' }}><ReactPlayer style={{ position: 'absolute', top: 0, left: 0 }} width={"100%"} height={"100%"} url={post.mediaURL} /></div></div>
                break;
            case "twitter":
                // *The max size of an embedded tweet is 550px
                embeddedMedia = <div className="px-7 sm:w-[550px] sm:p-0 sm:mx-auto"><TwitterTweetEmbed tweetId={post.mediaURL} /></div>
                break;
            case "link":
                embeddedMedia = <div className="px-3"><Link className="break-all text-emerald-200 hover:text-emerald-50 font-bold text-center" href={post.mediaURL}>{post.mediaURL}</Link><br /></div>
                break;
        }
        return embeddedMedia;
    }

    return (
        <>
            <div className="collapse bg-gray-600 w-auto mx-3 mb-5 hover:outline outline-2 outline-emerald-500 lg:w-[1000px] lg:mx-auto">
                <input type="checkbox" name="checkbox" />
                <div className="collapse-title p-0">
                    {/* Post Title */}
                    <p className="font-cairo text-white font-bold text-center text-md mb-2 p-3 sm:text-lg sm:text-left lg:text-xl">{post.title}</p>
                    <div className="sm:flex flex-row">
                        {/* Subreddit */}
                        <p className="text-yellow-300 font-bold text-sm pl-3">r/{post.subreddit}</p>
                        {/* Username */}
                        <p className="text-emerald-500 font-bold text-sm pl-3">u/{post.author}</p>
                        {/* Comment time posted and upvotes */}
                        <div className="flex flex-row gap-2 pl-3">
                            <p className="text-lime-500 font-bold text-sm">{post.date}</p>
                            <p className="text-lime-400 font-bold text-sm">{post.upvotes} upvotes</p>
                        </div>
                    </div>
                    <br />
                    {/* User Comment */}
                    <div className="user-comment text-white italic text-center p-3 sm:text-lg" style={{ overflowWrap: "anywhere" }}>{post.topCommentText}</div>
                    {/* Comment icon and Comment username  */}
                    <div className="sm:flex flex-row">
                        <div className="flex flex-row gap-1 pl-3 sm:flex-1">
                            <div className="bg-comment bg-contain bg-center bg-no-repeat w-5 h-5 pt-6" />
                            <p className="text-emerald-100 font-bold text-sm">u/{post.topCommentAuthor}</p>
                        </div>
                        {/* Comment time posted and upvotes */}
                        <div className="flex flex-row gap-2 pl-3 sm:mr-3">
                            <p className="text-lime-500 font-bold text-sm">{post.commentDate}</p>
                            <p className="text-lime-400 font-bold text-sm">{post.topCommentUpVotes} upvotes</p>
                        </div>
                    </div>
                </div>
                <div className="collapse-content p-0 mt-5">
                    {/* Post content */}
                    <div className="post-text text-white px-3" style={{ overflowWrap: "anywhere" }}>{post.text}</div>
                    {embedPostMedia(post)}
                    <br />
                    {loggedIn ?
                        !post.archived ?
                            <>
                                {/* Comment Form*/}
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="px-3 sm:flex flex-row gap-5 justify-center">
                                        {/* Input text field (comment) */}
                                        <input required autoComplete="off" onChange={(e) => setCommentInput(e.currentTarget.value)} value={commentInput} placeholder="enter a comment" name="comment" minLength={1} maxLength={40000} className="outline-none text-center h-10 w-full max-w-2xl px-5 mb-3 sm:flex-1" />
                                        {/* Submit comment button */}
                                        <input type="submit" name="submit" className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white font-bold py-2 px-4 rounded h-10 w-full sm:w-40" />
                                    </div>
                                    {/* Comment Submission status message */}
                                    <div className="text-white text-sm text-center font-bold">{submitStatusMsg}</div>
                                </form>
                            </>
                            : <div className="text-center px-3"><b className="text-white italic text-sm">Sorry, thread is archived. New comments cannot be posted.</b></div>
                        : <><p className="text-sm text-white pl-3"><button onClick={userAuthorizeApp} className="font-bold text-emerald-300 hover:text-emerald-50">Log in to Reddit</button> to post comments</p></>}
                </div>
            </div>
        </>
    )
}
