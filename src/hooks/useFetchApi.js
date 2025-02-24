import { useState, useEffect } from "react";
import axios from "axios";

const useFetchApi = (query, minLength = 3, typeahead = false) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query.length < minLength) {
            setData([]);
            return;
        }
        setLoading(true);
        setError(null);
        axios
            .get(`https://jsonplaceholder.typicode.com/comments?q=${query}`)
            .then((response) => {
                let filteredResults = response.data.slice(0, 20).map((item) => ({
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    body: item.body,
                    item,
                }));

                if (typeahead) {
                    filteredResults = filteredResults.filter(
                        (result) =>
                            result.name.toLowerCase().startsWith(query.toLowerCase()) ||
                            result.email.toLowerCase().startsWith(query.toLowerCase()) ||
                            result.body.toLowerCase().startsWith(query.toLowerCase())
                    );
                }

                setData(filteredResults);
            })
            .catch(() => setError("Error fetching data"))
            .finally(() => setLoading(false));
    }, [query, minLength, typeahead]);

    return { data, loading, error };
};

export default useFetchApi;
