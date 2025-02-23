export const suggestedWords = ["quo", "qui", "fugit", "quia", "quod"];

export const filterResults = (results, query) => {
    return results
        .map((result) => {
            if (result.name.toLowerCase().startsWith(query.toLowerCase())) {
                return { displayText: result.name, ...result };
            } else if (result.email.toLowerCase().startsWith(query.toLowerCase())) {
                return { displayText: result.email, ...result };
            } else if (result.body.toLowerCase().startsWith(query.toLowerCase())) {
                return { displayText: result.body, ...result };
            }
            return null;
        })
        .filter(Boolean);
};
