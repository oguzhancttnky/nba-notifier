import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { LogoIcon, LogoutIcon } from "../assets/icons/others";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  const ToggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    toast.dismiss();
    dispatch(logout());
    localStorage.removeItem("jwtToken");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="p-4 bg-gray-200 dark:bg-gray-600 rounded-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center">
          <LogoIcon className="w-8 h-8 mr-2 text-gray-900 dark:text-gray-100" />
          <span className="text-gray-900 dark:text-gray-100 text-3xl font-semibold">
            NBA Notifier
          </span>
        </Link>

        <div className="space-x-4">
          <button
            onClick={ToggleTheme}
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            )}
          </button>
          <Link
            to="/features"
            className="pb-5 text-gray-900 dark:text-gray-100 text-lg hover:text-gray-400 dark:hover:text-gray-300 hover:border-b-4 hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="/account/subscribed"
            className="pb-5 text-gray-900 dark:text-gray-100 text-lg hover:text-gray-400 dark:hover:text-gray-300 hover:border-b-4 hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200"
          >
            Subscribed
          </Link>
          <Link
            to="/account"
            className="pb-5 text-gray-900 dark:text-gray-100 text-lg hover:text-gray-400 dark:hover:text-gray-300 hover:border-b-4 hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200"
          >
            Account
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <LogoutIcon className="w-4 h-4 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
