// SearchForm.js - This file renders a search bar along with a submit button

export default function SearchForm({searchBarInput, handleSearchBarInput, handleSearchSubmit}) {
    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                <input required name="searchBar" type="text" input={searchBarInput} onChange={handleSearchBarInput} className="outline"></input>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
            </form>
        </>
    )
}