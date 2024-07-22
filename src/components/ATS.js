import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ATS = () => {
    const [atsList, setAtsList] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [newAts, setNewAts] = useState({ serialNo: '', firstPhoneNo: '', lastPhoneNo: '', orgId: '', type: '' });
    const [deleteAtsId, setDeleteAtsId] = useState('');
    const [updateAtsId, setUpdateAtsId] = useState('');
    const [updatedAts, setUpdatedAts] = useState({ serialNo: '', firstPhoneNo: '', lastPhoneNo: '', orgId: '', type: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAts(currentPage);
        fetchOrganizations();
    }, [currentPage]);

    const fetchOrganizations = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/organizations');
            setOrganizations(result.data.content || []);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const fetchAts = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/ats?page=${page}&size=10`);
            setAtsList(result.data.content || []);
            setTotalPages(result.data.totalPages || 0);
            if (result.data.content.length > 0) {
                setDeleteAtsId(result.data.content[0].id);
                setUpdateAtsId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching ATS:', error);
        }
    };

    const handleAddAts = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/ats', {
                ...newAts,
                organization: { id: newAts.orgId }
            });
            fetchAts(currentPage);
            setNewAts({ serialNo: '', firstPhoneNo: '', lastPhoneNo: '', orgId: '', type: '' });
        } catch (error) {
            console.error('Error adding ATS:', error);
        }
    };

    const handleDeleteAts = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/ats/${deleteAtsId}`);
            fetchAts(currentPage);
        } catch (error) {
            console.error('Error deleting ATS:', error);
        }
    };

    const handleUpdateAts = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedAts.serialNo.trim() !== "") {
                updateData.serialNo = updatedAts.serialNo;
            }
            if (updatedAts.firstPhoneNo.trim() !== "") {
                updateData.firstPhoneNo = updatedAts.firstPhoneNo;
            }
            if (updatedAts.lastPhoneNo.trim() !== "") {
                updateData.lastPhoneNo = updatedAts.lastPhoneNo;
            }
            if (updatedAts.orgId) {
                updateData.organization = { id: updatedAts.orgId };
            }
            if (updatedAts.type) {
                updateData.type = updatedAts.type;
            }
            const response = await axios.put(`http://localhost:8080/api/ats/${updateAtsId}`, updateData);
            fetchAts(currentPage);
            setUpdatedAts({ serialNo: '', firstPhoneNo: '', lastPhoneNo: '', orgId: '', type: '' });
        } catch (error) {
            console.error('Error updating ATS:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className="container">
            <div className="column">
                <h2>Add ATS</h2>
                <form onSubmit={handleAddAts}>
                    <div className="form-group">
                        <label htmlFor="serialNo">Serial No:</label>
                        <input
                            type="text"
                            id="serialNo"
                            value={newAts.serialNo}
                            onChange={e => setNewAts({ ...newAts, serialNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstPhoneNo">First Phone No:</label>
                        <input
                            type="text"
                            id="firstPhoneNo"
                            value={newAts.firstPhoneNo}
                            onChange={e => setNewAts({ ...newAts, firstPhoneNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastPhoneNo">Last Phone No:</label>
                        <input
                            type="text"
                            id="lastPhoneNo"
                            value={newAts.lastPhoneNo}
                            onChange={e => setNewAts({ ...newAts, lastPhoneNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="orgId">Organization:</label>
                        <select
                            id="orgId"
                            value={newAts.orgId}
                            onChange={e => setNewAts({ ...newAts, orgId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Organization</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <select
                            id="type"
                            value={newAts.type}
                            onChange={e => setNewAts({ ...newAts, type: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Type</option>
                            <option value="CITY">CITY</option>
                            <option value="DEPARTMENT">DEPARTMENT</option>
                            <option value="INSTITUTION">INSTITUTION</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Delete ATS</h2>
                <form onSubmit={handleDeleteAts}>
                    <div className="form-group">
                        <label htmlFor="deleteAts">Select ATS:</label>
                        <select
                            id="deleteAts"
                            value={deleteAtsId}
                            onChange={e => setDeleteAtsId(e.target.value)}
                        >
                            {atsList.map(ats => (
                                <option key={ats.id} value={ats.id}>
                                    {ats.serialNo}
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
                <h2>Update ATS</h2>
                <form onSubmit={handleUpdateAts}>
                    <div className="form-group">
                        <label htmlFor="updateAts">Select ATS:</label>
                        <select
                            id="updateAts"
                            value={updateAtsId}
                            onChange={e => setUpdateAtsId(e.target.value)}
                        >
                            {atsList.map(ats => (
                                <option key={ats.id} value={ats.id}>
                                    {ats.serialNo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newSerialNo">New Serial No:</label>
                        <input
                            type="text"
                            id="newSerialNo"
                            value={updatedAts.serialNo}
                            onChange={e => setUpdatedAts({ ...updatedAts, serialNo: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newFirstPhoneNo">New First Phone No:</label>
                        <input
                            type="text"
                            id="newFirstPhoneNo"
                            value={updatedAts.firstPhoneNo}
                            onChange={e => setUpdatedAts({ ...updatedAts, firstPhoneNo: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newLastPhoneNo">New Last Phone No:</label>
                        <input
                            type="text"
                            id="newLastPhoneNo"
                            value={updatedAts.lastPhoneNo}
                            onChange={e => setUpdatedAts({ ...updatedAts, lastPhoneNo: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateOrgId">Organization:</label>
                        <select
                            id="updateOrgId"
                            value={updatedAts.orgId}
                            onChange={e => setUpdatedAts({ ...updatedAts, orgId: e.target.value })}
                        >
                            <option value="" disabled>Select Organization</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateType">Type:</label>
                        <select
                            id="updateType"
                            value={updatedAts.type}
                            onChange={e => setUpdatedAts({ ...updatedAts, type: e.target.value })}
                        >
                            <option value="" disabled>Select Type</option>
                            <option value="CITY">CITY</option>
                            <option value="DEPARTMENT">DEPARTMENT</option>
                            <option value="INSTITUTION">INSTITUTION</option>
                        </select>
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
                        <th>Serial No</th>
                        <th>First Phone No</th>
                        <th>Last Phone No</th>
                        <th>Organization</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {atsList.map(ats => (
                        <tr key={ats.id}>
                            <td>{ats.serialNo}</td>
                            <td>{ats.firstPhoneNo}</td>
                            <td>{ats.lastPhoneNo}</td>
                            <td>{ats.organization.name}</td>
                            <td>{ats.type}</td>
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

export default ATS;
