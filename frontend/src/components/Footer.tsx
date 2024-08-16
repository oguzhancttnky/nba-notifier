import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/features" className="text-gray-800 dark:text-gray-200 hover:underline">
              Features
            </Link>
            <Link to="/help" className="text-gray-800 dark:text-gray-200 hover:underline">
              Help
            </Link>
            <Link to="/contact" className="text-gray-800 dark:text-gray-200 hover:underline">
              Contact
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-right text-gray-900 dark:text-gray-100">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} NBA Notifier. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
