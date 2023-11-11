'use client';
// Navbar.js - This file renders the Navbar component

import { useContext } from "react";
import Link from "next/link";

// Import the React Context provider
import { ctx } from "../components/providers"

export default function Navbar() {
    const context = useContext(ctx);        // Create a context object
    const navContent = context[0];          // The first element in the array is the navContent useState object

    // Conditionally render the navContent state variable
    return (
        <>
            <div className="navbar flex flex-col items-center bg-emerald-700 w-full sm:flex-row">
                <div className="flex-1">
                    <Link href={"/"} className="font-cairo text-emerald-50 transition ease-in-out hover:text-emerald-300 duration-300 font-bold text-xl py-1 sm:ml-5">Reddit Game Posts</Link>
                </div>
                {navContent}
            </div>
        </>
    )
}