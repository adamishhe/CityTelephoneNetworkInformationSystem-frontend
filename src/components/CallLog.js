import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CallLogComponent = () => {
    const [callLogs, setCallLogs] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [phones, setPhones] = useState([]);
    const [newCallLog, setNewCallLog] = useState({ initiator: '', callTime: '', recipientNo: '', recipientAtsAddressId: '', duration: 1 });
    const [updateCallLog, setUpdateCallLog] = useState({ initiator: '', callTime: '', recipientNo: '', recipientAtsAddressId: '', duration: 1 });
    const [deleteCallLog, setDeleteCallLog] = useState({ initiator: '', callTime: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCallLogs(currentPage);
        fetchAddresses();
        fetchPhones();
    }, [currentPage]);

    const fetchAddresses = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/addresses');
            setAddresses(result.data.content || []);
        } catch (error) {
            console.error('Ошибка при получении адресов:', error);
        }
    };

    const fetchPhones = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/phones');
            setPhones(result.data.content || []);
        } catch (error) {
            console.error('Ошибка при получении номеров телефонов:', error);
        }
    };

    const fetchCallLogs = async (page) => {
        try {
            const result = await axios.get(`http://localhost:8080/api/call-logs?page=${page}&size=10`);
            setCallLogs(result.data.content || []);
            setTotalPages(result.data.totalPages || 0);
        } catch (error) {
            console.error('Ошибка при получении логов звонков:', error);
        }
    };

    const convertToZonedDateTime = (localDateTime) => {
        return `${localDateTime}:00.000+07:00`; // Предполагается временная зона +07:00, измените при необходимости
    };

    const handleAddCallLog = async (e) => {
        e.preventDefault();
        try {
            const callTime = convertToZonedDateTime(newCallLog.callTime);
            const dataToSend = {
                id: {
                    initiator: newCallLog.initiator,
                    callTime: callTime
                },
                recipientNo: newCallLog.recipientNo,
                recipientAtsAddress: { id: newCallLog.recipientAtsAddressId },
                duration: newCallLog.duration
            };
            console.log('Данные для отправки:', JSON.stringify(dataToSend));

            await axios.post('http://localhost:8080/api/call-logs', dataToSend);
            fetchCallLogs(currentPage);
            setNewCallLog({ initiator: '', callTime: '', recipientNo: '', recipientAtsAddressId: '', duration: 1 });
        } catch (error) {
            console.error('Ошибка при добавлении лога звонка:', error);
        }
    };

    const handleUpdateCallLog = async (e) => {
        e.preventDefault();
        try {
            const callTime = convertToZonedDateTime(updateCallLog.callTime);
            const { initiator, recipientNo, recipientAtsAddressId, duration } = updateCallLog;
            await axios.put(`http://localhost:8080/api/call-logs/${initiator}/${callTime}`, {
                recipientNo, recipientAtsAddress: { id: recipientAtsAddressId }, duration
            });
            fetchCallLogs(currentPage);
            setUpdateCallLog({ initiator: '', callTime: '', recipientNo: '', recipientAtsAddressId: '', duration: 1 });
        } catch (error) {
            console.error('Ошибка при обновлении лога звонка:', error);
        }
    };

    const handleDeleteCallLog = async (e) => {
        e.preventDefault();
        try {
            const callTime = convertToZonedDateTime(deleteCallLog.callTime);
            const { initiator } = deleteCallLog;
            await axios.delete(`http://localhost:8080/api/call-logs/${initiator}/${callTime}`);
            fetchCallLogs(currentPage);
            setDeleteCallLog({ initiator: '', callTime: '' });
        } catch (error) {
            console.error('Ошибка при удалении лога звонка:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <div className="column">
                <h2>Добавить запись звонка</h2>
                <form onSubmit={handleAddCallLog}>
                    <div className="form-group">
                        <label htmlFor="initiator">Инициатор:</label>
                        <select
                            id="initiator"
                            value={newCallLog.initiator}
                            onChange={e => setNewCallLog({ ...newCallLog, initiator: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите инициатора</option>
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>{phone.phoneNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="callTime">Время звонка:</label>
                        <input
                            type="datetime-local"
                            id="callTime"
                            value={newCallLog.callTime}
                            onChange={e => setNewCallLog({ ...newCallLog, callTime: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipientNo">Получатель:</label>
                        <input
                            type="text"
                            id="recipientNo"
                            value={newCallLog.recipientNo}
                            onChange={e => setNewCallLog({ ...newCallLog, recipientNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipientAtsAddressId">Адрес ATS получателя:</label>
                        <select
                            id="recipientAtsAddressId"
                            value={newCallLog.recipientAtsAddressId}
                            onChange={e => setNewCallLog({ ...newCallLog, recipientAtsAddressId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите адрес</option>
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>{address.street.name} - {address.houseNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Продолжительность:</label>
                        <input
                            type="number"
                            id="duration"
                            value={newCallLog.duration}
                            onChange={e => setNewCallLog({ ...newCallLog, duration: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Удалить запись звонка</h2>
                <form onSubmit={handleDeleteCallLog}>
                    <div className="form-group">
                        <label htmlFor="deleteInitiator">Инициатор:</label>
                        <select
                            id="deleteInitiator"
                            value={deleteCallLog.initiator}
                            onChange={e => setDeleteCallLog({ ...deleteCallLog, initiator: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите инициатора</option>
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>{phone.phoneNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="deleteCallTime">Время звонка:</label>
                        <input
                            type="datetime-local"
                            id="deleteCallTime"
                            value={deleteCallLog.callTime}
                            onChange={e => setDeleteCallLog({ ...deleteCallLog, callTime: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Удалить</button>
                    </div>
                </form>
            </div>

            <div className="column">
                <h2>Обновить запись звонка</h2>
                <form onSubmit={handleUpdateCallLog}>
                    <div className="form-group">
                        <label htmlFor="updateInitiator">Инициатор:</label>
                        <select
                            id="updateInitiator"
                            value={updateCallLog.initiator}
                            onChange={e => setUpdateCallLog({ ...updateCallLog, initiator: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите инициатора</option>
                            {phones.map(phone => (
                                <option key={phone.id} value={phone.id}>{phone.phoneNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateCallTime">Время звонка:</label>
                        <input
                            type="datetime-local"
                            id="updateCallTime"
                            value={updateCallLog.callTime}
                            onChange={e => setUpdateCallLog({ ...updateCallLog, callTime: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateRecipientNo">Получатель:</label>
                        <input
                            type="text"
                            id="updateRecipientNo"
                            value={updateCallLog.recipientNo}
                            onChange={e => setUpdateCallLog({ ...updateCallLog, recipientNo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateRecipientAtsAddressId">Адрес ATS получателя:</label>
                        <select
                            id="updateRecipientAtsAddressId"
                            value={updateCallLog.recipientAtsAddressId}
                            onChange={e => setUpdateCallLog({ ...updateCallLog, recipientAtsAddressId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Выберите адрес</option>
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>{address.street.name} - {address.houseNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="updateDuration">Продолжительность:</label>
                        <input
                            type="number"
                            id="updateDuration"
                            value={updateCallLog.duration}
                            onChange={e => setUpdateCallLog({ ...updateCallLog, duration: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Обновить</button>
                    </div>
                </form>
            </div>

            <div className="result">
                <table>
                    <thead>
                    <tr>
                        <th>Инициатор</th>
                        <th>Время звонка</th>
                        <th>Получатель</th>
                        <th>Адрес ATS получателя</th>
                        <th>Продолжительность</th>
                    </tr>
                    </thead>
                    <tbody>
                    {callLogs.map(callLog => (
                        <tr key={`${callLog.id.initiator}-${callLog.id.callTime}`}>
                            <td>{callLog.id.initiator}</td>
                            <td>{callLog.id.callTime}</td>
                            <td>{callLog.recipientNo}</td>
                            <td>{callLog.recipientAtsAddress.street.name} - {callLog.recipientAtsAddress.houseNumber}</td>
                            <td>{callLog.duration}</td>
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

export default CallLogComponent;
