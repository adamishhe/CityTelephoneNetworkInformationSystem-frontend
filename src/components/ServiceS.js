import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceS = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: '', cost: '' });
    const [deleteServiceId, setDeleteServiceId] = useState('');
    const [updateServiceId, setUpdateServiceId] = useState('');
    const [updatedService, setUpdatedService] = useState({ name: '', cost: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchServices(currentPage);
    }, [currentPage]);

    const fetchServices = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/services?page=${page}&size=10`);
            console.log('Fetched services:', result.data);
            setServices(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteServiceId(result.data.content[0].id);
                setUpdateServiceId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/services', newService);
            console.log('Added service:', response.data);
            fetchServices(currentPage);
            setNewService({ name: '', cost: '' });
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const handleDeleteService = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/services/${deleteServiceId}`);
            console.log('Deleted service with ID:', deleteServiceId);
            fetchServices(currentPage);
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedService.name.trim() !== "") {
                updateData.name = updatedService.name;
            }
            if (updatedService.cost !== "") {
                updateData.cost = updatedService.cost;
            }
            const response = await axios.put(`http://localhost:8080/api/services/${updateServiceId}`, updateData);
            console.log('Updated service:', response.data);
            fetchServices(currentPage);
            setUpdatedService({ name: '', cost: '' });
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления услуги */}
            <div className="column">
                <h2>Добавить услугу</h2>
                <form onSubmit={handleAddService}>
                    <div className="form-group">
                        <label htmlFor="serviceName">Название услуги:</label>
                        <input
                            type="text"
                            id="serviceName"
                            value={newService.name}
                            onChange={e => setNewService({ ...newService, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="serviceCost">Стоимость услуги:</label>
                        <input
                            type="number"
                            id="serviceCost"
                            value={newService.cost}
                            onChange={e => setNewService({ ...newService, cost: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления услуги */}
            <div className="column">
                <h2>Удалить услугу</h2>
                <form onSubmit={handleDeleteService}>
                    <div className="form-group">
                        <label htmlFor="deleteService">Выбрать услугу:</label>
                        <select
                            id="deleteService"
                            value={deleteServiceId}
                            onChange={e => setDeleteServiceId(e.target.value)}
                        >
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления услуги */}
            <div className="column">
                <h2>Обновить услугу</h2>
                <form onSubmit={handleUpdateService}>
                    <div className="form-group">
                        <label htmlFor="updateService">Выбрать услугу:</label>
                        <select
                            id="updateService"
                            value={updateServiceId}
                            onChange={e => setUpdateServiceId(e.target.value)}
                        >
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newServiceName">Новое название услуги:</label>
                        <input
                            type="text"
                            id="newServiceName"
                            value={updatedService.name}
                            onChange={e => setUpdatedService({ ...updatedService, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newServiceCost">Новая стоимость услуги:</label>
                        <input
                            type="number"
                            id="newServiceCost"
                            value={updatedService.cost}
                            onChange={e => setUpdatedService({ ...updatedService, cost: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом услуг */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Название услуги</th>
                        <th>Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map(service => (
                        <tr key={service.id}>
                            <td>{service.name}</td>
                            <td>{service.cost}</td>
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

export default ServiceS;
