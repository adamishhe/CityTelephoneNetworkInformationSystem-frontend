import React, { useState } from 'react';
import axios from 'axios';

const SqlQueryExecutor = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/execute-sql', { query });
            setResult(response.data);
            setError('');
        } catch (error) {
            setError(`Error: ${error.message}`);
            setResult(null);
        }
    };

    const renderTable = () => {
        if (!result || result.length === 0) {
            return <p>No results</p>;
        }

        const headers = Object.keys(result[0]);

        return (
            <table>
                <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {result.map((row, index) => (
                    <tr key={index}>
                        {headers.map((header) => (
                            <td key={header}>{row[header]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="query-executor">
            <h2>Введите SQL запрос</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows="5"
                    cols="50"
                />
                <br />
                <button type="submit">Execute</button>
            </form>
            <div className="result">
                <h2>Result</h2>
                {error && <p>{error}</p>}
                {result ? renderTable() : <p>No results</p>}
            </div>
        </div>
    );
};

export default SqlQueryExecutor;
