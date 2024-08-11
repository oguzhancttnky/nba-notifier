import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Navbar from "./Navbar";
import TeamCard from "../cards/TeamCard";

const SubscribedTeams: React.FC = () => {
  const subscriptions = useSelector(
    (state: RootState) => state.subscriptions.subscribedTeams,
  );

  return (
    <div className="mx-auto mt-5">
      <Navbar />
      <div className="flex items-center justify-center my-8">
        <span className="text-gray-900 text-3xl font-semibold">
          Subscribed NBA Teams
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {subscriptions.map((teamID, index) => (
          <div key={index} className="flex-none">
            <TeamCard teamID={teamID} subscriptions={subscriptions} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribedTeams;
