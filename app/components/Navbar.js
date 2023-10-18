"use client";


import { useContext } from "react";
import { ctx } from "../components/providers"


export default function Navbar() {

    const context = useContext(ctx);
    const test = context[0];
    const setTest = context[1];

    return (
        <>
            {test}
            <b>Reddit Game Posts</b>
        </>
    )
}