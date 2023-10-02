// Home.test.js - This file tests the Home component (app/page.js)

import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";

it("Confirms presence of 'Connect your Reddit account' button' and 'Continue without connecting Reddit Account' Link", () =>{
    // Arrange
    render(<Home/>);
    const link = screen.getByRole('link', {name: /Continue without connecting Reddit Account/i});
    const button = screen.getByRole('button', {name: /Connect your Reddit account/i});

    // Act    
    
    // Assert
    expect(button).toBeInTheDocument();
    expect(link).toBeInTheDocument();
});