
"use client"

import { createContext, useState } from 'react';

// Create the context
export const ctx = createContext();

// Create and export the 'Providers' component
export default function Providers({children}) {

    // Create the shared state objects
    const [test, setTest] = useState("");
    

    return (
        <ctx.Provider value={[test, setTest]}>
            {children}
        </ctx.Provider>
    );
}