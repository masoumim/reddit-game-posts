// app.submit.test.js - This file tests the <App> component and simulates what happens when a user submits a search for a game title
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../(routes)/app/page_old";
import userEvent from "@testing-library/user-event";
import { checkGameTitle } from "../api/vgdb.js"; // Import the actual function from the module that we want mocked
import { ctx } from "@/app/components/providers";

// Tell Jest to mock the implementation of this module
// *This will use the mocked version of the module in the __mocks__ folder.
jest.mock("../api/vgdb.js");

it("Confirms game info (title, release year, platform(s), metacritic score) is displayed on successful search", async () => {
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

    // Get the select platform element
    const platformSelect = screen.getByRole("combobox", { name: "selectPlatform" });
    // Get the search bar element
    const searchBar = screen.getByPlaceholderText('enter a game title');
    // Get the search button
    const submitButton = screen.getByRole('button', { name: /Search/i });
    
    // A mock response of the data returned from RAWG API
    const mockResponse = [{
        name: 'game2',
        released: '2023-01-01',
        platforms: [{ platform: { name: 'platform1' } }, { platform: { name: 'platform2' } }],
        tags: [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }],
        metacritic: '75'
    }];

    // Set the mocked return value for checkGameTitle
    checkGameTitle.mockResolvedValue(mockResponse);

    //Act

    // Simulate the user typing in 'game2' into the search bar
    await userEvent.type(searchBar, "game2");
    
    // 'FindBy' is used to Asynchronously wait for the element to appear
    await screen.findByRole("option", { name: "platform2" });
    
    // Simulate the user selecting platform2 from the platform drop-down list
    await userEvent.selectOptions(platformSelect, "platform2");

    // Assert
    expect(screen.getByRole('option', { name: 'platform2' }).selected).toBe(true);
    expect(submitButton).toBeEnabled();

    // Simulate user clicking the submit button
    await userEvent.click(submitButton);

    // Get the expected displayed text
    const gameTitleLabel = await screen.findByText(/Title:/i);
    // We use findAllByText for 'game2' since this text will appear both in the displayed game info and the games drop-down menu
    const gameTitle = await screen.findAllByText(/game2/i);
    const releaseYearLabel = await screen.findByText(/Release Year:/i);
    const releaseYear = await screen.findByText(/2023/i);
    const platformLabel = await screen.findByText(/Platform:/i);
    // We use findAllByText for 'platform' since this text will appear both in the displayed game info and the platforms drop-down menu
    const platform = await screen.findAllByText(/platform2/i);
    const metacriticScoreLabel = await screen.findByText(/Metacritic score:/i);
    const metacriticScore = await screen.findByText(/75/i);

    expect(gameTitleLabel).toBeInTheDocument();
    // findAllByText returns an array so we check it's length
    expect(gameTitle).toHaveLength(2);
    expect(releaseYearLabel).toBeInTheDocument();
    expect(releaseYear).toBeInTheDocument();
    expect(platformLabel).toBeInTheDocument();
    // findAllByText returns an array so we check it's length
    expect(platform).toHaveLength(2);
    expect(metacriticScoreLabel).toBeInTheDocument();
    expect(metacriticScore).toBeInTheDocument();
});