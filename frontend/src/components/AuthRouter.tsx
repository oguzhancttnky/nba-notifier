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

const AuthRouter: React.FC = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(
    (state: RootState) => state.subscriptions.subscribedTeams
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/verifytoken`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          dispatch(login(response.data.userID));
          const userID = response.data.userID;
          axios
            .get(
              `${process.env.REACT_APP_API_URL}/api/subscriptions/${userID}`,
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            )
            .then((response) => {
              const dbsubs = response.data.subscriptions;
              if (dbsubs !== null) {
                for (let i = 0; i < dbsubs.length; i++) {
                  const team = dbsubs[i];
                  if (!subscriptions.includes(team)) dispatch(subscribe(team));
                }
              }
            })
            .catch((error) =>
              console.error("Error fetching subscriptions:", error)
            );
        })
        .catch((error) => console.error("Error authenticating:", error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, subscriptions]);

  return (
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AuthRouter;
