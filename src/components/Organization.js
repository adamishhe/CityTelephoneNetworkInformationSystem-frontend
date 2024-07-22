import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Organization = () => {
    const [organizations, setOrganizations] = useState([]);
    const [newOrganization, setNewOrganization] = useState({ name: '' });
    const [deleteOrganizationId, setDeleteOrganizationId] = useState('');
    const [updateOrganizationId, setUpdateOrganizationId] = useState('');
    const [updatedOrganization, setUpdatedOrganization] = useState({ name: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchOrganizations(currentPage);
    }, [currentPage]);

    const fetchOrganizations = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/organizations?page=${page}&size=10`);
            console.log('Fetched organizations:', result.data);
            setOrganizations(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteOrganizationId(result.data.content[0].id);
                setUpdateOrganizationId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const handleAddOrganization = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/organizations', newOrganization);
            console.log('Added organization:', response.data);
            fetchOrganizations(currentPage);
            setNewOrganization({ name: '' });
        } catch (error) {
            console.error('Error adding organization:', error);
        }
    };

    const handleDeleteOrganization = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/organizations/${deleteOrganizationId}`);
            console.log('Deleted organization with ID:', deleteOrganizationId);
            fetchOrganizations(currentPage);
        } catch (error) {
            console.error('Error deleting organization:', error);
        }
    };

    const handleUpdateOrganization = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedOrganization.name.trim() !== "") {
                updateData.name = updatedOrganization.name;
            }
            const response = await axios.put(`http://localhost:8080/api/organizations/${updateOrganizationId}`, updateData);
            console.log('Updated organization:', response.data);
            fetchOrganizations(currentPage);
            setUpdatedOrganization({ name: '' });
        } catch (error) {
            console.error('Error updating organization:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления организации */}
            <div className="column">
                <h2>Добавить организацию</h2>
                <form onSubmit={handleAddOrganization}>
                    <div className="form-group">
                        <label htmlFor="orgName">Название организации:</label>
                        <input
                            type="text"
                            id="orgName"
                            value={newOrganization.name}
                            onChange={e => setNewOrganization({ name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления организации */}
            <div className="column">
                <h2>Удалить организацию</h2>
                <form onSubmit={handleDeleteOrganization}>
                    <div className="form-group">
                        <label htmlFor="deleteOrganization">Выбрать организацию:</label>
                        <select
                            id="deleteOrganization"
                            value={deleteOrganizationId}
                            onChange={e => setDeleteOrganizationId(e.target.value)}
                        >
                            {organizations.map(organization => (
                                <option key={organization.id} value={organization.id}>
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления организации */}
            <div className="column">
                <h2>Обновить организацию</h2>
                <form onSubmit={handleUpdateOrganization}>
                    <div className="form-group">
                        <label htmlFor="updateOrganization">Выбрать организацию:</label>
                        <select
                            id="updateOrganization"
                            value={updateOrganizationId}
                            onChange={e => setUpdateOrganizationId(e.target.value)}
                        >
                            {organizations.map(organization => (
                                <option key={organization.id} value={organization.id}>
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newOrgName">Новое название организации:</label>
                        <input
                            type="text"
                            id="newOrgName"
                            value={updatedOrganization.name}
                            onChange={e => setUpdatedOrganization({ name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом организаций */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Организация</th>
                    </tr>
                    </thead>
                    <tbody>
                    {organizations.map(organization => (
                        <tr key={organization.id}>
                            <td>{organization.name}</td>
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

export default Organization;
