import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/basketball-ball.svg";

const Features: React.FC = () => {
  const manageSubscriptions = require("../assets/images/nbateams.jpg");
  const realTimeNotifications = require("../assets/images/telegram.jpg");
  const accountManagement = require("../assets/images/account-management.jpeg");
  const dataSecurity = require("../assets/images/security.jpeg");
  return (
    <section className="flex flex-col items-center justify-center py-16">
      <Link to="/" className="flex items-center my-4">
        <img src={Logo.toString()} alt="NBA Logo" className="w-8 h-8 mr-2" />
        <span className="text-gray-900 text-3xl font-semibold">
          NBA Notifier
        </span>
      </Link>
      <div className="max-w-5xl w-full px-6 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Explore Our Features
        </h1>
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-gray-300 pb-8">
            <div className="w-2/5 text-left">
              <h2 className="text-2xl font-semibold text-gray-700">
                Manage Your Subscriptions
              </h2>
              <p className="mt-4 text-gray-600">
                Subscribe to your favorite NBA teams and manage your
                subscriptions with an useful interface. You can subscribe to 5 teams maximum for free 
                and upgrade your account for more.
              </p>
            </div>
            <div className="w-2/5 flex justify-end">
              <img
                src={String(manageSubscriptions)}
                alt="Manage Subscriptions"
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-300 pb-8">
            <div className="w-2/5 flex justify-start">
              <img
                src={String(realTimeNotifications)}
                alt="Real-time Notifications"
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-2/5 text-right">
              <h2 className="text-2xl font-semibold text-gray-700">
                Real-time Notifications
              </h2>
              <p className="mt-4 text-gray-600">
                Stay updated with real-time notifications for your subscribed
                teams. Daily match results will be sent via Telegram bot. You
                can also see all season games of your team and player stats of
                game. Start chat with @nba_notifier_bot on Telegram for more
                features and details. If you send 20 commands under 1 minute,
                you will be banned for 24 hour.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-300 pb-8">
            <div className="w-2/5 text-left">
              <h2 className="text-2xl font-semibold text-gray-700">
                Simple Account Management
              </h2>
              <p className="mt-4 text-gray-600">
                Manage your account settings and update easily. Navigate through
                a clean and user friendly interface designed for simplicity and
                efficiency.
              </p>
            </div>
            <div className="w-2/5 flex justify-end">
              <img
                src={String(accountManagement)}
                alt="Account Management"
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-2/5 flex justify-start">
              <img
                src={String(dataSecurity)}
                alt="Data Security"
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-2/5 text-right">
              <h2 className="text-2xl font-semibold text-gray-700">
                Secure Payments
              </h2>
              <p className="mt-4 text-gray-600">
                We offer secure payment through Payizone. Choose upgrade plan
                that suits you best. Check out your account page for more
                details about upgrade. <a href="/account">Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
