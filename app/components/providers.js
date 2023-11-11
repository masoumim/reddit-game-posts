'use client';
/*
Providers.js - This file sets up the React 'Context' feature which enables sharing state data 
between components without having to pass them down manually as props.

The Context feature is used here to set the state of the navbar content in the root layout.js file.

The content being set conditionally rendered to be either:
1. The Reddit username as a <Link> to their Reddit profile 
2. "Loading..." when the username is being fetched
3. A "Log in to Reddit" button

The Providers component below accepts a 'children' prop from the RootLayout component located in app/layout.js
This children prop represents every component in the component tree, hence the ability to share a state variable in a global way.
*/

import { createContext, useState } from 'react';

// Create the context
export const ctx = createContext();

// Create and export the 'Providers' component
export default function Providers({children}) {

    // Create the shared state object
    const [navContent, setNavContent] = useState("");
    
    return (
        <ctx.Provider value={[navContent, setNavContent]}>
            {children}
        </ctx.Provider>
    );
}