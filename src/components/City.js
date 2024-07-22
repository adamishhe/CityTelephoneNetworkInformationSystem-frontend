import React, { useEffect, useState } from 'react';
import axios from 'axios';

const City = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState({ name: '' });
    const [deleteCityId, setDeleteCityId] = useState('');
    const [updateCityId, setUpdateCityId] = useState('');
    const [updatedCity, setUpdatedCity] = useState({ name: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCities(currentPage);
    }, [currentPage]);

    const fetchCities = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/cities?page=${page}&size=10`);
            console.log('Fetched cities:', result.data);
            setCities(result.data.content);
            setTotalPages(result.data.totalPages);
            // Инициализация значений по умолчанию для select
            if (result.data.content.length > 0) {
                setDeleteCityId(result.data.content[0].id);
                setUpdateCityId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleAddCity = async (e) => {
        e.preventDefault();
        console.log('Adding city:', newCity);
        try {
            const response = await axios.post('http://localhost:8080/api/cities', newCity);
            console.log('Added city:', response.data);
            fetchCities(currentPage);
            setNewCity({ name: '' });
        } catch (error) {
            console.error('Error adding city:', error);
        }
    };

    const handleDeleteCity = async (e) => {
        e.preventDefault();
        console.log('Deleting city with ID:', deleteCityId);
        try {
            await axios.delete(`http://localhost:8080/api/cities/${deleteCityId}`);
            console.log('Deleted city with ID:', deleteCityId);
            fetchCities(currentPage);
        } catch (error) {
            console.error('Error deleting city:', error);
        }
    };

    const handleUpdateCity = async (e) => {
        e.preventDefault();
        console.log('Updating city with ID:', updateCityId, 'to:', updatedCity);
        try {
            const response = await axios.put(`http://localhost:8080/api/cities/${updateCityId}`, updatedCity);
            console.log('Updated city:', response.data);
            fetchCities(currentPage);
            setUpdatedCity({ name: '' });
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления города */}
            <div className="column">
                <h2>Добавить город</h2>
                <form onSubmit={handleAddCity}>
                    <div className="form-group">
                        <label htmlFor="cityName">Название города:</label>
                        <input
                            type="text"
                            id="cityName"
                            value={newCity.name}
                            onChange={e => setNewCity({ name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления города */}
            <div className="column">
                <h2>Удалить город</h2>
                <form onSubmit={handleDeleteCity}>
                    <div className="form-group">
                        <label htmlFor="deleteCity">Выбрать город:</label>
                        <select
                            id="deleteCity"
                            value={deleteCityId}
                            onChange={e => setDeleteCityId(e.target.value)}
                        >
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления города */}
            <div className="column">
                <h2>Обновить город</h2>
                <form onSubmit={handleUpdateCity}>
                    <div className="form-group">
                        <label htmlFor="updateCity">Выбрать город:</label>
                        <select
                            id="updateCity"
                            value={updateCityId}
                            onChange={e => setUpdateCityId(e.target.value)}
                        >
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newCityName">Новое название города:</label>
                        <input
                            type="text"
                            id="newCityName"
                            value={updatedCity.name}
                            onChange={e => setUpdatedCity({ name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом городов */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Город</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cities.map(city => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
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

export default City;
