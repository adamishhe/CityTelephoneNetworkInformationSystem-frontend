import React, { useState } from 'react';
import axios from 'axios';

const PhoneSearch_ = () => {
    const [phoneNo, setPhoneNo] = useState('');
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchSubscriberByPhoneNo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/phones/subscriber-by-phone', {
                params: { phoneNo }
            });
            setResults(response.data);
            setHeaders([
                'Subscriber ID', 'First Name', 'Last Name', 'Surname', 'Age', 'Gender',
                'Benefit', 'Phone No', 'Phone Type', 'Street ID', 'House No',
                'Apartment', 'Street Name', 'District Name', 'City Name', 'ATS Serial No'
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
        <div className="phone-search_">
            <h2>Search Subscriber by Phone Number</h2>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                />
                <button onClick={fetchSubscriberByPhoneNo}>Search</button>
            </div>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default PhoneSearch_;
