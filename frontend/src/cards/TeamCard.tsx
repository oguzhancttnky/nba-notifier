import React, { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';
import NotificationOnIcon from '../assets/icons/notifications-on.svg';
import NotificationOffIcon from '../assets/icons/notifications-off.svg';

interface TeamCardProps {
    teamName: string;
    subscriptions: string[];
    size?: string | number;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, subscriptions, size = '100' }) => {
    // Dynamically import the correct SVG component
    const TeamIcon = lazy(() => import(`../assets/nba_icons/${teamName}.js`));
    const userID = useSelector((state: RootState) => state.auth.userID);
    const dispatch = useDispatch();

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
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg w-48">
            <Suspense fallback={<div>Loading...</div>}>
                <TeamIcon size={size} className="mb-4" />
            </Suspense>
            {subscriptions.includes(teamName) ? (
                <button
                    onClick={() => handleUnsubscribe(teamName)}
                    className="bg-red-200 hover:bg-red-400 
                            hover:outline-red-400 hover:outline hover:outline-2 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <img src={NotificationOffIcon.toString()} alt="NBA Logo" className="w-4 h-4 mr-2" />
                    <span>Unsubscribe</span>
                </button>
            ) : (
                <button
                    onClick={() => handleSubscribe(teamName)}
                    className="bg-green-200 hover:bg-green-400 
                            hover:outline-green-400 hover:outline hover:outline-2 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <img src={NotificationOnIcon.toString()} alt="NBA Logo" className="w-4 h-4 mr-2" />
                    <span>Subscribe</span>
                </button>
            )}
        </div>
    );
};

export default TeamCard;
