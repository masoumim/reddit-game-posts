// SearchForm.js - This file renders a search bar (datalist) along with a submit button
// The datalist is populated with matching games for each character the user enters
// The submit button is disabled unless the input matches an <option>

export default function SearchForm({ searchBarInput, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox, matchTitleExactly }) {
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
                <input type="checkbox" onClick={handleMatchExactlyCheckbox} id="check-match-exactly" name="check-match-exactly"/>
                <label htmlFor="check-match-exactly">match title exactly</label>
            </form>
        </>
    )
}