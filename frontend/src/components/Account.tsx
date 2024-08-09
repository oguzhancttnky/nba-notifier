import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import Navbar from './Navbar';

const Account: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [chatID, setChatID] = useState('');
    const userID = useSelector((state: RootState) => state.auth.userID);
    const [userEmail, setUserEmail] = useState('');
    const [userChatID, setUserChatID] = useState(0);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                });
                setUserEmail(response.data.email);
                setUserChatID(response.data.chat_id);
            } catch (err) {
                console.error('Get user data failed:', err);
            }
        }
        getUserData();
    }, [userID]);

    const handleUpdate = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/api/update/user/${userID}`, { email, password, chat_id: chatID }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            alert('Account settings updated successfully');
            window.location.reload();
        } catch (err) {
            console.error('Update failed:', err);
        }
    }

    return (
        <div className="mx-auto mt-5">
            <Navbar />
            <div>
                <h2 className="flex justify-center text-2xl font-bold">Account Settings</h2>
                <div className="flex flex-col items-center gap-4 p-4">
                    <div className="w-full max-w-xs">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="chatID"
                            type="text"
                            placeholder={userChatID === 0 ? 'Please enter Telegram Chat ID' : userChatID.toString()}
                            value={chatID}
                            onChange={(e) => setChatID(e.target.value)}
                        />
                    </div>
                    <div className="w-full max-w-xs">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder={userEmail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-full max-w-xs">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Account;
