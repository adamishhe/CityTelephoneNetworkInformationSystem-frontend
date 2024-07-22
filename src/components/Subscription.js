import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Subscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [phones, setPhones] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [newSubscription, setNewSubscription] = useState({ phoneId: '', subscriberId: '', apartment: '' });
    const [deleteSubscriptionId, setDeleteSubscriptionId] = useState('');
    const [updateSubscriptionId, setUpdateSubscriptionId] = useState('');
    const [updatedSubscription, setUpdatedSubscription] = useState({ phoneId: '', subscriberId: '', apartment: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchSubscriptions(currentPage);
        fetchPhones();
        fetchSubscribers();
    }, [currentPage]);

    const fetchPhones = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/phones');
            setPhones(result.data.content || []);
        } catch (error) {
            console.error('Error fetching phones:', error);
        }
    };

    const fetchSubscribers = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/subscribers');
            setSubscribers(result.data.content || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        }
    };

    const fetchSubscriptions = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/subscriptions?page=${page}&size=10`);
            console.log(result.data);  // Логируем данные для проверки
            setSubscriptions(result.data.content || []);
            setTotalPages(result.data.totalPages || 0);
            if (result.data.content.length > 0) {
                setDeleteSubscriptionId(result.data.content[0].id);
                setUpdateSubscriptionId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/subscriptions', {
                phone: { id: newSubscription.phoneId },
                subscriber: { id: newSubscription.subscriberId },
                apartment: newSubscription.apartment
            });
            fetchSubscriptions(currentPage);
            setNewSubscription({ phoneId: '', subscriberId: '', apartment: '' });
        } catch (error) {
            console.error('Error adding subscription:', error);
        }
    };

    const handleDeleteSubscription = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/subscriptions/${deleteSubscriptionId}`);
            fetchSubscriptions(currentPage);
        } catch (error) {
            console.error('Error deleting subscription:', error);
        }
    };

    const handleUpdateSubscription = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedSubscription.phoneId) {
                updateData.phone = { id: updatedSubscription.phoneId };
            }
            if (updatedSubscription.subscriberId) {
                updateData.subscriber = { id: updatedSubscription.subscriberId };
            }
            if (updatedSubscription.apartment !== '') {
                updateData.apartment = updatedSubscription.apartment;
            }
            await axios.put(`http://localhost:8080/api/subscriptions/${updateSubscriptionId}`, updateData);
            fetchSubscriptions(currentPage);
            setUpdatedSubscription({ phoneId: '', subscriberId: '', apartment: '' });
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <div className="column">
                <h2>Add Subscription</h2>
                <form onSubmit={handleAddSubscription}>
                    <div className="form-group">
                        <label htmlFor="phoneId">Phone:</label>
                        <select
                            id="phoneId"
                            value={newSubscription.phoneId}
                            onChange={e => setNewSubscription({ ...newSubscription, phoneId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Phone</option>
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>{phone.phoneNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subscriberId">Subscriber:</label>
                        <select
                            id="subscriberId"
                            value={newSubscription.subscriberId}
                            onChange={e => setNewSubscription({ ...newSubscription, subscriberId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Subscriber</option>
                            {subscribers.map(subscriber => (
                                <option key={subscriber.id} value={subscriber.id}>{subscriber.firstName} {subscriber.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="apartment">Apartment:</label>
                        <input
                            type="number"
                            id="apartment"
                            value={newSubscription.apartment}
                            onChange={e => setNewSubscription({ ...newSubscription, apartment: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Delete Subscription</h2>
                <form onSubmit={handleDeleteSubscription}>
                    <div className="form-group">
                        <label htmlFor="deleteSubscription">Select Subscription:</label>
                        <select
                            id="deleteSubscription"
                            value={deleteSubscriptionId}
                            onChange={e => setDeleteSubscriptionId(e.target.value)}
                        >
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
                <h2>Update Subscription</h2>
                <form onSubmit={handleUpdateSubscription}>
                    <div className="form-group">
                        <label htmlFor="updateSubscription">Select Subscription:</label>
                        <select
                            id="updateSubscription"
                            value={updateSubscriptionId}
                            onChange={e => setUpdateSubscriptionId(e.target.value)}
                        >
                            {subscriptions.map(subscription => (
                                <option key={subscription.id} value={subscription.id}>
                                    {subscription.phone.phoneNumber} - {subscription.subscriber.firstName} {subscription.subscriber.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPhoneId">New Phone:</label>
                        <select
                            id="newPhoneId"
                            value={updatedSubscription.phoneId}
                            onChange={e => setUpdatedSubscription({ ...updatedSubscription, phoneId: e.target.value })}
                        >
                            <option value="" disabled>Select Phone</option>
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>{phone.phoneNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newSubscriberId">New Subscriber:</label>
                        <select
                            id="newSubscriberId"
                            value={updatedSubscription.subscriberId}
                            onChange={e => setUpdatedSubscription({ ...updatedSubscription, subscriberId: e.target.value })}
                        >
                            <option value="" disabled>Select Subscriber</option>
                            {subscribers.map(subscriber => (
                                <option key={subscriber.id} value={subscriber.id}>{subscriber.firstName} {subscriber.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newApartment">New Apartment:</label>
                        <input
                            type="number"
                            id="newApartment"
                            value={updatedSubscription.apartment}
                            onChange={e => setUpdatedSubscription({ ...updatedSubscription, apartment: e.target.value })}
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
                        <th>Phone</th>
                        <th>Subscriber</th>
                        <th>Apartment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscriptions.map(subscription => (
                        <tr key={subscription.id}>
                            <td>{subscription.phone.phoneNumber}</td>
                            <td>{subscription.subscriber.firstName} {subscription.subscriber.lastName}</td>
                            <td>{subscription.apartment}</td>
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

export default Subscription;
