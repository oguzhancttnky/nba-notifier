import React from "react";
import Layout from "./Layout";

const Contact: React.FC = () => {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center py-16 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-extrabold mb-4 text-center px-4 sm:text-4xl">
          Contact Us
        </h1>
        <p className="text-lg mb-8 text-center px-4 sm:text-xl">
          If you have any questions or need further assistance feel free to
          reach out to us.
        </p>
        <p className="text-2xl text-center">
          <a
            href="mailto:nbanotifiermail@gmail.com"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            nbanotifiermail@gmail.com
          </a>
        </p>
      </section>
    </Layout>
  );
};

export default Contact;
