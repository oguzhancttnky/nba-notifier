import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import Navbar from './Navbar';
import TelegramIcon from '../assets/icons/telegram-icon.svg'
import EmailIcon from '../assets/icons/email-icon.svg'
import PasswordIcon from '../assets/icons/password-icon.svg'
import { toast } from "react-toastify";
import Spinner from './Spinner';

const Account: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [chatID, setChatID] = useState('');
    const userID = useSelector((state: RootState) => state.auth.userID);
    const [userEmail, setUserEmail] = useState('');
    const [userChatID, setUserChatID] = useState(0);
    const [loading, setLoading] = useState(false);

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

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        toast.dismiss();
        setLoading(true);
        try {
            if (email === '' && password === '' && chatID === '') {
                toast.error("Please enter field you want to change");
                setLoading(false);
                return;
            }
            if (email === userEmail && chatID === userChatID.toString()) {
                toast.error("Please enter new email and chat ID");
                setLoading(false);
                return;
            }
            if (email === userEmail) {
                toast.error("Please enter a new email");
                setLoading(false);
                return;
            }
            if (chatID === userChatID.toString()) {
                toast.error("Please enter a new chat ID");
                setLoading(false);
                return;
            }
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/api/update/user/${userID}`, { email, password, chat_id: chatID }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setLoading(false);
            toast.success("Account updated successfully");
        } catch (err: any) {
            console.error('Update failed:', err);
            setLoading(false);
            toast.error("Update failed " + err.response.data.error);
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
                                    <img src={TelegramIcon.toString()} alt="Telegram Icon" className="w-6 h-6" />
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
                                    <img src={EmailIcon.toString()} alt="Email Icon" className="w-6 h-6" />
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
                                <span className="absolute left-0 flex items-center pl-3">
                                    <img src={PasswordIcon.toString()} alt="Password Icon" className="w-6 h-6" />
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
                            <button type='submit' className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center">
                                Save Changes
                                {loading && (
                                    <Spinner />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Account;
