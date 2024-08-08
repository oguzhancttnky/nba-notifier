import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
                    email: values.email,
                    password: values.password,
                });

                if (response.data.success) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Registration failed', error);
                // Handle registration failure (e.g., show an error message)
            }
        },
    });

    return (
        <div className="max-w-md mx-auto mt-5">
            <h2 className="text-2xl font-bold">Register</h2>
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
                <div className="mt-4">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...formik.getFieldProps('confirmPassword')}
                        className={`w-full p-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                    ) : null}
                </div>
                <button type="submit" className="mt-4 w-full p-2 bg-blue-500 text-white">Register</button>
            </form>
            <button onClick={() => navigate('/login')} className="mt-4 w-full p-2 bg-green-500 text-white">Login</button>
        </div>
    );
};

export default Register;
