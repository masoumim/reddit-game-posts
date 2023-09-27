// posts.js - This file gets the list of posts from the store's state via the useSelector() hook
// It then iterates over them, creating a post 'tile' for each one

import React from "react";
import { selectPosts } from "./postsSlice";
import Tile from "@/app/components/tile";

export default function Posts() {

    // Get the 'posts' Object
    const posts = useSelector(selectPosts);

    // Get an array of each individual post Object
    const postsList = Object.values(posts.posts);


    // Iterate though posts and render a tile component for each one
    return (
        <>
            {postsList.map((post) => {
                return <Tile post={post} />
            })}
        </>
    )
}