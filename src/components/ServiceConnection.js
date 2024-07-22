import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceConnection = () => {
    const [serviceConnections, setServiceConnections] = useState([]);
    const [services, setServices] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [newServiceConnection, setNewServiceConnection] = useState({ serviceId: '', subscriptionId: '', paymentDate: '' });
    const [updateServiceConnection, setUpdateServiceConnection] = useState({ serviceId: '', subscriptionId: '', paymentDate: '' });
    const [deleteServiceConnection, setDeleteServiceConnection] = useState({ serviceId: '', subscriptionId: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchServiceConnections(currentPage);
        fetchServices();
        fetchSubscriptions();
    }, [currentPage]);

    const fetchServices = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/services');
            setServices(result.data.content || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/subscriptions');
            setSubscriptions(result.data.content || []);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    const fetchServiceConnections = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/service-connections?page=${page}&size=10`);
            setServiceConnections(result.data.content || []);
            setTotalPages(result.data.totalPages || 0);
        } catch (error) {
            console.error('Error fetching service connections:', error);
        }
    };

    const handleAddServiceConnection = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/service-connections', {
                id: {
                    serviceId: newServiceConnection.serviceId,
                    subscriptionId: newServiceConnection.subscriptionId
                },
                paymentDate: newServiceConnection.paymentDate
            });
            fetchServiceConnections(currentPage);
            setNewServiceConnection({ serviceId: '', subscriptionId: '', paymentDate: '' });
        } catch (error) {
            console.error('Error adding service connection:', error);
        }
    };

    const handleUpdateServiceConnection = async (e) => {
        e.preventDefault();
        try {
            const { serviceId, subscriptionId, paymentDate } = updateServiceConnection;
            await axios.put(`http://localhost:8080/api/service-connections/${serviceId}/${subscriptionId}`, { paymentDate });
            fetchServiceConnections(currentPage);
            setUpdateServiceConnection({ serviceId: '', subscriptionId: '', paymentDate: '' });
        } catch (error) {
            console.error('Error updating service connection:', error);
        }
    };

    const handleDeleteServiceConnection = async (e) => {
        e.preventDefault();
        try {
            const { serviceId, subscriptionId } = deleteServiceConnection;
            await axios.delete(`http://localhost:8080/api/service-connections/${serviceId}/${subscriptionId}`);
            fetchServiceConnections(currentPage);
            setDeleteServiceConnection({ serviceId: '', subscriptionId: '' });
        } catch (error) {
            console.error('Error deleting service connection:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <div className="column">
                <h2>Add Service Connection</h2>
                <form onSubmit={handleAddServiceConnection}>
                    <div className="form-group">
                        <label htmlFor="serviceId">Service:</label>
                        <select
                            id="serviceId"
                            value={newServiceConnection.serviceId}
                            onChange={e => setNewServiceConnection({ ...newServiceConnection, serviceId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subscriptionId">Subscription:</label>
                        <select
                            id="subscriptionId"
                            value={newServiceConnection.subscriptionId}
                            onChange={e => setNewServiceConnection({ ...newServiceConnection, subscriptionId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Subscription</option>
                            {subscriptions.map(subscription => (
                                <option key={subscription.id} value={subscription.id}>
                                    {subscription.phone.phoneNumber} - {subscription.subscriber.firstName} {subscription.subscriber.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentDate">Payment Date:</label>
                        <input
                            type="date"
                            id="paymentDate"
                            value={newServiceConnection.paymentDate}
                            onChange={e => setNewServiceConnection({ ...newServiceConnection, paymentDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Delete Service Connection</h2>
                <form onSubmit={handleDeleteServiceConnection}>
                    <div className="form-group">
                        <label htmlFor="deleteServiceId">Service:</label>
                        <select
                            id="deleteServiceId"
                            value={deleteServiceConnection.serviceId}
                            onChange={e => setDeleteServiceConnection({ ...deleteServiceConnection, serviceId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="deleteSubscriptionId">Subscription:</label>
                        <select
                            id="deleteSubscriptionId"
                            value={deleteServiceConnection.subscriptionId}
                            onChange={e => setDeleteServiceConnection({ ...deleteServiceConnection, subscriptionId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Subscription</option>
                            {subscriptions.map(subscription => (
                                <option key={subscription.id} value={subscription.id}>
                                    {subscription.phone.phoneNumber} - {subscription.subscriber.firstName} {subscription.subscriber.lastName}
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
                <h2>Update Service Connection</h2>
                <form onSubmit={handleUpdateServiceConnection}>
                    <div className="form-group">
                        <label htmlFor="updateServiceId">Service:</label>
                        <select
                            id="updateServiceId"
                            value={updateServiceConnection.serviceId}
                            onChange={e => setUpdateServiceConnection({ ...updateServiceConnection, serviceId: e.target.value })}
                        >
                            <option value="" disabled>Select Service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateSubscriptionId">Subscription:</label>
                        <select
                            id="updateSubscriptionId"
                            value={updateServiceConnection.subscriptionId}
                            onChange={e => setUpdateServiceConnection({ ...updateServiceConnection, subscriptionId: e.target.value })}
                        >
                            <option value="" disabled>Select Subscription</option>
                            {subscriptions.map(subscription => (
                                <option key={subscription.id} value={subscription.id}>
                                    {subscription.phone.phoneNumber} - {subscription.subscriber.firstName} {subscription.subscriber.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="updatePaymentDate">Payment Date:</label>
                        <input
                            type="date"
                            id="updatePaymentDate"
                            value={updateServiceConnection.paymentDate}
                            onChange={e => setUpdateServiceConnection({ ...updateServiceConnection, paymentDate: e.target.value })}
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
                        <th>Service</th>
                        <th>Subscription</th>
                        <th>Payment Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {serviceConnections.map(connection => (
                        <tr key={`${connection.id.serviceId}-${connection.id.subscriptionId}`}>
                            <td>{connection.id.serviceId}</td>
                            <td>{connection.id.subscriptionId}</td>
                            <td>{connection.paymentDate}</td>
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

export default ServiceConnection;
