import React from "react";
import NoResultsMessage from './noResultMessage';

import "./search.css";

const SearchResult = ({ searchResults, suggestedWords }) => {
    return (
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
                <NoResultsMessage/>
            )}
        </div>
    );
};

export default SearchResult;
