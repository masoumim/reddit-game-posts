// Home.test.js - This file tests the <Home> component (app/page.js)
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ctx } from "@/app/components/providers";
import Home from "../page";

it("Confirms presence of 'Connect your Reddit account' button' and 'Continue without connecting Reddit Account' Link", () => {
    // Arrange
    // The <Home> component uses useContext to create a Context object, we must simulate that in our tests when rendering <Home>   
    const navContent = jest.fn();       // Mock the first Context object
    const setNavContent = jest.fn();    // Mock the second Context object

    // When we render <Home>, wrap it in the imported Context (ctx) <Provider> component
    render(
        <ctx.Provider value={[navContent, setNavContent]}>
            <Home />
        </ctx.Provider>
    );

    const link = screen.getByRole('link', { name: /Continue without connecting account/i });
    const button = screen.getByRole('button', { name: /Connect your Reddit account/i });

    // Act    

    // Assert
    expect(button).toBeInTheDocument();
    expect(link).toBeInTheDocument();
});