import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';
import Navbar from './Navbar';

const teams = ["Lakers", "Warriors", "Bulls", "Celtics", "Heat", "Nets", "Knicks", "Raptors", "76ers",
    "Mavericks", "Rockets", "Spurs", "Suns", "Jazz", "Nuggets", "Clippers", "Kings", "Grizzlies", "Pelicans",
    "Blazers", "Timberwolves", "Thunder", "Hornets", "Hawks", "Cavaliers", "Pistons", "Pacers", "Bucks", "Wizards", "Magic"];

const Home: React.FC = () => {
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);
    const userID = useSelector((state: RootState) => state.auth.userID);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch email subscriptions from the backend
        const jwtToken = localStorage.getItem('jwtToken');
        if (userID) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions/${userID}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    const dbsubs = response.data.subscriptions;
                    if (dbsubs.length !== 0) {
                        for (let i = 0; i < dbsubs.length; i++) {
                            const team = dbsubs[i];
                            if (!subscriptions.includes(team))
                                dispatch(subscribe(team));
                        }
                    }
                })
                .catch(error => console.error('Error fetching subscriptions:', error));
        }
    }, [subscriptions, userID, dispatch]);

    const handleSubscribe = async (team: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe`, { user_id: userID, team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(subscribe(team));
        } catch (err) {
            console.log("Maximum subscriptions reached");
            console.error('Subscription failed:', err);
        }
    };

    const handleUnsubscribe = async (team: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/unsubscribe`, { user_id: userID, team }, {
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
            <h2 className="text-2xl font-bold">Subscribe to NBA Teams</h2>
            <div className="mt-3">
                {teams.map((team, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-300 py-2">
                        <div>{team}</div>
                        {subscriptions.includes(team) ? (
                            <button onClick={() => handleUnsubscribe(team)} className="px-3 py-1 bg-red-500 text-white">Unsubscribe</button>
                        ) : (
                            <button onClick={() => handleSubscribe(team)} className="px-3 py-1 bg-green-500 text-white">Subscribe</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
