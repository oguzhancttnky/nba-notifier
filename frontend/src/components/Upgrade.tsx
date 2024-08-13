import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const userID = useSelector((state: RootState) => state.auth.userID);
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const GetUserType = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_HOST_URL}/api/v1/user/${userID}`,
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

  return (
    <Layout>
      <div className="mx-auto mt-5 px-6">
        <section>
          <div className="flex items-center justify-center my-8">
            <span className="text-gray-900 text-3xl font-semibold">
              Upgrade Your Account
            </span>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-gray-700 mt-6 mb-12 text-center text-lg">
              Choose the plan that best suits for you.
            </p>
          </div>
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4">Free Account</h3>
                <p className="text-gray-700 mb-4">
                  You can subscribe to only 5 teams.
                </p>
                <p className="text-gray-500 mb-4">No cost.</p>
                {accountType === "Free" ? <CurrentPlanButton /> : <></>}
              </div>

              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4">Premium Account</h3>
                <p className="text-gray-700 mb-4">
                  You can subscribe to 10 teams.
                </p>
                <p className="text-gray-500 mb-4">$1/month</p>
                {accountType === "Premium" ? (
                  <CurrentPlanButton />
                ) : (
                  <button
                    onClick={() => {
                      navigate("/payment/premium");
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
                  >
                    Subscribe
                  </button>
                )}
              </div>

              <div className="w-full sm:w-80 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4">Deluxe Account</h3>
                <p className="text-gray-700 mb-4">
                  You can subscribe to 20 teams.
                </p>
                <p className="text-gray-500 mb-4">$2/month</p>
                {accountType === "Deluxe" ? (
                  <CurrentPlanButton />
                ) : (
                  <button
                    onClick={() => {
                      navigate("/payment/deluxe");
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
                  >
                    Subscribe
                  </button>
                )}
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
