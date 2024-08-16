import React from "react";
import Layout from "./Layout";

const Features: React.FC = () => {
  const manageSubscriptions = require("../assets/images/nbateams.jpg");
  const realTimeNotifications = require("../assets/images/telegram.jpg");
  const accountManagement = require("../assets/images/account-management.jpeg");
  const dataSecurity = require("../assets/images/security.jpg");

  return (
    <Layout>

    <section className="flex flex-col items-center justify-center py-16 dark:text-gray-100">
      <div className="max-w-5xl w-full px-6">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 text-center mb-12">
          Explore Our Features
        </h1>
        <div className="space-y-12">
          {/* Manage Your Subscriptions */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-8">
            <div className="md:w-2/5 text-left">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Manage Your Subscriptions
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Subscribe to your favorite NBA teams and manage your
                subscriptions with a useful interface. You can subscribe to 5 teams maximum for free 
                and upgrade your account for more.
              </p>
            </div>
            <div className="md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
              <img
                src={String(manageSubscriptions)}
                alt="Manage Subscriptions"
                className="w-full md:w-48 h-auto md:h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Real-time Notifications */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-8">
            <div className="md:w-2/5 flex justify-center md:justify-start mt-6 md:mt-0">
              <img
                src={String(realTimeNotifications)}
                alt="Real-time Notifications"
                className="w-full md:w-48 h-auto md:h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/5 text-left md:text-right">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Real-time Notifications
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Stay updated with real-time notifications for your subscribed
                teams. Daily match results will be sent via Telegram bot. You
                can also see all season games of your team and player stats of
                the game. Please check @nbanotifier_bot for more
                features and details.
              </p>
            </div>
          </div>

          {/* Simple Account Management */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-8">
            <div className="md:w-2/5 text-left">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Simple Account Management
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Manage your account settings and update easily. Navigate through
                a clean and user-friendly interface designed for simplicity and
                efficiency.
              </p>
            </div>
            <div className="md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
              <img
                src={String(accountManagement)}
                alt="Account Management"
                className="w-full md:w-48 h-auto md:h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Secure Payments */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/5 flex justify-center md:justify-start mt-6 md:mt-0">
              <img
                src={String(dataSecurity)}
                alt="Data Security"
                className="w-full md:w-48 h-auto md:h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/5 text-left md:text-right">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Secure Payments
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                We offer secure payment through Payizone. Choose the upgrade plan
                that suits you best. Check out your account page for more
                details about the upgrade. <a href="/account" className="text-blue-500 dark:text-blue-400">Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Layout>
  );
};

export default Features;
