import React, { useState } from 'react';
import axios from 'axios';

const SubscriberInfo = () => {
    const [serialNo, setSerialNo] = useState('');
    const [cityName, setCityName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchData = async (url, params, headerNames) => {
        try {
            const response = await axios.get(url, { params });
            setResults(response.data);
            setHeaders(headerNames);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleByAtsType = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/by-ats-type',
            {},
            ['ATS Type', 'First Name', 'Last Name', 'Surname', 'Total Subscribers']
        );
    };

    const handleByAtsSerial = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/by-ats-serial',
            { serialNo },
            ['Serial No', 'First Name', 'Last Name', 'Surname', 'Total Subscribers']
        );
    };

    const handleByCityDistrict = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/by-city-district',
            { cityName, districtName },
            ['City Name', 'District Name', 'First Name', 'Last Name', 'Surname', 'Total Subscribers']
        );
    };

    const handleByBenefitParallel = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/by-benefit-parallel',
            {},
            ['First Name', 'Last Name', 'Surname', 'Age', 'Benefit', 'Phone No']
        );
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
        <div className="subscriber-info">
            <h2>Subscriber Information</h2>
            <div>
                <button onClick={handleByAtsType}>By ATS Type</button>
            </div>
            <div>
                <label>Serial No:</label>
                <input
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                />
                <button onClick={handleByAtsSerial}>By ATS Serial</button>
            </div>
            <div>
                <label>City Name:</label>
                <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                />
                <label>District Name:</label>
                <input
                    type="text"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                />
                <button onClick={handleByCityDistrict}>By City and District</button>
            </div>
            <div>
                <button onClick={handleByBenefitParallel}>Beneficiaries with Parallel Phones</button>
            </div>
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default SubscriberInfo;
