// Navbar.js - This file renders the Navbar component
"use client";

import { useContext } from "react";

// Import the React Context provider
import { ctx } from "../components/providers"

export default function Navbar() {
    const context = useContext(ctx);        // Create a context object
    const navContent = context[0];          // The first element in the array is the navContent useState object
    
    // Conditionally render the navContent state variable
    return (
        <>
            {navContent}
            <b>Reddit Game Posts</b>
        </>
    )
}