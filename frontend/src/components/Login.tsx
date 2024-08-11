import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { subscribe } from '../features/subscriptions/subscriptionsSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../features/auth/authSlice';
import axios from 'axios';
import Logo from '../assets/icons/basketball-ball.svg';
import EmailIcon from '../assets/icons/email-icon.svg';
import PasswordIcon from '../assets/icons/password-icon.svg';
import Spinner from './Spinner';
import { toast } from "react-toastify";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);
    const [loading, setLoading] = useState(false);

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
            toast.dismiss();
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                    email: values.email,
                    password: values.password,
                });

                if (response.data.success) {
                    const userID = response.data.userID;
                    const jwtToken = response.data.token;
                    dispatch(login(userID));
                    localStorage.setItem('jwtToken', jwtToken);
                    axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions/${userID}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    }).then(response => {
                        const dbsubs = response.data.subscriptions;
                        if (dbsubs !== null) {
                            for (let i = 0; i < dbsubs.length; i++) {
                                const team = dbsubs[i];
                                if (!subscriptions.includes(team))
                                    dispatch(subscribe(team));
                            }
                        }
                    }).catch(error => console.error('Error fetching subscriptions:', error));
                    setLoading(false);
                    navigate('/home');
                    toast.success("Login successful");
                }
            } catch (error) {
                console.error('Login failed', error);
                setLoading(false);
                toast.error("Login failed");
            }
        },
    });

    return (
        <section>
            <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
                <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
                    <div className='flex items-center justify-center'>
                        <img src={Logo.toString()} alt="NBA Logo" className="w-8 h-8 mr-2" />
                        <span className="text-gray-900 text-3xl font-semibold">NBA Notifier</span>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                        <a href="/login" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
                            sign in
                        </a>
                        <a href="/register" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
                            sign up
                        </a>
                    </div>

                    <div className="relative mt-6">
                        <div className="flex items-center">
                            <span className="absolute left-0 flex items-center pl-3">
                                <img src={EmailIcon.toString()} alt="Email Icon" className="w-6 h-6" />
                            </span>
                            <input
                                {...formik.getFieldProps('email')}
                                type="email"
                                className={`${formik.touched.email && formik.errors.email ? 'border-red-500' : ''} 
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                                placeholder="Email address"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="relative mt-6">
                        <div className="flex items-center">
                            <span className="absolute left-0 flex items-center pl-3">
                                <img src={PasswordIcon.toString()} alt="Password Icon" className="w-6 h-6" />
                            </span>
                            <input
                                {...formik.getFieldProps('password')}
                                type="password"
                                className={`${formik.touched.password && formik.errors.password ? 'border-red-500' : ''} 
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                                placeholder="Password"
                            />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>


                    <div className="mt-6">
                        <button type='submit' className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            Sign In
                            {loading && <Spinner />}
                        </button>

                        <div className="mt-6 text-center ">
                            Don't you have an account?
                            <a href="/register" className="ml-1 text-sm text-blue-500 hover:underline dark:text-blue-400">
                                Sign up
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </section>

    );
};

export default Login;
