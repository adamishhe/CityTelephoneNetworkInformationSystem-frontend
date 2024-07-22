import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Subscriber = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [newSubscriber, setNewSubscriber] = useState({ firstName: '', lastName: '', surname: '', gender: '', age: '', benefit: '' });
    const [deleteSubscriberId, setDeleteSubscriberId] = useState('');
    const [updateSubscriberId, setUpdateSubscriberId] = useState('');
    const [updatedSubscriber, setUpdatedSubscriber] = useState({ firstName: '', lastName: '', surname: '', gender: '', age: '', benefit: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchSubscribers(currentPage);
    }, [currentPage]);

    const fetchSubscribers = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/subscribers?page=${page}&size=10`);
            console.log('Fetched subscribers:', result.data);
            setSubscribers(result.data.content);
            setTotalPages(result.data.totalPages);
            if (result.data.content.length > 0) {
                setDeleteSubscriberId(result.data.content[0].id);
                setUpdateSubscriberId(result.data.content[0].id);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        }
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/subscribers', {
                ...newSubscriber,
                benefit: parseFloat(newSubscriber.benefit)
            });
            console.log('Added subscriber:', response.data);
            fetchSubscribers(currentPage);
            setNewSubscriber({ firstName: '', lastName: '', surname: '', gender: '', age: '', benefit: '' });
        } catch (error) {
            console.error('Error adding subscriber:', error);
        }
    };

    const handleDeleteSubscriber = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/subscribers/${deleteSubscriberId}`);
            console.log('Deleted subscriber with ID:', deleteSubscriberId);
            fetchSubscribers(currentPage);
        } catch (error) {
            console.error('Error deleting subscriber:', error);
        }
    };

    const handleUpdateSubscriber = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (updatedSubscriber.firstName.trim() !== "") {
                updateData.firstName = updatedSubscriber.firstName;
            }
            if (updatedSubscriber.lastName.trim() !== "") {
                updateData.lastName = updatedSubscriber.lastName;
            }
            if (updatedSubscriber.surname !== "") {
                updateData.surname = updatedSubscriber.surname;
            }
            if (updatedSubscriber.gender !== "") {
                updateData.gender = updatedSubscriber.gender;
            }
            if (updatedSubscriber.age !== "") {
                updateData.age = updatedSubscriber.age;
            }
            if (updatedSubscriber.benefit !== "") {
                updateData.benefit = parseFloat(updatedSubscriber.benefit);
            }
            const response = await axios.put(`http://localhost:8080/api/subscribers/${updateSubscriberId}`, updateData);
            console.log('Updated subscriber:', response.data);
            fetchSubscribers(currentPage);
            setUpdatedSubscriber({ firstName: '', lastName: '', surname: '', gender: '', age: '', benefit: '' });
        } catch (error) {
            console.error('Error updating subscriber:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Левая колонка с формой для добавления абонента */}
            <div className="column">
                <h2>Добавить абонента</h2>
                <form onSubmit={handleAddSubscriber}>
                    <div className="form-group">
                        <label htmlFor="firstName">Имя:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={newSubscriber.firstName}
                            onChange={e => setNewSubscriber({ ...newSubscriber, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Фамилия:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={newSubscriber.lastName}
                            onChange={e => setNewSubscriber({ ...newSubscriber, lastName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Отчество:</label>
                        <input
                            type="text"
                            id="surname"
                            value={newSubscriber.surname}
                            onChange={e => setNewSubscriber({ ...newSubscriber, surname: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Пол:</label>
                        <input
                            type="text"
                            id="gender"
                            value={newSubscriber.gender}
                            onChange={e => setNewSubscriber({ ...newSubscriber, gender: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Возраст:</label>
                        <input
                            type="number"
                            id="age"
                            value={newSubscriber.age}
                            onChange={e => setNewSubscriber({ ...newSubscriber, age: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="benefit">Льгота:</label>
                        <input
                            type="number"
                            step="0.1"
                            id="benefit"
                            value={newSubscriber.benefit}
                            onChange={e => setNewSubscriber({ ...newSubscriber, benefit: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            {/* Средняя колонка с формой для удаления абонента */}
            <div className="column">
                <h2>Удалить абонента</h2>
                <form onSubmit={handleDeleteSubscriber}>
                    <div className="form-group">
                        <label htmlFor="deleteSubscriber">Выбрать абонента:</label>
                        <select
                            id="deleteSubscriber"
                            value={deleteSubscriberId}
                            onChange={e => setDeleteSubscriberId(e.target.value)}
                        >
                            {subscribers.map(subscriber => (
                                <option key={subscriber.id} value={subscriber.id}>
                                    {subscriber.firstName} {subscriber.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            {/* Правая колонка с формой для обновления абонента */}
            <div className="column">
                <h2>Обновить абонента</h2>
                <form onSubmit={handleUpdateSubscriber}>
                    <div className="form-group">
                        <label htmlFor="updateSubscriber">Выбрать абонента:</label>
                        <select
                            id="updateSubscriber"
                            value={updateSubscriberId}
                            onChange={e => setUpdateSubscriberId(e.target.value)}
                        >
                            {subscribers.map(subscriber => (
                                <option key={subscriber.id} value={subscriber.id}>
                                    {subscriber.firstName} {subscriber.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newFirstName">Новое имя:</label>
                        <input
                            type="text"
                            id="newFirstName"
                            value={updatedSubscriber.firstName}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, firstName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newLastName">Новая фамилия:</label>
                        <input
                            type="text"
                            id="newLastName"
                            value={updatedSubscriber.lastName}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, lastName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newSurname">Новое отчество:</label>
                        <input
                            type="text"
                            id="newSurname"
                            value={updatedSubscriber.surname}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, surname: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newGender">Пол:</label>
                        <input
                            type="text"
                            id="newGender"
                            value={updatedSubscriber.gender}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, gender: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAge">Возраст:</label>
                        <input
                            type="number"
                            id="newAge"
                            value={updatedSubscriber.age}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, age: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newBenefit">Новая льгота:</label>
                        <input
                            type="number"
                            step="0.1"
                            id="newBenefit"
                            value={updatedSubscriber.benefit}
                            onChange={e => setUpdatedSubscriber({ ...updatedSubscriber, benefit: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            {/* Таблица с выводом абонентов */}
            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                        <th>Пол</th>
                        <th>Возраст</th>
                        <th>Льгота</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscribers.map(subscriber => (
                        <tr key={subscriber.id}>
                            <td>{subscriber.firstName}</td>
                            <td>{subscriber.lastName}</td>
                            <td>{subscriber.surname}</td>
                            <td>{subscriber.gender}</td>
                            <td>{subscriber.age}</td>
                            <td>{subscriber.benefit.toFixed(1)}</td>
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

export default Subscriber;
