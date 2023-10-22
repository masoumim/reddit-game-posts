// SearchForm.js - This file renders a search bar (datalist) along with a submit button
// The datalist is populated with matching games for each character the user enters
// The submit button is disabled unless the input matches an <option>

export default function SearchForm({ searchBarInput, handleSelectPlatform, searchButtonDisabled, platformOptions, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox }) {
    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                {/* GAME TITLE */}
                <input required autoComplete="off" placeholder="enter a game title" list="game-titles" name="searchBar" className="outline" input={searchBarInput} onInput={handleSearchBarInput} />
                <datalist id="game-titles">
                    {gameTitles.map((title, index) => {
                        return (<option key={index} value={title}>{title}</option>);
                    })}
                </datalist>
                {/* PLATFORM */}
                <select required onChange={handleSelectPlatform}>
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
}