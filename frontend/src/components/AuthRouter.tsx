import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Subscription from './Subscription';
import { login } from '../features/auth/authSlice';
import axios from 'axios';

const AuthRouter: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            axios.get(`${process.env.REACT_APP_API_URL}/verifytoken`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    console.log('User is authenticated:', response.data.email);
                    dispatch(login(response.data.email));
                })
                .catch(error => console.error('Error authenticating:', error));
        }
    }, [dispatch]);


  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/subscription"/> : <Navigate to="/login"/> } />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/subscription"/> : <Login/> } />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/subscription"/> : <Register/> } />
      <Route path="/subscription" element={isAuthenticated ? <Subscription /> : <Navigate to="/"/> } />
    </Routes>
  );
};

export default AuthRouter;
