// app.submit.test.js - This file tests the <App> component and simulates what happens when a user submits a search for a game title

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../(routes)/app/page";
import userEvent from "@testing-library/user-event";
import axios from "axios";



// Tell Jest to mock the axios module
jest.mock('axios');

// Mocking the <SearchForm> component which is the child component of <App>
jest.mock('../components/SearchForm.js', () => ({ searchBarInput, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox }) => {

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

    const mockResponse = {
        config: {},
        data: {
            results: [{
                name: 'game2',
                released: '2023-01-01',
                platforms: [{ platform: { name: 'system1' } }, { platform: { name: 'system2' } }],
                metacritic: '75'
            }]
        },
        headers: {},
        request: {},
        status: 200,
        statusText: ""
    };

    await userEvent.type(searchBar, 'game2');

    // Set the mocked response to be what is returned by 'axios.request'    
    axios.get.mockResolvedValue(mockResponse);
    
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    const gameTitleLabel = await screen.findByText(/Title:/i);
    const gameTitle = await screen.findAllByText(/game2/i);
    const releaseYearLabel = await screen.findByText(/Release Year:/i);
    const releaseYear = await screen.findByText(/2023/i);
    const platformsLabel = await screen.findByText(/Platform\(s\):/i);
    const platforms = await screen.findByText(/system1, system2/i);
    const metacriticScoreLabel = await screen.findByText(/Metacritic score:/i);
    const metacriticScore = await screen.findByText(/75/i);

    expect(gameTitleLabel).toBeInTheDocument();
    expect(gameTitle).toHaveLength(2);
    expect(releaseYearLabel).toBeInTheDocument();
    expect(releaseYear).toBeInTheDocument();
    expect(platformsLabel).toBeInTheDocument();
    expect(platforms).toBeInTheDocument();
    expect(metacriticScoreLabel).toBeInTheDocument();
    expect(metacriticScore).toBeInTheDocument();    
});