import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa"; 
import useFetchApi from "../hooks/useFetchApi";
import useDebounce from "../hooks/useDebounce";
import { filterResults, suggestedWords } from "../utils/helper"; 
import SearchResult from "./searchResult";
import "./search.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);
    const dropdownRef = useRef(null);

    const debouncedQuery = useDebounce(query, 300);
    const { data: typeaheadResults } = useFetchApi(debouncedQuery, 3, true);
    const { data: buttonResults } = useFetchApi(debouncedQuery, 3, false);

    useEffect(() => {
        setShowDropdown(typeaheadResults.length > 0);
    }, [typeaheadResults]);

    const handleSearchClick = () => {
        setSearchResults(buttonResults.map((res) => res.item));
        setIsSearchTriggered(true);
        setShowDropdown(false);
    };

    const handleSelect = () => {
        setQuery("");
        setShowDropdown(false);
        setSearchResults(buttonResults.map((res) => res.item));
        setIsSearchTriggered(true);
    };

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const filteredResults = filterResults(typeaheadResults, debouncedQuery);

    return (
        <div className="search-container" ref={dropdownRef}>
            <h2 className="search-heading">Type words like {suggestedWords.join(", ")} to see magic</h2>
            <div className={`search-box ${showDropdown ? "dropdown-open" : ""}`}>
                <div className="search-icon">
                    <FaSearch />
                </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Type to search..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSearchResults([]);
                        setIsSearchTriggered(false);
                    }}
                />
                <button className="search-button" onClick={handleSearchClick}>
                    Search
                </button>
            </div>

            {showDropdown && (
                <ul className="results-list">
                    {filteredResults.length > 0 ? (
                        filteredResults.map((result, index) => (
                            <li
                                key={`${result.id}-${index}`}
                                className="result-item"
                                onClick={() => handleSelect()}
                            >
                                <FaSearch className="list-icon" />
                                {result.displayText}
                            </li>
                        ))
                    ) : (
                        <li className="no-results">
                            No results found. Try: {suggestedWords.join(", ")}
                        </li>
                    )}
                </ul>
            )}

            {isSearchTriggered && (
                <SearchResult searchResults={searchResults} suggestedWords={suggestedWords} />
            )}
        </div>
    );
};

export default Search;
