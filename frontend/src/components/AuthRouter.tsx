import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Account from './Account';
import Home from './Home';
import { login } from '../features/auth/authSlice';
import axios from 'axios';
import SubscribedTeams from './SubscribedTeams';
import { subscribe } from '../features/subscriptions/subscriptionsSlice';


const AuthRouter: React.FC = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/verifytoken`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    dispatch(login(response.data.userID));
                    const userID = response.data.userID;
                    axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions/${userID}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    })
                        .then(response => {
                            const dbsubs = response.data.subscriptions;
                            if (dbsubs !== null) {
                                for (let i = 0; i < dbsubs.length; i++) {
                                    const team = dbsubs[i];
                                    if (!subscriptions.includes(team))
                                        dispatch(subscribe(team));
                                }
                            }
                        })
                        .catch(error => console.error('Error fetching subscriptions:', error));
                })
                .catch(error => console.error('Error authenticating:', error))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);  // No token, so stop loading
        }
    }, [dispatch, subscriptions]);

    if (loading) {
        return <div>Loading...</div>;  // Or return null for no UI feedback
    }

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/" />} />
            <Route path="/account/subscribed" element={isAuthenticated ? <SubscribedTeams /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AuthRouter;
