"use client";
// page.js - This file is the main / root 'home page' for the app.
import userAuthorizeApp from "./api/userAuthorizeApp";
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
      <div className="flex flex-col items-center text-emerald-50 bg-gray-600 mt-10 w-auto p-5 mx-4 rounded-lg lg:w-[1000px] lg:mx-auto">
        <p className="font-cairo text-sm font-bold text-center sm:text-lg">Find and browse Reddit posts about any game at a glance using an improved search function</p>
        <br />
        <button onClick={userAuthorizeApp} className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white text-center text-sm font-bold py-2 px-4 w-52 rounded sm:w-96 sm:text-lg">Connect your Reddit Account</button>
        <br />
        <Link href={'/app'} className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white text-center font-bold text-sm py-2 px-4 w-52 rounded sm:w-96 sm:text-lg">Continue without connecting account</Link>
      </div>

      {/* Game Platform Logos - image sources are added to tailwind.config.js */}
      <div className=" max-w-[1000px] mx-auto">
        <div className="flex flex-col items-center my-5 gap-5 lg:flex-none lg:grid grid-cols-3 place-items-center lg:gap-10">
          <div className="bg-gray-700 bg-nes bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-snes bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-n64 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-gamecube bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-wii bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-wiiu bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-nintendoswitch bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-gameboy bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-gameboycolor bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-gameboyadvance bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-nintendods bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-nintendo3ds bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-segamastersystem bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-segagenesis bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-segacd bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-sega32x bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-segasaturn bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-segadreamcast bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-segagamegear bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-playstation bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-32"></div>
          <div className="bg-gray-700 bg-playstation2 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-playstation3 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-playstation4 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-playstation5 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-playstationportable bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-playstationvita bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-xbox bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-xbox360 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-xboxone bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-xboxseriesxs bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-amiga bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-atari2600 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-atari5200 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-atari7800 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-atarist bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-atari400 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-atari800 bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-atarixegs bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-atarijaguar bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-atarilynx bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-atari-flashback-classics bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-14"></div>
          <div className="bg-gray-700 bg-3do bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-32"></div>
          <div className="bg-gray-700 bg-neogeo bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-16"></div>
          <div className="bg-gray-700 bg-windowspc bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-16"></div>
          <div className="bg-gray-700 bg-macos bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-16"></div>
          <div className="bg-gray-700 bg-classicmacintosh bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-appleII bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-linux bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-28"></div>
          <div className="bg-gray-700 bg-android bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-16"></div>
          <div className="bg-gray-700 bg-ios bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
          <div className="bg-gray-700 bg-web bg-contain bg-center bg-no-repeat bg-blend-luminosity hover:bg-blend-normal w-60 h-24"></div>
        </div>
      </div>
    </>
  )
}