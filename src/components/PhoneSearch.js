import React, { useState } from 'react';
import axios from 'axios';

const PhoneSearch = () => {
    const [streetName, setStreetName] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [results, setResults] = useState([]);
    const [headers, setHeaders] = useState([]);

    const fetchData = async (url, params, headerNames) => {
        try {
            const response = await axios.get(url, { params });
            setResults(response.data);
            setHeaders(headerNames);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    const handleIntercityCallPhones = () => {
        fetchData(
            'http://localhost:8080/api/phones/intercity-call-phones',
            {},
            ['Номер телефона', 'Улица', 'Номер дома']
        );
    };

    const handlePhonesByAddress = () => {
        fetchData(
            'http://localhost:8080/api/phones/phones-by-address',
            { streetName, houseNo },
            ['Номер телефона', 'Улица', 'Номер дома']
        );
    };

    const renderTable = () => {
        if (results.length === 0) {
            return <p>Результаты не найдены</p>;
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
        <div className="phone-search">
            <h2>Поиск телефонов</h2>
            <div>
                <button onClick={handleIntercityCallPhones}>Получить телефоны для междугородних звонков</button>
            </div>
            <div>
                <label>Улица:</label>
                <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                />
                <label>Номер дома:</label>
                <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                />
                <button onClick={handlePhonesByAddress}>Получить телефоны по адресу</button>
            </div>
            <div className="result">
                <h2>Результаты</h2>
                {renderTable()}
            </div>
        </div>
    );
};

export default PhoneSearch;
