import React, { useEffect, useState } from 'react';
import axios from 'axios';

const District = () => {
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [newDistrict, setNewDistrict] = useState({ name: '', cityId: '' });
    const [deleteDistrictId, setDeleteDistrictId] = useState('');
    const [updateDistrictId, setUpdateDistrictId] = useState('');
    const [updatedDistrict, setUpdatedDistrict] = useState({ name: '', cityId: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchDistricts(currentPage);
        fetchCities();
    }, [currentPage]);

    const fetchCities = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/cities');
            setCities(result.data.content);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchDistricts = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/districts?page=${page}&size=10`);
            console.log('Fetched districts:', result.data);
            setDistricts(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteDistrictId(result.data.content[0].id);
                setUpdateDistrictId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const handleAddDistrict = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/districts', {
                ...newDistrict,
                city: { id: newDistrict.cityId }
            });
            console.log('Added district:', response.data);
            fetchDistricts(currentPage);
            setNewDistrict({ name: '', cityId: '' });
        } catch (error) {
            console.error('Error adding district:', error);
        }
    };

    const handleDeleteDistrict = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/districts/${deleteDistrictId}`);
            console.log('Deleted district with ID:', deleteDistrictId);
            fetchDistricts(currentPage);
        } catch (error) {
            console.error('Error deleting district:', error);
        }
    };

    const handleUpdateDistrict = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedDistrict.name.trim() !== "") {
                updateData.name = updatedDistrict.name;
            }
            if (updatedDistrict.cityId) {
                updateData.city = { id: updatedDistrict.cityId };
            }
            const response = await axios.put(`http://localhost:8080/api/districts/${updateDistrictId}`, updateData);
            console.log('Updated district:', response.data);
            fetchDistricts(currentPage);
            setUpdatedDistrict({ name: '', cityId: '' });
        } catch (error) {
            console.error('Error updating district:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления района */}
            <div className="column">
                <h2>Добавить район</h2>
                <form onSubmit={handleAddDistrict}>
                    <div className="form-group">
                        <label htmlFor="districtName">Название района:</label>
                        <input
                            type="text"
                            id="districtName"
                            value={newDistrict.name}
                            onChange={e => setNewDistrict({ ...newDistrict, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cityId">Город:</label>
                        <select
                            id="cityId"
                            value={newDistrict.cityId}
                            onChange={e => setNewDistrict({ ...newDistrict, cityId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите город</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления района */}
            <div className="column">
                <h2>Удалить район</h2>
                <form onSubmit={handleDeleteDistrict}>
                    <div className="form-group">
                        <label htmlFor="deleteDistrict">Выбрать район:</label>
                        <select
                            id="deleteDistrict"
                            value={deleteDistrictId}
                            onChange={e => setDeleteDistrictId(e.target.value)}
                        >
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления района */}
            <div className="column">
                <h2>Обновить район</h2>
                <form onSubmit={handleUpdateDistrict}>
                    <div className="form-group">
                        <label htmlFor="updateDistrict">Выбрать район:</label>
                        <select
                            id="updateDistrict"
                            value={updateDistrictId}
                            onChange={e => setUpdateDistrictId(e.target.value)}
                        >
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDistrictName">Новое название района:</label>
                        <input
                            type="text"
                            id="newDistrictName"
                            value={updatedDistrict.name}
                            onChange={e => setUpdatedDistrict({ ...updatedDistrict, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateCityId">Город:</label>
                        <select
                            id="updateCityId"
                            value={updatedDistrict.cityId}
                            onChange={e => setUpdatedDistrict({ ...updatedDistrict, cityId: e.target.value })}
                        >
                            <option value="" disabled>Выберите город</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом районов */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Город</th>
                        <th>Район</th>
                    </tr>
                    </thead>
                    <tbody>
                    {districts.map(district => (
                        <tr key={district.id}>
                            <td>{district.city.name}</td>
                            <td>{district.name}</td>
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

export default District;