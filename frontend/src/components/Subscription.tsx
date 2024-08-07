import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';

const teams = ["Lakers", "Warriors", "Bulls", "Celtics", "Heat", "Nets", "Knicks", "Raptors", "76ers",
    "Mavericks", "Rockets", "Spurs", "Suns", "Jazz", "Nuggets", "Clippers", "Kings", "Grizzlies", "Pelicans",
    "Blazers", "Timberwolves", "Thunder", "Hornets", "Hawks", "Cavaliers", "Pistons", "Pacers", "Bucks", "Wizards", "Magic"];

const Subscription: React.FC = () => {
    const [availableTeams, setAvailableTeams] = useState<string[]>(teams);
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);
    const email = useSelector((state: RootState) => state.auth.email);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch email subscriptions from the backend
        const jwtToken = localStorage.getItem('jwtToken');
        if (email) {
            axios.get(`http://localhost:8080/api/subscriptions/${email}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    const subscriptions = response.data.subscriptions;
                    if (subscriptions.length !== 0) {
                        for (let i = 0; i < subscriptions.length; i++) {
                            dispatch(subscribe(subscriptions[i]));
                        }
                        setAvailableTeams(teams.filter(team => !subscriptions.includes(team)));
                    }
                })
                .catch(error => console.error('Error fetching subscriptions:', error));
        }
    }, [email, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwtToken');
        navigate('/login');
        window.location.reload();
    };

    const handleSubscribe = async (team: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post('http://localhost:8080/api/subscribe', { email, team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(subscribe(team));
            setAvailableTeams(availableTeams.filter(t => t !== team));
        } catch (err) {
            console.log("Maximum subscriptions reached");
            console.error('Subscription failed:', err);
        }
    };

    const handleUnsubscribe = async (team: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post('http://localhost:8080/api/unsubscribe', { email, team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(unsubscribe(team));
            setAvailableTeams([...availableTeams, team]);
        } catch (err) {
            console.error('Unsubscription failed:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5">
            <h2 className="text-2xl font-bold">Subscribe to NBA Teams</h2>
            <button onClick={handleLogout} className="mt-4 w-full p-2 bg-red-500 text-white">Logout</button>
            <ul>
                {availableTeams.map((team, index) => (
                    <li key={index} className="mt-2">
                        <span>{team}</span>
                        <button onClick={() => handleSubscribe(team)} className="ml-2 p-1 bg-green-500 text-white">Subscribe</button>
                    </li>
                ))}
            </ul>
            <h3 className="mt-5">Subscribed Teams:</h3>
            <ul>
                {subscriptions.map((team, index) => (
                    <li key={index} className="mt-2">
                        <span>{team}</span>
                        <button onClick={() => handleUnsubscribe(team)} className="ml-2 p-1 bg-red-500 text-white">Unsubscribe</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Subscription;
