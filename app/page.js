"use client";
// page.js - This file is the main / root 'home page' for the app.

import { useDispatch } from "react-redux";
import { setGeneratedStateString } from "./redux/features/Reddit/redditSlice.js";
import { userAuthorizeApp, authorizeAppOnly } from "./reddit-api/reddit.js";
import Link from "next/link.js";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";

export default function Home() {
  // Use UUID to generate key for "state" parameter required by Reddit API
  const stateString = uuidv4();

  const dispatch = useDispatch();

  // Save stateString to Reddit slice
  // useDispatch(setGeneratedStateString({generatedStateString: stateString}));

  useEffect(() => {
    dispatch(setGeneratedStateString({ generatedStateString: stateString }));
  }, []);

  return (
    <>
      <button onClick={() => userAuthorizeApp(stateString)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect your Reddit Account</button>
      <br />
      <br />
      {/* <button onClick={authorizeAppOnly} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</button> */}
      <Link href={'/app'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</Link>
    </>
  )
}