import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import {
  LogoIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
} from "../assets/icons/others";
import { toast } from "react-toastify";
import { RootState } from "../app/store";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        <Link to="/home" className="flex items-center mb-2 sm:mb-0">
          <LogoIcon className="w-8 h-8 mr-2 text-gray-900 dark:text-gray-100" />
          <span className="text-gray-900 dark:text-gray-100 text-xl sm:text-3xl font-semibold">
            NBA Notifier
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <Link
                to="/home"
                className="text-gray-800 dark:text-gray-200 hover:underline"
              >
                Home
              </Link>
              <Link
                to="/account/subscribed"
                className="text-gray-800 dark:text-gray-200 hover:underline"
              >
                Subscribed
              </Link>
              <Link
                to="/account"
                className="text-gray-800 dark:text-gray-200 hover:underline"
              >
                Account
              </Link>
            </>
          )}

          <button
            onClick={ToggleTheme}
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-gray-200 py-1 px-2 rounded"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-gray-200 py-1 px-2 rounded"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={ToggleTheme}
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } ease-in-out duration-300`}
      >
        <div className="relative p-4 bg-gray-200 dark:bg-gray-600 h-full">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-800 dark:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <div className="flex flex-col space-y-4 mt-10">
            {isAuthenticated && (
              <>
                <Link
                  to="/home"
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/account/subscribed"
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subscribed
                </Link>
                <Link
                  to="/account"
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-gray-200 py-1 px-2 rounded"
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-gray-200 py-1 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
