import React, { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';

interface TeamCardProps {
    teamName: string;
    subscriptions: string[];
    size?: string | number;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, subscriptions, size = '100' }) => {
    // Dynamically import the correct SVG component
    const TeamIcon = lazy(() => import(`../images/nba_icons/${teamName}.js`));
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
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M853.333333 797.653333L334.506667 262.4l-109.44-112.853333L170.666667 203.733333l119.466666 119.466667 
                    0.213334 0.213333C267.946667 365.653333 256 415.573333 256 469.333333v213.333334l-85.333333 85.333333v42.666667h585.813333l85.333333 
                    85.333333L896 841.6l-42.666667-43.946667zM512 938.666667c47.146667 0 85.333333-38.186667 85.333333-85.333334h-170.666666c0 47.146667 
                    38.186667 85.333333 85.333333 85.333334z m256-312.32V469.333333c0-131.2-69.76-240.64-192-269.653333V170.666667c0-35.413333-28.586667-64-64-64s-64 
                    28.586667-64 64v29.013333a233.664 233.664 0 0 0-31.146667 9.813333s-0.213333 0-0.213333 0.213334c-0.213333 0-0.426667 0.213333-0.64 0.213333-9.813333 
                    3.84-19.413333 8.32-28.8 13.226667-0.213333 0-0.426667 0.213333-0.64 0.213333L768 626.346667z" fill="#010101" /></svg>
                    <span>Unsubscribe</span>
                </button>
            ) : (
                <button
                    onClick={() => handleSubscribe(teamName)}
                    className="bg-green-200 hover:bg-green-400 
                            hover:outline-green-400 hover:outline hover:outline-2 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M512 938.666667c47.146667 0 85.333333-38.186667 85.333333-85.333334h-170.666666c0 47.146667 38.186667 85.333333 85.333333 85.333334z m256-256V469.333333c0-131.2-69.76-240.64-192-269.653333V170.666667c0-35.413333-28.586667-64-64-64s-64 28.586667-64 64v29.013333c-122.24 29.013333-192 138.453333-192 269.653333v213.333334l-85.333333 85.333333v42.666667h682.666666v-42.666667l-85.333333-85.333333z" fill="#010101" /></svg>
                    <span>Subscribe</span>
                </button>
            )}
        </div>
    );
};

export default TeamCard;
