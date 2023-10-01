// utilities.js - This file contains helper functions that help set data for the components

import { useSelector } from "react-redux";
import { selectGeneratedString } from "./redux/features/Reddit/redditSlice.js";

// Gets the username
export function getUsername() {
    // Get the user Object
    return "";
}

// Get the reddit slice's 'generatedStateString'
export function getStateString(){
    const stateString = useSelector(selectGeneratedString);
    console.log(`utilities.js - getStateString() called!: ${stateString}`);
    return stateString;
}