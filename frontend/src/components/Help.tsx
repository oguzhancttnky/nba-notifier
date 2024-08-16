import React from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";

const Help: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center py-16 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-extrabold mb-4 text-center px-4 sm:text-4xl">
          Help & Support
        </h1>
        <p className="text-lg mb-8 text-center px-4 sm:text-xl">
          Find answers to common questions and learn how to use our platform
          effectively.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 w-full max-w-4xl mx-4">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-lg mb-4">
            Our platform allows you to subscribe to your favorite NBA teams and
            receive real-time updates. Here is a quick overview of how it works:
          </p>
          <ul className="list-disc pl-6 text-lg mb-4">
            <li>Subscribe to teams you are interested in.</li>
            <li>Start chat with Telegram @nba_notifier_bot.</li>
            <li>Get your chat id with /chatid command.</li>
            <li>
              In account page fill the Telegram chat id field
              with your chat id.
            </li>
            <li>Now you will receive daily notifications for match results of your subscribed teams.</li>
            <li>
              Also you can use other commands in @nba_notifier_bot with different functionalities. 
            </li>
            <li>
              If you send 20 commands under 1 minute you will be banned for 24
              hours.
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 w-full max-w-4xl mx-4 mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-4">
            {/* FAQ Item */}
            <div>
              <h3 className="text-xl font-semibold">
                Question 1: How do I start chat with Telegram bot?
              </h3>
              <p className="text-lg">
                {/* Provide answer here */}
                To start chat with Telegram bot, search for @nba_notifier_bot in
                Telegram and use /help command to see all available commands.
              </p>
            </div>

            {/* FAQ Item */}
            <div>
              <h3 className="text-xl font-semibold">
                Question 2: How can I upgrade my subscription?
              </h3>
              <p className="text-lg">
                {/* Provide answer here */}
                You can upgrade your subscription by visiting the account page
                and selecting plans that fits your needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Question 3: How do I reset my password?
              </h3>
              <p className="text-lg">
                {/* Provide answer here */}
                If you need to reset your password click on the 'Forgot
                password?' link on the login page. Enter your registered email
                address, and you will receive a link to reset your password.{" "}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Question 4: What are the guidelines for using commands in the
                Telegram bot?
              </h3>
              <p className="text-lg">
                {/* Provide answer here */}
                To avoid being banned make sure to use the commands
                responsibly. If you send 20 commands within 1 minute you will
                be banned for 24 hours as a precaution against misuse.{" "}
              </p>
            </div>

            {/* Add more FAQs as needed */}
          </div>
        </div>

        {/* Contact for Support Section */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 w-full max-w-4xl mx-4 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          <p className="text-lg mb-4">
            If you have any other questions or need further assistance, feel
            free to reach out to our support team.
          </p>
          <p className="text-lg">
            <Link
              to="/contact"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Email Us
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
