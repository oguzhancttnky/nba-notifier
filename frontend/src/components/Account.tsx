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
            <section>
                <div className='flex items-center justify-center my-8'>
                    <span className="text-gray-900 text-3xl font-semibold">Account Settings</span>
                </div>
                <div className="container flex items-center justify-center my-16 px-6 mx-auto">
                    <form onSubmit={handleUpdate} className="w-full max-w-md">
                        <div className="relative">
                            <div className="flex items-center">
                                <span className="absolute left-0 flex items-center pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    className="
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder={userChatID === 0 ? 'Please enter Telegram Chat ID' : userChatID.toString()}
                                    value={chatID}
                                    onChange={(e) => setChatID(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="relative mt-6">
                            <div className="flex items-center">
                                <span className="absolute left-0 flex items-center pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    className="
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder={userEmail}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="relative mt-6">
                            <div className="flex items-center">
                                <span className="absolute left-0 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    className="
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="mt-6">
                            <button type='submit' className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Account;
