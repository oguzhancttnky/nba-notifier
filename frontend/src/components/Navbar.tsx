import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/basketball-ball.svg";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    toast.dismiss();
    dispatch(logout());
    localStorage.removeItem("jwtToken");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="p-4 bg-gray-200 rounded-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={Logo.toString()} alt="NBA Logo" className="w-8 h-8 mr-2" />
          <span className="text-gray-900 text-3xl font-semibold">
            NBA Notifier
          </span>
        </Link>
        <div className="space-x-4">
          <Link
            to="/home"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
