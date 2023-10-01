// Home.test.js - This file tests the Home component (app/page.js)

import React from "react";
import {render, screen} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Home from "../page";
import RootLayout from "../layout";

// it("Confirms presence of 'Connect Reddit account' button in layout when user Clicks the 'Continue without connecting Reddit Account' Link on Home page", () =>{
//     // Arrange
//     render(<Home/>);
//     const continueWithoutConnectingLink = screen.getByRole("link");
    
//     // Act
//     userEvent.click(continueWithoutConnectingLink);
//     render(<Home/>);
//     render(<RootLayout/>);
//     const button = screen.getByRole('button', {name: /Connect Reddit account/i});

//     // Assert
//     expect(button).toBeInTheDocument();
// });