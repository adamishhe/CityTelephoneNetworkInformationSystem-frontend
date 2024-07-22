import React, { useState } from 'react';
import axios from 'axios';

const SearchFreePhones = () => {
    const [serialNo, setSerialNo] = useState('');
    const [cityName, setCityName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [results, setResults] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/phones/free-phones', {
                params: {
                    serialNo,
                    cityName,
                    districtName
                }
            });
            console.log('Response data:', response.data); // Отладочный вывод
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching free phones:', error);
        }
    };

    const renderTable = () => {
        if (results.length === 0) {
            return <p>No results found</p>;
        }

        const headers = ["phone_no", "street_name", "house_no"];

        return (
            <table>
                <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header.replace('_', ' ')}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {results.map((row, index) => (
                    <tr key={index}>
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
        <div className="search-free-phones">
            <h2>Search Free Phones</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Serial No:</label>
                    <input
                        type="text"
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                    />
                </div>
                <div>
                    <label>City Name:</label>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                </div>
                <div>
                    <label>District Name:</label>
                    <input
                        type="text"
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                    />
                </div>
                <button type="submit">Search</button>
            </form>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default SearchFreePhones;
