"use client";
// page.js - This file is the main / root 'home page' for the app.

import { userAuthorizeApp, authorizeAppOnly } from "./reddit-api/reddit.js";
import Link from "next/link.js";

export default function Home() {
  return (
    <>      
      <button onClick={userAuthorizeApp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect your Reddit Account</button>
      <br />
      <br />
      {/* <button onClick={authorizeAppOnly} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</button> */}
      <Link href={'/app'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</Link>
    </>
  )
}