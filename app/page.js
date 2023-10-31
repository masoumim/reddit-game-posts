"use client";
// page.js - This file is the main / root 'home page' for the app.

import { userAuthorizeApp } from "./api/reddit.js";
import Link from "next/link.js";
import { ctx } from "@/app/components/providers";
import { useContext, useEffect } from "react";

export default function Home() {
  
  const context = useContext(ctx);   // The React Context 'Provider' component    
  const setNavContent = context[1];  // Used to set the state of the navbar content

  useEffect(() => {
    // Set the nav content to empty:
    setNavContent("");
  })
  
  return (      
    <>
      <button onClick={userAuthorizeApp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect your Reddit Account</button>
      <br />
      <br />      
      <Link href={'/app'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue without connecting Reddit Account</Link>
    </>
  )
}