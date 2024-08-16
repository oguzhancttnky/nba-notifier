import React from "react";
import { Link } from "react-router-dom";
interface PaymentResultProps {
  status: "success" | "fail";
}

const PaymentResult: React.FC<PaymentResultProps> = ({ status }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center dark:bg-gray-900">
        {status === "success" ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
            <p className="text-gray-700 mb-6 dark:text-gray-300">Your payment was processed successfully. Thank you for your purchase!</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
            >
              Return to Home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
            <p className="text-gray-700 mb-6 dark:text-gray-300">There was an issue with your payment. Please try again later.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
            >
              Return to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
