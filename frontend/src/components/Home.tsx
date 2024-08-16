import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import TeamCard from "../cards/TeamCard";
import Layout from "./Layout";

const teams = Array.from({ length: 30 }, (_, i) => i + 1);

const Home: React.FC = () => {
  const subscriptions = useSelector(
    (state: RootState) => state.subscriptions.subscribedTeams
  );

  return (
    <Layout>
      <div className="mx-auto mt-5 px-4 md:px-8">
        <section>
          <div className="flex items-center justify-center my-8">
            <span className="text-gray-900 text-2xl md:text-3xl font-semibold dark:text-gray-100">
              Subscribe to NBA Teams
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
            {teams.map((teamID, index) => (
              <div key={index} className="flex-none">
                <TeamCard teamID={teamID} subscriptions={subscriptions} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
