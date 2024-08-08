import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../features/auth/authSlice';
import axios from 'axios';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                    email: values.email,
                    password: values.password,
                });

                if (response.data.success) {
                    dispatch(login(response.data.userid));
                    localStorage.setItem('jwtToken', response.data.token);
                    navigate('/subscription');
                }
            } catch (error) {
                console.error('Login failed', error);
                // Handle login failure (e.g., show an error message)
            }
        },
    });

    return (
        <div className="max-w-md mx-auto mt-5">
            <h2 className="text-2xl font-bold">Login</h2>
            <form onSubmit={formik.handleSubmit} className="mt-4">
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Email"
                        {...formik.getFieldProps('email')}
                        className={`w-full p-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="mt-4">
                    <input
                        type="password"
                        placeholder="Password"
                        {...formik.getFieldProps('password')}
                        className={`w-full p-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    ) : null}
                </div>
                <button type="submit" className="mt-4 w-full p-2 bg-blue-500 text-white">Login</button>
            </form>
            <button onClick={() => navigate('/register')} className="mt-4 w-full p-2 bg-green-500 text-white">Register</button>
        </div>
    );
};

export default Login;
