import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [streets, setStreets] = useState([]);
    const [newAddress, setNewAddress] = useState({ houseNumber: '', streetId: '' });
    const [deleteAddressId, setDeleteAddressId] = useState('');
    const [updateAddressId, setUpdateAddressId] = useState('');
    const [updatedAddress, setUpdatedAddress] = useState({ houseNumber: '', streetId: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAddresses(currentPage);
        fetchStreets();
    }, [currentPage]);

    const fetchStreets = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/streets');
            setStreets(result.data.content);
        } catch (error) {
            console.error('Error fetching streets:', error);
        }
    };

    const fetchAddresses = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/addresses?page=${page}&size=10`);
            console.log('Fetched addresses:', result.data);
            setAddresses(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteAddressId(result.data.content[0].id);
                setUpdateAddressId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/addresses', {
                ...newAddress,
                street: { id: newAddress.streetId }
            });
            console.log('Added address:', response.data);
            fetchAddresses(currentPage);
            setNewAddress({ houseNumber: '', streetId: '' });
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleDeleteAddress = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/addresses/${deleteAddressId}`);
            console.log('Deleted address with ID:', deleteAddressId);
            fetchAddresses(currentPage);
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedAddress.houseNumber.trim() !== "") {
                updateData.houseNumber = updatedAddress.houseNumber;
            }
            if (updatedAddress.streetId) {
                updateData.street = { id: updatedAddress.streetId };
            }
            const response = await axios.put(`http://localhost:8080/api/addresses/${updateAddressId}`, updateData);
            console.log('Updated address:', response.data);
            fetchAddresses(currentPage);
            setUpdatedAddress({ houseNumber: '', streetId: '' });
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления адреса */}
            <div className="column">
                <h2>Добавить адрес</h2>
                <form onSubmit={handleAddAddress}>
                    <div className="form-group">
                        <label htmlFor="houseNumber">Номер дома:</label>
                        <input
                            type="number"
                            id="houseNumber"
                            value={newAddress.houseNumber}
                            onChange={e => setNewAddress({ ...newAddress, houseNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="streetId">Улица:</label>
                        <select
                            id="streetId"
                            value={newAddress.streetId}
                            onChange={e => setNewAddress({ ...newAddress, streetId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите улицу</option>
                            {streets.map(street => (
                                <option key={street.id} value={street.id}>{street.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления адреса */}
            <div className="column">
                <h2>Удалить адрес</h2>
                <form onSubmit={handleDeleteAddress}>
                    <div className="form-group">
                        <label htmlFor="deleteAddress">Выбрать адрес:</label>
                        <select
                            id="deleteAddress"
                            value={deleteAddressId}
                            onChange={e => setDeleteAddressId(e.target.value)}
                        >
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>
                                    {address.street.name} №{address.houseNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления адреса */}
            <div className="column">
                <h2>Обновить адрес</h2>
                <form onSubmit={handleUpdateAddress}>
                    <div className="form-group">
                        <label htmlFor="updateAddress">Выбрать адрес:</label>
                        <select
                            id="updateAddress"
                            value={updateAddressId}
                            onChange={e => setUpdateAddressId(e.target.value)}
                        >
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>
                                    {address.street.name} №{address.houseNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newHouseNumber">Новый номер дома:</label>
                        <input
                            type="number"
                            id="newHouseNumber"
                            value={updatedAddress.houseNumber}
                            onChange={e => setUpdatedAddress({ ...updatedAddress, houseNumber: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateStreetId">Улица:</label>
                        <select
                            id="updateStreetId"
                            value={updatedAddress.streetId}
                            onChange={e => setUpdatedAddress({ ...updatedAddress, streetId: e.target.value })}
                        >
                            <option value="" disabled>Выберите улицу</option>
                            {streets.map(street => (
                                <option key={street.id} value={street.id}>{street.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом адресов */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Город</th>
                        <th>Район</th>
                        <th>Улица</th>
                        <th>Номер дома</th>
                    </tr>
                    </thead>
                    <tbody>
                    {addresses.map(address => (
                        <tr key={address.id}>
                            <td>{address.street.district.city.name}</td>
                            <td>{address.street.district.name}</td>
                            <td>{address.street.name}</td>
                            <td>{address.houseNumber}</td>
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

export default Address;
