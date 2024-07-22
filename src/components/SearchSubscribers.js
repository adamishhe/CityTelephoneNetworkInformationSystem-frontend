import React, { useState } from 'react';
import axios from 'axios';

const SearchSubscribers = () => {
    const [serialNo, setSerialNo] = useState('');
    const [benefit, setBenefit] = useState(0);
    const [ageStart, setAgeStart] = useState(0);
    const [ageEnd, setAgeEnd] = useState(100);
    const [results, setResults] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/subscribers/search', {
                params: {
                    serialNo,
                    benefit,
                    ageStart,
                    ageEnd
                }
            });
            console.log('Response data:', response.data); // Отладочный вывод
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        }
    };

    const renderTable = () => {
        if (results.length === 0) {
            return <p>No results found</p>;
        }

        const headers = ["last_name", "first_name", "surname", "gender", "age", "benefit"];

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
                        {headers.map((header) => (
                            <td key={header}>{row[headers.indexOf(header)]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="search-subscribers">
            <h2>Search Subscribers</h2>
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
                    <label>Benefit:</label>
                    <input
                        type="number"
                        value={benefit}
                        onChange={(e) => setBenefit(e.target.value)}
                    />
                </div>
                <div>
                    <label>Age Range:</label>
                    <input
                        type="number"
                        value={ageStart}
                        onChange={(e) => setAgeStart(e.target.value)}
                    />
                    <input
                        type="number"
                        value={ageEnd}
                        onChange={(e) => setAgeEnd(e.target.value)}
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

export default SearchSubscribers;
