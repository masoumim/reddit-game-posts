// app.test.js - This file tests the App() component

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../(routes)/app/page";
import SearchForm from "../components/SearchForm";
import userEvent from '@testing-library/user-event';
import { ctx } from "@/app/components/providers";

it("Confirms presence of text input field, disabled 'submit' button and unchecked 'match title exactly' checkbox", () => {
    // Arrange    
    // The <App> component uses useContext to create a Context object, we must simulate that in our tests when rendering <App>   
    const navContent = jest.fn();       // Mock the first Context object
    const setNavContent = jest.fn();    // Mock the second Context object

    // When we render <App>, wrap it in the imported Context (ctx) <Provider> component
    render(
        <ctx.Provider value={[navContent, setNavContent]}>
            <App />
        </ctx.Provider>
    );

    // Get the rendered Elements by Role
    const textInputField = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const matchTitleCheckBox = screen.getByRole('checkbox', { name: /match title exactly/i })

    // Act    

    // Assert
    expect(textInputField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(matchTitleCheckBox).toBeInTheDocument();
    expect(matchTitleCheckBox).not.toBeChecked();
});

it("Confirms that submit button becomes enabled when a game title is entered that is in the gameTitles array prop", () => {
    // Arrange
    const gameTitles = ['game1', 'game2', 'game3'];
    const searchBarInput = 'game2';
    render(<SearchForm gameTitles={gameTitles} searchBarInput={searchBarInput} />);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Act

    // Assert
    expect(submitButton).toBeEnabled();

});

it("Confirms the 'match title exactly' checkbox is checked when clicked", async () => {
    // Arrange
    // The <App> component uses useContext to create a Context object, we must simulate that in our tests when rendering <App>   
    const navContent = jest.fn();       // Mock the first Context object
    const setNavContent = jest.fn();    // Mock the second Context object
    // When we render <App>, wrap it in the imported Context (ctx) <Provider> component
    render(
        <ctx.Provider value={[navContent, setNavContent]}>
            <App />
        </ctx.Provider>
    );

    // Get the rendered element by Role
    const matchTitleCheckBox = screen.getByRole('checkbox', { name: /match title exactly/i });

    // Act
    await userEvent.click(matchTitleCheckBox);

    // Assert
    expect(matchTitleCheckBox).toBeChecked();
});
