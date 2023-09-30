// Home.test.js - This file tests the Home component (app/page.js)

import React from "react";
import {render, screen} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Home from "../page";
import { getUsername } from "../utilities";

it("Confirms empty username when user Clicks the 'Continue without connecting Reddit Account' Link", () =>{
    // Arrange
    render(<Home/>);
    const continueWithoutConnectingLink = screen.getByRole("link");
    
    // Act
    userEvent.click(continueWithoutConnectingLink);
    const userName = getUsername();

    // Assert
    expect(userName).toEqual("");
});