import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';


const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwtToken');
        navigate('/login');
        window.location.reload();
    };
    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between">
                    <div>
                        <Link to="/" className="text-white text-2xl font-bold">NBA Notifier</Link>
                    </div>
                    <div>
                        {isAuthenticated ? (
                            <div>
                                <Link to="/profile" className="text-white">Profile</Link>
                                <button onClick={handleLogout} className="ml-4 text-white">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );

}

export default Navbar;