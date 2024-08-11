import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';
import NotificationOnIcon from '../assets/icons/notifications-on.svg';
import NotificationOffIcon from '../assets/icons/notifications-off.svg';
import { teamIcons } from '../assets/icons/nbaicons';
import { teamsDictionary } from '../constants';
import { toast } from "react-toastify";

interface TeamCardProps {
    teamID: number;
    subscriptions: number[];
    size?: string | number;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamID, subscriptions, size = '100' }) => {
    const teamAbbr = teamsDictionary[teamID][0];
    const teamName = teamsDictionary[teamID][1];
    const TeamIcon = teamIcons[teamAbbr] || (() => <div>Icon not found</div>);
    const userID = useSelector((state: RootState) => state.auth.userID);
    const isSubscribed = subscriptions.includes(teamID);

    const dispatch = useDispatch();

    const handleSubscribe = async (team: number) => {
        toast.dismiss();
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe`, { user_id: userID, team_id: team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(subscribe(team));
            toast.success("Subscribed successfully", );
        } catch (err: any) {
            console.log("Maximum subscriptions reached");
            console.error('Subscription failed:', err);
            toast.error("Maximum subscriptions reached ");
        }
    };

    const handleUnsubscribe = async (team: number) => {
        toast.dismiss();
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/unsubscribe`, { user_id: userID, team_id: team }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(unsubscribe(team));
            toast.success("Unsubscribed successfully");
        } catch (err) {
            console.error('Unsubscription failed:', err);
            toast.error("Unsubscription failed");
        }
    };

    return (
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg w-48 h-56">
            <TeamIcon width={size} height={size} />
            <span className="text-gray-900 text-lg font-semibold">
                {teamName.split(' ').slice(-1).join(' ')}
            </span>
            <div className='mt-2'>
                {isSubscribed ? (
                    <button
                        onClick={() => handleUnsubscribe(teamID)}
                        className="bg-red-300 hover:bg-red-500 font-bold py-2 px-4 rounded inline-flex items-center transition-colors ease-out duration-300"
                    >
                        <img
                            src={NotificationOffIcon.toString()}
                            alt="Notification Off"
                            className="w-4 h-4"
                        />
                    </button>
                ) : (
                    <button
                        onClick={() => handleSubscribe(teamID)}
                        className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded inline-flex items-center transition-all ease-in-out duration-300"
                    >
                        <img
                            src={NotificationOnIcon.toString()}
                            alt="Notification On"
                            className="w-4 h-4 mr-2"
                        />
                        <span>Subscribe</span>
                    </button>
                )}
            </div>

        </div>
    );
};

export default TeamCard;
