import React, { useState } from 'react';
import axios from 'axios';

const PairedPhonesSearch = () => {
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchPairedPhonesWithFreePhones = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/phones/paired-phones-with-free-phones');
            setResults(response.data);
            setHeaders([
                'Paired Phone No', 'Street Name', 'House No', 'ATS Serial No', 'Available Phone No'
            ]);
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
        <div className="paired-phones-search">
            <h2>Search Paired Phones with Free Phones</h2>
            <button onClick={fetchPairedPhonesWithFreePhones}>Search</button>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default PairedPhonesSearch;
