import React, { useState } from 'react';
import axios from 'axios';

const CitySearch = () => {
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchCityWithMostIntercityCalls = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/cities/most-intercity-calls');
            setResults(response.data);
            setHeaders(['City Name', 'Total Intercity Calls']);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderTable = () => {
        if (results.length === 0) {
            return <p>No results found</p>;
        }

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
                {results.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="city-search">
            <h2>City with Most Intercity Calls</h2>
            <button onClick={fetchCityWithMostIntercityCalls}>Search</button>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default CitySearch;
