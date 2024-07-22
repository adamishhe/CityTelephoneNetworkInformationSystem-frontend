import React, { useState } from 'react';
import axios from 'axios';

const ATSDebtStats = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (url) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(url);
            setResults(response.data);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleMaxTotalDebt = () => {
        fetchData('http://localhost:8080/api/ats/max-total-debt');
    };

    const handleMaxDebtorsCount = () => {
        fetchData('http://localhost:8080/api/ats/max-debtors-count');
    };

    const handleMinDebtorsCount = () => {
        fetchData('http://localhost:8080/api/ats/min-debtors-count');
    };

    const renderTable = () => {
        if (results.length === 0) {
            return <p>No results found</p>;
        }

        const headers = Object.keys(results[0]);

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
        <div className="ats-debt-stats">
            <h2>ATS Debt Statistics</h2>
            <div>
                <button onClick={handleMaxTotalDebt} disabled={loading}>Max Total Debt</button>
                <button onClick={handleMaxDebtorsCount} disabled={loading}>Max Debtors Count</button>
                <button onClick={handleMinDebtorsCount} disabled={loading}>Min Debtors Count</button>
            </div>
            {error && <p>{error}</p>}
            <div className="result">
                <h2>Results</h2>
                {loading ? <p>Loading...</p> : renderTable()}
            </div>
        </div>
    );
};

export default ATSDebtStats;
