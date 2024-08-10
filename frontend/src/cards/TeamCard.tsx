import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe, unsubscribe } from '../features/subscriptions/subscriptionsSlice';
import axios from 'axios';
import NotificationOnIcon from '../assets/icons/notifications-on.svg';
import NotificationOffIcon from '../assets/icons/notifications-off.svg';
import { teamIcons } from '../assets/icons/nbaicons';
import { teamsDictionary } from '../constants';

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
  const dispatch = useDispatch();

  const handleSubscribe = async (team: number) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe`, { user_id: userID, team_id: team }, {
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

  const handleUnsubscribe = async (team: number) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/unsubscribe`, { user_id: userID, team_id: team }, {
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
        <TeamIcon className="w-16 h-16" />
        <span className="text-gray-900 text-lg font-semibold">{teamName.split(' ').slice(-1).join(' ')}</span>
      {subscriptions.includes(teamID) ? (
        <button
          onClick={() => handleUnsubscribe(teamID)}
          className="bg-red-200 hover:bg-red-400 
                  hover:outline-red-400 hover:outline hover:outline-2 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <img src={NotificationOffIcon.toString()} alt="NBA Logo" className="w-4 h-4 mr-2" />
          <span>Unsubscribe</span>
        </button>
      ) : (
        <button
          onClick={() => handleSubscribe(teamID)}
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
