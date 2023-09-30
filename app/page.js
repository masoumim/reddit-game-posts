"use client";
// page.js - This file is the main / root 'home page' for the app.

import { Foo, authorizeApp, authorizeAppOnly } from "./reddit-api/reddit.js";

export default function Home() {
  return (
    <>      
      <button onClick={authorizeApp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect your Reddit Account</button>
      <br />
      <br />
      <button onClick={authorizeAppOnly} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</button>
    </>
  )
}