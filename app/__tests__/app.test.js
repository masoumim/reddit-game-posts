// app.test.js - This file tests the App() component
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../(routes)/app/page";
import userEvent from '@testing-library/user-event';
import { ctx } from "@/app/components/providers";

// Mocking the <SearchForm> component which is the child component of <App>
// *Note: Mocking the searchForm component isn't the only way to run this test, but is used here for example and for future reference of how to mock components.
jest.mock('../components/SearchForm.js', () => ({ searchBarInput, handleSelectPlatform, searchButtonDisabled, platformOptions, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox }) => {
    // Set the prop to have mocked data
    platformOptions = [{ platform: { name: "platform1" } }, { platform: { name: "platform2" } }];

    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                {/* GAME TITLES */}
                <input required autoComplete="off" placeholder="enter a game title" list="game-titles" name="searchBar" className="outline" input={searchBarInput} onInput={handleSearchBarInput} />
                <datalist id="game-titles">
                    {gameTitles.map((title, index) => {
                        return (<option key={index} value={title}>{title}</option>);
                    })}
                </datalist>
                {/* PLATFORMS */}
                <select required aria-label="selectPlatform" onChange={handleSelectPlatform}>
                    <option value={""}>{"Select a platform"}</option>
                    {platformOptions.map((e, index) => {
                        return (<option key={index} value={e.platform.name}>{e.platform.name}</option>);
                    })}
                </select>
                {/* Disable search button unless search bar input matches a title in the drop-down menu */}
                <input type="submit" disabled={searchButtonDisabled} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:text-slate-500" />
                <input type="checkbox" onClick={handleMatchExactlyCheckbox} id="check-match-exactly" name="check-match-exactly" />
                <label htmlFor="check-match-exactly">match title exactly</label>
            </form>
        </>
    )
});

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
    const textInputField = screen.getByPlaceholderText('enter a game title');
    const platformSelect = screen.getByRole("combobox", { name: "selectPlatform" });
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const matchTitleCheckBox = screen.getByRole('checkbox', { name: /match title exactly/i });
    
    // Act    

    // Assert
    expect(textInputField).toBeInTheDocument();
    expect(platformSelect).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(matchTitleCheckBox).toBeInTheDocument();
    expect(matchTitleCheckBox).not.toBeChecked();
});

it("Confirms that submit button becomes enabled when a platform is selected", async () => {
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

    const platformSelect = screen.getByRole("combobox", { name: "selectPlatform" });
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Act
    await userEvent.selectOptions(platformSelect, "platform2");

    // Assert
    expect(screen.getByRole('option', { name: 'platform2' }).selected).toBe(true);
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
