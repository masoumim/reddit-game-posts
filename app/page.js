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
      <div className="flex flex-col items-center text-emerald-50 bg-gray-600 mt-10 w-fit p-5 mx-4 rounded-lg">
        <p className="text-sm font-bold text-justify">Find and browse Reddit posts about any game at a glance using an improved search function</p>
        <br />
        <button onClick={userAuthorizeApp} className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white text-center text-sm font-bold py-2 px-4 w-52 rounded">Connect your Reddit Account</button>
        <br />
        <Link href={'/app'} className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white text-center font-bold text-sm py-2 px-4 w-52 rounded">Continue without connecting account</Link>
      </div>

      {/* Game Platform Logos - image sources are added to tailwind.config.js */}
      <div className="flex flex-col items-center mt-5 gap-5">        
        <div className="bg-gray-700 bg-nes bg-cover bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
        <div className="bg-gray-700 bg-atari-flashback-classics bg-cover bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-11"></div>
      </div>
    </>
  )
}