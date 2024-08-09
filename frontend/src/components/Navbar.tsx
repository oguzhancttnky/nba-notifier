import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwtToken');
    };

    return (
        <nav className="p-4 bg-gray-200 rounded-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className='flex items-center'>
                    <svg className="w-8 h-8 mr-2" fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.449 31.449">
                        <g>
                            <path d="M27.702,5.538c-4.008-4.712-10.194-6.475-15.814-5.066c-2.27,0.569-4.447,1.656-6.35,3.275
                c-6.615,5.625-7.417,15.548-1.791,22.164c4.007,4.711,10.195,6.476,15.814,5.065c2.271-0.567,4.447-1.657,6.351-3.274
                C32.525,22.077,33.327,12.154,27.702,5.538z M28.023,20.801c-1.163-0.812-2.538-1.118-4.05-0.867
                c-0.104-2.052-0.38-4.024-0.758-5.869c1.233-0.127,3.396-0.265,5.704-0.028C29.209,16.325,28.905,18.659,28.023,20.801z
                M2.743,14.027c0.323-1.281,2.19-4.438,5.103-4.976c1.99-0.366,4.171-0.326,6.278-0.29c1.94,0.034,3.781,0.05,5.447-0.199
                c0.414,1.171,0.822,2.472,1.182,3.87c-9.616,1.824-15.293,5.991-17.501,7.938C2.87,19.347,2.145,16.396,2.743,14.027z M20.871,6.27
                c-0.541-1.367-1.062-2.502-1.48-3.351c1.157,0.331,2.263,0.82,3.294,1.457C22.655,5.494,21.635,6.026,20.871,6.27z M21.207,14.382
                c0.399,1.915,0.686,3.972,0.771,6.106c-2.421,0.827-3.787,1.688-5.224,2.592c-1.116,0.703-2.269,1.431-4.057,2.222
                c-2.084,0.923-3.925,0.686-5.202,0.257c-1.303-0.75-2.364-2.022-3.244-3.391C5.975,20.595,11.525,16.205,21.207,14.382z
                M25.875,7.091c1.201,1.412,2.129,3.108,2.646,4.775c-2.75-0.125-4.999,0.15-5.758,0.236c-0.36-1.425-0.771-2.754-1.19-3.958
                c1.121-0.385,2.362-1.158,2.875-2.473C24.95,6.107,25.435,6.572,25.875,7.091z M7.089,5.572c1.578-1.342,3.388-2.275,5.38-2.774
                c1.477-0.371,2.968-0.469,4.423-0.343c0.302,0.549,1.085,2.043,1.955,4.198c-1.435,0.164-3.023,0.14-4.688,0.109
                C11.953,6.72,9.67,6.68,7.482,7.083c-1.075,0.199-2.003,0.65-2.806,1.222C5.339,7.311,6.134,6.384,7.089,5.572z M18.977,28.651
                c-2.957,0.741-5.967,0.438-8.625-0.738c0.979-0.064,2.039-0.287,3.154-0.781c1.921-0.852,3.191-1.651,4.313-2.358
                c1.244-0.783,2.366-1.482,4.172-2.161c-0.043,1.694-0.229,3.425-0.596,5.156C20.623,28.138,19.821,28.44,18.977,28.651z
                M24.357,25.876c-0.219,0.187-0.452,0.35-0.682,0.517c0.222-1.495,0.328-2.976,0.34-4.424c1.202-0.269,2.241-0.06,3.101,0.639
                C26.394,23.808,25.482,24.919,24.357,25.876z"/>
                        </g>
                    </svg>
                    <span className="text-gray-900 text-3xl font-semibold">NBA Notifier</span>
                </Link>

                <div className="space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/"
                                className="pb-5 text-gray-900 text-lg hover:text-gray-400 hover:border-b-4 hover:border-red-500 transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link
                                to="/account/subscribed"
                                className="pb-5 text-gray-900 text-lg hover:text-gray-400 hover:border-b-4 hover:border-red-500 transition-colors duration-200"
                            >
                                Subscribed Teams
                            </Link>
                            <Link
                                to="/account"
                                className="pb-5 text-gray-900 text-lg hover:text-gray-400 hover:border-b-4 hover:border-red-500 transition-colors duration-200"
                            >
                                Account
                            </Link>
                            <Link
                                onClick={handleLogout}
                                to="/login"
                                className="pb-5 text-gray-900 text-lg hover:text-gray-400 hover:border-b-4 hover:border-red-500 transition-colors duration-200"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-white text-lg hover:text-gray-300 transition-colors duration-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
