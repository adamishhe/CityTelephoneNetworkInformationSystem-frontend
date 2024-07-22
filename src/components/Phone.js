import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Phone = () => {
    const [phones, setPhones] = useState([]);
    const [atsList, setAtsList] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [newPhone, setNewPhone] = useState({ atsId: '', type: '', addressId: '', phoneNumber: '', isPayphone: false });
    const [deletePhoneId, setDeletePhoneId] = useState('');
    const [updatePhoneId, setUpdatePhoneId] = useState('');
    const [updatedPhone, setUpdatedPhone] = useState({ atsId: '', type: '', addressId: '', phoneNumber: '', isPayphone: false });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const phoneTypes = ["PAIRED", "COMMON", "PARALLEL", "PAYPHONE"];

    useEffect(() => {
        fetchPhones(currentPage);
        fetchAtsList();
        fetchAddresses();
    }, [currentPage]);

    const fetchAtsList = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/ats');
            setAtsList(result.data.content || []);
        } catch (error) {
            console.error('Error fetching ATS list:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/addresses');
            setAddresses(result.data.content || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchPhones = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/phones?page=${page}&size=10`);
            setPhones(result.data.content || []);
            setTotalPages(result.data.totalPages || 0);
            if (result.data.content.length > 0) {
                setDeletePhoneId(result.data.content[0].id);
                setUpdatePhoneId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching phones:', error);
        }
    };

    const handleAddPhone = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/phones', {
                ats: { id: newPhone.atsId },
                type: newPhone.type,
                address: { id: newPhone.addressId },
                phoneNumber: newPhone.phoneNumber
            });
            fetchPhones(currentPage);
            setNewPhone({ atsId: '', type: '', addressId: '', phoneNumber: '' });
        } catch (error) {
            console.error('Error adding phone:', error);
        }
    };

    const handleDeletePhone = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/phones/${deletePhoneId}`);
            fetchPhones(currentPage);
        } catch (error) {
            console.error('Error deleting phone:', error);
        }
    };

    const handleUpdatePhone = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedPhone.atsId) {
                updateData.ats = { id: updatedPhone.atsId };
            }
            if (updatedPhone.type) {
                updateData.type = updatedPhone.type;
            }
            if (updatedPhone.addressId) {
                updateData.address = { id: updatedPhone.addressId };
            }
            if (updatedPhone.phoneNumber) {
                updateData.phoneNumber = updatedPhone.phoneNumber;
            }
            await axios.put(`http://localhost:8080/api/phones/${updatePhoneId}`, updateData);
            fetchPhones(currentPage);
            setUpdatedPhone({ atsId: '', type: '', addressId: '', phoneNumber: '' });
        } catch (error) {
            console.error('Error updating phone:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <div className="column">
                <h2>Add Phone</h2>
                <form onSubmit={handleAddPhone}>
                    <div className="form-group">
                        <label htmlFor="atsId">ATS:</label>
                        <select
                            id="atsId"
                            value={newPhone.atsId}
                            onChange={e => setNewPhone({ ...newPhone, atsId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select ATS</option>
                            {atsList.map(ats => (
                                <option key={ats.id} value={ats.id}>{ats.serialNo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <select
                            id="type"
                            value={newPhone.type}
                            onChange={e => setNewPhone({ ...newPhone, type: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Type</option>
                            {phoneTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressId">Address:</label>
                        <select
                            id="addressId"
                            value={newPhone.addressId}
                            onChange={e => setNewPhone({ ...newPhone, addressId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Address</option>
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>
                                    {`${address.street.district.city.name}, ${address.street.district.name}, ${address.street.name}, ${address.houseNumber}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={newPhone.phoneNumber}
                            onChange={e => setNewPhone({ ...newPhone, phoneNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Delete Phone</h2>
                <form onSubmit={handleDeletePhone}>
                    <div className="form-group">
                        <label htmlFor="deletePhone">Select Phone:</label>
                        <select
                            id="deletePhone"
                            value={deletePhoneId}
                            onChange={e => setDeletePhoneId(e.target.value)}
                        >
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>
                                    {phone.phoneNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Delete</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Update Phone</h2>
                <form onSubmit={handleUpdatePhone}>
                    <div className="form-group">
                        <label htmlFor="updatePhone">Select Phone:</label>
                        <select
                            id="updatePhone"
                            value={updatePhoneId}
                            onChange={e => setUpdatePhoneId(e.target.value)}
                        >
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>
                                    {phone.phoneNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAtsId">New ATS:</label>
                        <select
                            id="newAtsId"
                            value={updatedPhone.atsId}
                            onChange={e => setUpdatedPhone({ ...updatedPhone, atsId: e.target.value })}
                        >
                            <option value="" disabled>Select ATS</option>
                            {atsList.map(ats => (
                                <option key={ats.id} value={ats.id}>{ats.serialNo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newType">New Type:</label>
                        <select
                            id="newType"
                            value={updatedPhone.type}
                            onChange={e => setUpdatedPhone({ ...updatedPhone, type: e.target.value })}
                        >
                            <option value="" disabled>Select Type</option>
                            {phoneTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAddressId">New Address:</label>
                        <select
                            id="newAddressId"
                            value={updatedPhone.addressId}
                            onChange={e => setUpdatedPhone({ ...updatedPhone, addressId: e.target.value })}
                        >
                            <option value="" disabled>Select Address</option>
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>
                                    {`${address.street.district.city.name}, ${address.street.district.name}, ${address.street.name}, ${address.houseNumber}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPhoneNumber">New Phone Number:</label>
                        <input
                            type="text"
                            id="newPhoneNumber"
                            value={updatedPhone.phoneNumber}
                            onChange={e => setUpdatedPhone({ ...updatedPhone, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Update</button>
                    </div>
                </form>
            </div>

            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>ATS Serial No</th>
                        <th>Type</th>
                        <th>Address Street</th>
                        <th>House No</th>
                        <th>Phone Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {phones.map(phone => (
                        <tr key={phone.id}>
                            <td>{phone.ats.serialNo}</td>
                            <td>{phone.type}</td>
                            <td>{phone.address.street.name}</td>
                            <td>{phone.address.houseNumber}</td>
                            <td>{phone.phoneNumber}</td>
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

export default Phone;