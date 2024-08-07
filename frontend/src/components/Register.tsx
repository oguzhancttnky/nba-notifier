import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { email, password });
      if (response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-bold">Register</h2>
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
      <div className="mt-4">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button onClick={handleRegister} className="mt-4 w-full p-2 bg-blue-500 text-white">Register</button>
        <button onClick={() => navigate('/login')} className="mt-4 w-full p-2 bg-green-500 text-white">Login</button>
    </div>
  );
};

export default Register;
