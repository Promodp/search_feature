import React from "react";
import { suggestedWords } from "../utils/helper";
import "./search.css";

const NoResultsMessage = () => {
    return (
        <p className="no-results">
            No results found. Try: {suggestedWords.join(", ")}
        </p>
    );
};

export default NoResultsMessage;
