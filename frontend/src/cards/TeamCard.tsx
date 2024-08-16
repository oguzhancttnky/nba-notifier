import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  subscribe,
  unsubscribe,
} from "../features/subscriptions/subscriptionsSlice";
import {
  NotificationsOnIcon,
  NotificationsOffIcon,
} from "../assets/icons/others";
import axios from "axios";
import { teamIcons } from "../assets/icons/nbaicons";
import { teamsDictionary, apiEndpoints } from "../constants";
import { toast } from "react-toastify";

interface TeamCardProps {
  teamID: number;
  subscriptions: number[];
  size?: string | number;
}

const TeamCard: React.FC<TeamCardProps> = ({
  teamID,
  subscriptions,
  size = "100",
}) => {
  const teamAbbr = teamsDictionary[teamID][0];
  const teamName = teamsDictionary[teamID][1];
  const TeamIcon = teamIcons[teamAbbr] || (() => <div>Icon not found</div>);
  const userID = useSelector((state: RootState) => state.auth.userID);
  const isSubscribed = subscriptions.includes(teamID);

  const dispatch = useDispatch();

  const handleSubscribe = async (team: number) => {
    toast.dismiss();
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      await axios.post(
        apiEndpoints.subscribe_nba_team_api_endpoint,
        { user_id: userID, team_id: team },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      dispatch(subscribe(team));
      toast.success("Subscribed successfully");
    } catch (err: any) {
      console.error("Subscription failed:", err);
      toast.error(err.response.data.error);
    }
  };

  const handleUnsubscribe = async (team: number) => {
    toast.dismiss();
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      await axios.post(
        apiEndpoints.unsubscribe_nba_team_api_endpoint,
        { user_id: userID, team_id: team },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      dispatch(unsubscribe(team));
      toast.success("Unsubscribed successfully");
    } catch (err) {
      console.error("Unsubscription failed:", err);
      toast.error("Unsubscription failed");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg w-48 h-56">
      <TeamIcon width={size} height={size} />
      <span className="text-gray-900 text-lg font-semibold dark:text-gray-100">
        {teamName.split(" ").slice(-1).join(" ")}
      </span>
      <div className="mt-2">
        {isSubscribed ? (
          <button
            onClick={() => handleUnsubscribe(teamID)}
            className="bg-red-300 hover:bg-red-500 font-bold py-2 px-4 rounded inline-flex items-center transition-colors ease-out duration-300"
          >
            <NotificationsOffIcon className="w-4 h-4 text-gray-800" />
          </button>
        ) : (
          <button
            onClick={() => handleSubscribe(teamID)}
            className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded inline-flex items-center transition-all ease-in-out duration-300
            dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <NotificationsOnIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
            <span className="ml-2 dark:text-gray-200">Subscribe</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
