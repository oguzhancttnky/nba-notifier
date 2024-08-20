import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";
import Home from "./Home";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import SubscribedTeams from "./SubscribedTeams";
import { subscribe } from "../features/subscriptions/subscriptionsSlice";
import Loading from "./Loading";
import ResetPassword from "./ResetPassword";
import Payment from "./Payment";
import Upgrade from "./Upgrade";
import PaymentResult from "./PaymentResult";
import { apiEndpoints } from "../helpers/constants";
import Features from "./Features";
import Contact from "./Contact";
import Help from "./Help";

const AuthRouter: React.FC = () => {
  const dispatch = useDispatch();
  const [untilDate, setUntilDate] = useState("00.00.0000");
  const [showNotification, setShowNotification] = useState(false);
  const [isExtendedPeriod, setIsExtendedPeriod] = useState(false);
  const subscriptions = useSelector(
    (state: RootState) => state.subscriptions.subscribedTeams
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  const isDarkMode = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDarkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }

        const jwtToken = localStorage.getItem("jwtToken");

        if (jwtToken) {
          const verifyResponse = await axios.get(
            apiEndpoints.verify_jwt_api_endpoint,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const userID = verifyResponse.data.userID;
          dispatch(login(userID));

          const userResponse = await axios.get(
            apiEndpoints.get_user_by_user_id_api_endpoint + userID,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const expiresAt = new Date(userResponse.data.expires_at);
          const formattedDate = formatDate(expiresAt);
          setUntilDate(formattedDate);

          const extended = userResponse.data.extended;

          const subsResponse = await axios.get(
            apiEndpoints.get_subscriptions_by_user_id_api_endpoint + userID,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const dbsubs = subsResponse.data.subscriptions;

          if (extended) {
            setIsExtendedPeriod(true);
            setShowNotification(true);
          }

          if (dbsubs !== null) {
            for (const team of dbsubs) {
              if (!subscriptions.includes(team)) {
                dispatch(subscribe(team));
              }
            }
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, subscriptions, isDarkMode]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      {isExtendedPeriod && showNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
            <div className="flex justify-between items-center">
              <span>
                Your Premium subscription has expired. You have to renew your
                subscription until {untilDate}
              </span>
              <button
                onClick={handleNotificationClose}
                className="ml-4 bg-white text-yellow-500 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            !loading ? (
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path="/login"
          element={
            !loading ? (
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            !loading ? (
              isAuthenticated ? (
                <Home />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path="/account"
          element={
            !loading ? isAuthenticated ? <Account /> : <Login /> : <Loading />
          }
        />
        <Route
          path="/account/subscribed"
          element={
            !loading ? (
              isAuthenticated ? (
                <SubscribedTeams />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/upgrade"
          element={
            !loading ? isAuthenticated ? <Upgrade /> : <Login /> : <Loading />
          }
        />
        <Route
          path="/payment/premium"
          element={
            !loading ? (
              isAuthenticated ? (
                <Payment planType="Premium" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path="/payment/deluxe"
          element={
            !loading ? (
              isAuthenticated ? (
                <Payment planType="Deluxe" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path="/payment/success"
          element={
            !loading ? (
              isAuthenticated ? (
                <PaymentResult status="success" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path="/payment/fail"
          element={
            !loading ? (
              isAuthenticated ? (
                <PaymentResult status="fail" />
              ) : (
                <Login />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default AuthRouter;
