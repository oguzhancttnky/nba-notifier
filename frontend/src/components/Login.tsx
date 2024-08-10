import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../features/auth/authSlice';
import axios from 'axios';
import Logo from '../assets/icons/basketball-ball.svg';

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
                    dispatch(login(response.data.userID));
                    localStorage.setItem('jwtToken', response.data.token);
                    navigate('/home');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Login failed', error);
                // Handle login failure (e.g., show an error message)
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
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
                            <span className="absolute left-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
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
