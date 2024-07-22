import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Street = () => {
    const [streets, setStreets] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [newStreet, setNewStreet] = useState({ name: '', districtId: '' });
    const [deleteStreetId, setDeleteStreetId] = useState('');
    const [updateStreetId, setUpdateStreetId] = useState('');
    const [updatedStreet, setUpdatedStreet] = useState({ name: '', districtId: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchStreets(currentPage);
        fetchDistricts();
    }, [currentPage]);

    const fetchDistricts = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/districts');
            setDistricts(result.data.content);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchStreets = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/streets?page=${page}&size=10`);
            console.log('Fetched streets:', result.data);
            setStreets(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteStreetId(result.data.content[0].id);
                setUpdateStreetId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching streets:', error);
        }
    };

    const handleAddStreet = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/streets', {
                ...newStreet,
                district: { id: newStreet.districtId }
            });
            console.log('Added street:', response.data);
            fetchStreets(currentPage);
            setNewStreet({ name: '', districtId: '' });
        } catch (error) {
            console.error('Error adding street:', error);
        }
    };

    const handleDeleteStreet = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/streets/${deleteStreetId}`);
            console.log('Deleted street with ID:', deleteStreetId);
            fetchStreets(currentPage);
        } catch (error) {
            console.error('Error deleting street:', error);
        }
    };

    const handleUpdateStreet = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedStreet.name.trim() !== "") {
                updateData.name = updatedStreet.name;
            }
            if (updatedStreet.districtId) {
                updateData.district = { id: updatedStreet.districtId };
            }
            const response = await axios.put(`http://localhost:8080/api/streets/${updateStreetId}`, updateData);
            console.log('Updated street:', response.data);
            fetchStreets(currentPage);
            setUpdatedStreet({ name: '', districtId: '' });
        } catch (error) {
            console.error('Error updating street:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления улицы */}
            <div className="column">
                <h2>Добавить улицу</h2>
                <form onSubmit={handleAddStreet}>
                    <div className="form-group">
                        <label htmlFor="streetName">Название улицы:</label>
                        <input
                            type="text"
                            id="streetName"
                            value={newStreet.name}
                            onChange={e => setNewStreet({ ...newStreet, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="districtId">Район:</label>
                        <select
                            id="districtId"
                            value={newStreet.districtId}
                            onChange={e => setNewStreet({ ...newStreet, districtId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите район</option>
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления улицы */}
            <div className="column">
                <h2>Удалить улицу</h2>
                <form onSubmit={handleDeleteStreet}>
                    <div className="form-group">
                        <label htmlFor="deleteStreet">Выбрать улицу:</label>
                        <select
                            id="deleteStreet"
                            value={deleteStreetId}
                            onChange={e => setDeleteStreetId(e.target.value)}
                        >
                            {streets.map(street => (
                                <option key={street.id} value={street.id}>
                                    {street.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления улицы */}
            <div className="column">
                <h2>Обновить улицу</h2>
                <form onSubmit={handleUpdateStreet}>
                    <div className="form-group">
                        <label htmlFor="updateStreet">Выбрать улицу:</label>
                        <select
                            id="updateStreet"
                            value={updateStreetId}
                            onChange={e => setUpdateStreetId(e.target.value)}
                        >
                            {streets.map(street => (
                                <option key={street.id} value={street.id}>
                                    {street.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newStreetName">Новое название улицы:</label>
                        <input
                            type="text"
                            id="newStreetName"
                            value={updatedStreet.name}
                            onChange={e => setUpdatedStreet({ ...updatedStreet, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateDistrictId">Район:</label>
                        <select
                            id="updateDistrictId"
                            value={updatedStreet.districtId}
                            onChange={e => setUpdatedStreet({ ...updatedStreet, districtId: e.target.value })}
                        >
                            <option value="" disabled>Выберите район</option>
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом улиц */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Город</th>
                        <th>Район</th>
                        <th>Улица</th>
                    </tr>
                    </thead>
                    <tbody>
                    {streets.map(street => (
                        <tr key={street.id}>
                            <td>{street.district.city.name}</td>
                            <td>{street.district.name}</td>
                            <td>{street.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index)}
                            disabled={index === currentPage}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Street;
