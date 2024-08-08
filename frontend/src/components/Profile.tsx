import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';
import Navbar from './Navbar';

const Profile: React.FC = () => {
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);
    const [chatID, setChatID] = useState('');
    const userid = useSelector((state: RootState) => state.auth.userid);
    const dispatch = useDispatch();

    const handleUnsubscribe = async (team: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/unsubscribe`, { userid, team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(unsubscribe(team));
        } catch (err) {
            console.error('Unsubscription failed:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5">
            <Navbar />
            <div>
                <h2 className="text-2xl font-bold">Subscribed NBA Teams</h2>
                <div className="mt-3">
                    {subscriptions.map((team, index) => (
                        <div key={index} className="flex justify-between items-center border-b py-2">
                            <div>{team}</div>
                            <button onClick={() => handleUnsubscribe(team)} className="px-3 py-1 bg-red-500 text-white">Unsubscribe</button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold mt-5">Chat ID</h2>
                <div className="mt-3">
                    <input type="text" value={chatID} onChange={(e) => setChatID(e.target.value)} className="border border-gray-300 px-3 py-1" />
                    <button className="px-3 py-1 bg-green-500 text-white ml-2">Set Chat ID</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
