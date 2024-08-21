import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { APIs } from "../helpers/constants";

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const userID = useSelector((state: RootState) => state.auth.userID);
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const GetUserType = async () => {
      try {
        const response = await axios.get(
          APIs.get_user_by_user_id_api + userID,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response) {
          setAccountType(response.data.account_type);
        }
      } catch (err) {
        console.error("Get user data failed:", err);
      }
    };
    GetUserType();
  }, [userID]);

  const CurrentPlanButton = () => {
    return (
      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400">
        Current Plan
      </button>
    );
  };

  const SubscribeButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
      >
        Subscribe
      </button>
    );
  };

  return (
    <Layout>
      <div className="mx-auto mt-5 px-6">
        <section>
          <div className="flex items-center justify-center my-8">
            <span className="text-gray-900 text-3xl font-semibold dark:text-gray-100">
              Upgrade Your Account
            </span>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-gray-700 mt-6 mb-12 text-center text-lg dark:text-gray-300">
              Choose the plan that best suits your needs.
            </p>
          </div>
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200 dark:bg-gray-900 dark:border-gray-600 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                    Free Account
                  </h3>
                  <p className="text-gray-700 mb-4 dark:text-gray-300">
                    Subscribe to up to 5 teams and access player stats for these
                    teams only.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-4">No cost</p>
                  {accountType === "Free" ? <CurrentPlanButton /> : <></>}
                </div>
              </div>

              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200 dark:bg-gray-900 dark:border-gray-600 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                    Premium Account
                  </h3>
                  <p className="text-gray-700 mb-4 dark:text-gray-300">
                    Subscribe to 10 teams and get detailed stats for both
                    players on your subscribed teams and players of opponent
                    teams.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-4">$1/month</p>
                  {accountType === "Premium" ? (
                    <CurrentPlanButton />
                  ) : (
                    <SubscribeButton
                      onClick={() => {
                        navigate("/payment/premium");
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200 dark:bg-gray-900 dark:border-gray-600 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                    Deluxe Account
                  </h3>
                  <p className="text-gray-700 mb-4 dark:text-gray-300">
                    Subscribe to 20 teams and get detailed stats for both
                    players on your subscribed teams and players of opponent
                    teams.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-4">$2/month</p>
                  {accountType === "Deluxe" ? (
                    <CurrentPlanButton />
                  ) : (
                    <SubscribeButton
                      onClick={() => {
                        navigate("/payment/deluxe");
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link to="/account" className="text-blue-500 hover:underline">
              Back to Account
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Upgrade;
