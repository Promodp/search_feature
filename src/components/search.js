import React, { useState, useRef, useEffect, useCallback } from "react";
import useFetchApi from "../hooks/useFetchApi";
import useDebounce from "../hooks/useDebounce";
import "./search.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);
    const dropdownRef = useRef(null);
    const suggestedWords = ["quo", "qui", "fugit", "quia", "quod"];

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

    const handleSelect = (selected) => {
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

    const filteredResults = typeaheadResults
        .map((result) => {
            if (result.name.toLowerCase().startsWith(debouncedQuery.toLowerCase())) {
                return { displayText: result.name, ...result };
            } else if (result.email.toLowerCase().startsWith(debouncedQuery.toLowerCase())) {
                return { displayText: result.email, ...result };
            } else if (result.body.toLowerCase().startsWith(debouncedQuery.toLowerCase())) {
                return { displayText: result.body, ...result };
            }
            return null;
        })
        .filter(Boolean);

    return (
        <div className="search-container" ref={dropdownRef}>
            <h2 className="search-heading">Type words like {suggestedWords.join(", ")} to see magic</h2>
            <div className="search-box">
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
                                onClick={() => handleSelect(result)}
                            >
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
                <div className="search-results">
                    <h3>Search Results</h3>
                    {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                            <div key={item.id} className="search-item">
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Email:</strong> {item.email}</p>
                                <p><strong>Description:</strong> {item.body.length > 64 ? item.body.substring(0, 64) + "..." : item.body}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results-message">No results found. Try a different keyword {suggestedWords.join(", ")}!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
