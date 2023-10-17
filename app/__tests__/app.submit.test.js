// app.submit.test.js - This file tests the <App> component and simulates what happens when a user submits a search for a game title

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../(routes)/app/page";
import userEvent from "@testing-library/user-event";
import { checkGameTitle } from "../api/vgdb.js"; // Import the actual module that we want mocked

// Tell Jest to mock the implementation of this module
// *This will use the mocked version of the module in the __mocks__ folder.
jest.mock("../api/vgdb.js");

// Mocking the <SearchForm> component which is the child component of <App>
jest.mock('../components/SearchForm.js', () => ({ searchBarInput, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox }) => {

    // Set the prop to have mocked data
    gameTitles = ['game1', 'game2', 'game3'];

    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                <input required placeholder="enter a game title" list="game-titles" name="searchBar" className="outline" input={searchBarInput} onChange={handleSearchBarInput} />
                <datalist id="game-titles">
                    {gameTitles.map((title, index) => {
                        return (<option key={index} value={title}>{title}</option>);
                    })}
                </datalist>
                <input type="submit" disabled={!gameTitles.includes(searchBarInput)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:text-slate-500" />
                <input type="checkbox" onClick={handleMatchExactlyCheckbox} id="check-match-exactly" name="check-match-exactly" />
                <label htmlFor="check-match-exactly">match title exactly</label>
            </form>
        </>
    )
});

it("Confirms game info (title, release year, platform(s), metacritic score) is displayed on successful search", async () => {
    // Arrange    
    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const searchBar = screen.getByRole('combobox');

    // A mock response of the data returned from RAWG API
    const mockResponse = [{
        name: 'game2',
        released: '2023-01-01',
        platforms: [{ platform: { name: 'system1' } }, { platform: { name: 'system2' } }],
        tags: [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }],
        metacritic: '75'
    }];

    // Set the mocked return value for checkGameTitle
    checkGameTitle.mockResolvedValue(mockResponse);

    //Act
    
    // Simulate user entering game title in search bar
    await userEvent.type(searchBar, 'game2');

    // Asserts that the submit button is present and enabled
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();

    // Simulate user clicking the submit button
    await userEvent.click(submitButton);

    // Get the expected displayed text
    const gameTitleLabel = await screen.findByText(/Title:/i);
    // We use findAllByText for 'game2' since this text will appear both in the displayed game info and the drop-down menu
    const gameTitle = await screen.findAllByText(/game2/i);
    const releaseYearLabel = await screen.findByText(/Release Year:/i);
    const releaseYear = await screen.findByText(/2023/i);
    const platformsLabel = await screen.findByText(/Platform\(s\):/i);
    const platforms = await screen.findByText(/system1, system2/i);
    const metacriticScoreLabel = await screen.findByText(/Metacritic score:/i);
    const metacriticScore = await screen.findByText(/75/i);

    expect(gameTitleLabel).toBeInTheDocument();
    // findAllByText returns an array so we check it's length
    expect(gameTitle).toHaveLength(2);
    expect(releaseYearLabel).toBeInTheDocument();
    expect(releaseYear).toBeInTheDocument();
    expect(platformsLabel).toBeInTheDocument();
    expect(platforms).toBeInTheDocument();
    expect(metacriticScoreLabel).toBeInTheDocument();
    expect(metacriticScore).toBeInTheDocument();    
});