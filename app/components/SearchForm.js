// SearchForm.js - This file renders a search bar (datalist) along with a submit button
// The datalist is populated with matching games for each character the user enters
// The submit button is disabled unless the input matches an <option>

export default function SearchForm({ isLoadingPlatforms, searchBarInput, handleSelectPlatform, searchButtonDisabled, platformOptions, handleSearchBarInput, handleSearchSubmit, gameTitles, handleMatchExactlyCheckbox }) {
    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                {/* GAME TITLES */}
                <div className="flex flex-col items-center gap-3 mt-3 sm:mx-32 sm:text-lg">
                    <input required autoComplete="off" placeholder="enter a game title" list="game-titles" name="searchBar" input={searchBarInput} onInput={handleSearchBarInput} className="outline-none text-center h-10 w-72 max-w-md px-5 sm:w-full" />
                    <datalist id="game-titles">
                        {gameTitles.map((title, index) => {
                            return (<option key={index} value={title}>{title}</option>);
                        })}
                    </datalist>
                    {/* PLATFORMS */}
                    <select required aria-label="selectPlatform" name="selectPlatform" onChange={handleSelectPlatform} className="outline-none text-center h-10 w-72 max-w-md sm:w-full">
                        {isLoadingPlatforms ?
                            <option value={""}>{"Loading..."}</option>
                            :
                            <>
                                <option value={""}>{"Select a platform"}</option>
                                {platformOptions.map((e, index) => {
                                    return (<option key={index} value={e.platform.name}>{e.platform.name}</option>);
                                })}
                            </>
                        }
                    </select>
                    {/* Disable search button unless search bar input matches a title in the drop-down menu */}
                    <input type="submit" name="submit" value="Search" disabled={searchButtonDisabled} className="bg-emerald-700 transition ease-in-out hover:bg-emerald-600 duration-300 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:text-slate-500 h-10 w-72" />
                </div>
                <div className="flex justify-center">
                <input type="checkbox" onClick={handleMatchExactlyCheckbox} id="check-match-exactly" name="check-match-exactly" />
                <label htmlFor="check-match-exactly" className="text-md text-emerald-50 font-bold sm:text-lg">match title exactly</label>
                </div>
            </form>
        </>
    )
}