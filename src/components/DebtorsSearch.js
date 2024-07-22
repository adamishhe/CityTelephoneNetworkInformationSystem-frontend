import React, { useState } from 'react';
import axios from 'axios';

const DebtorsSearch = () => {
    const [serialNo, setSerialNo] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchDebtors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/phones/debtors', {
                params: { serialNo, districtName }
            });
            setResults(response.data);
            setHeaders([
                'Subscriber ID', 'First Name', 'Last Name', 'Surname', 'Age', 'Gender',
                'Benefit', 'Phone No', 'Street ID', 'House No', 'Apartment', 'Street Name',
                'District Name', 'City Name', 'ATS Serial No', 'Action Required', 'Total Debtors'
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
        <div className="debtors-search">
            <h2>Search Debtors by ATS Serial and District</h2>
            <div>
                <label>ATS Serial No:</label>
                <input
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                />
                <label>District Name:</label>
                <input
                    type="text"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                />
                <button onClick={fetchDebtors}>Search</button>
            </div>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default DebtorsSearch;
