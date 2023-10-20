// tile.js - This file displays a posts's data formatted within a tile object.
// A single tile is a container for a single post. When clicked, a tile will expand to display:
// - the post's body (text, image, embedded video / YouTube video, Tweet etc.)
// - A text input element for inputting a comment along with submission button
// - Buttons for Upvoting and Downvoting the post

import Image from "next/image";
import Link from "next/link";
import ReactPlayer from 'react-player/youtube';
import { Tweet } from 'react-tweet';


export default function Tile({ post }) {
    // TODO: Implement onClick expansion of post

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
                embeddedMedia = <Tweet id={post.mediaURL} />
                break;
            case "link":
                embeddedMedia = <Link href={post.mediaURL}>{post.mediaURL}</Link>
        }
        return embeddedMedia;
    }

    return (
        <>
            <div>
                <div>
                    <p><b>post title: </b>{post.title}</p>
                    <p>{post.subreddit}</p>
                    <p>{post.author}</p>
                    <p>{post.date}</p>
                    <p>{post.upvotes}</p>
                    <b>post: </b>
                    {post.text}
                    {embedPostMedia(post)}
                    <b>comment: </b>
                    {post.topCommentText}
                    <p>{post.topCommentAuthor}</p>
                    <p>{post.commentDate}</p>
                    <p>{post.topCommentUpVotes}</p>
                </div>
                <div>
                    {/* Upvote button */}
                    {/* Downvote button */}
                    {/* Input text field (comment) */}
                    {/* Submit comment button */}
                </div>
            </div>
        </>
    )
}