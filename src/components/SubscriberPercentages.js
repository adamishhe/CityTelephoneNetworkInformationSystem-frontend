import React, { useState } from 'react';
import axios from 'axios';

const SubscriberPercentages = () => {
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
            'http://localhost:8080/api/subscribers/percentages-by-ats-type',
            {},
            ['ATS Type', 'Percentage Regular', 'Percentage Benefit']
        );
    };

    const handleByAtsSerial = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/percentages-by-ats-serial',
            { serialNo },
            ['Serial No', 'Percentage Regular', 'Percentage Benefit']
        );
    };

    const handleByCityDistrict = () => {
        fetchData(
            'http://localhost:8080/api/subscribers/percentages-by-city-district',
            { cityName, districtName },
            ['City Name', 'District Name', 'Percentage Regular', 'Percentage Benefit']
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
        <div className="subscriber-percentages">
            <h2>Subscriber Percentages</h2>
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
            <div className="result">
                <h2>Results</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default SubscriberPercentages;
