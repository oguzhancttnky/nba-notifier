import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import Logo from '../assets/icons/basketball-ball.svg';

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
                    <img src={Logo.toString()} alt="NBA Logo" className="w-8 h-8 mr-2" />
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
                                Subscribed
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
