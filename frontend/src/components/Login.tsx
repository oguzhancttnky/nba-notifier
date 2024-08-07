import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Call your backend API for login
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
    if (response.data.success) {
      dispatch(login(email));
        localStorage.setItem('jwtToken', response.data.token);
      navigate('/subscription');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-bold">Login</h2>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <div className="mt-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <button onClick={handleLogin} className="mt-4 w-full p-2 bg-blue-500 text-white">Login</button>
      <button onClick={() => navigate('/register')} className="mt-4 w-full p-2 bg-green-500 text-white">Register</button>
    </div>
  );
};

export default Login;
