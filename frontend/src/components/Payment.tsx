import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Layout from "./Layout";
import { apiEndpoints } from "../helpers/constants";

interface PaymentFormValues {
  name: string;
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  amount: number;
  installment: number;
}

const initialValues: PaymentFormValues = {
  name: "",
  number: "",
  expiry_month: "",
  expiry_year: "",
  cvv: "",
  amount: 0,
  installment: 1,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Cardholder name is required"),
  number: Yup.string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be exactly 16 digits"),
  expiry_month: Yup.string()
    .required("Expiry month is required")
    .matches(/^\d{2}$/, "Expiry month must be exactly 2 digits"),
  expiry_year: Yup.string()
    .required("Expiry year is required")
    .matches(/^\d{2}$/, "Expiry year must be exactly 2 digits"),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

interface PaymentProps {
  planType: string;
}

const Payment: React.FC<PaymentProps> = ({ planType }) => {
  const [loading, setLoading] = useState(false);
  const userID = useSelector((state: RootState) => state.auth.userID);
  const amount = planType === "Deluxe" ? 2 : 1;
  
  const handleSubmit = async (values: PaymentFormValues) => {
    try {
      toast.dismiss();
      setLoading(true);
      const response = await axios.post(
        apiEndpoints.payizone_payment_api_endpoint,
        {
          user_id: userID,
          card_holder: values.name,
          card_number: values.number,
          exp_month: values.expiry_month,
          exp_year: values.expiry_year,
          cvv: values.cvv,
          amount: amount,
          installment: 1,
        }
      );
      setLoading(false);
      const redirect_url = response.data.redirect_url;
      window.location.href = redirect_url;
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.error);
      console.error("Payment failed:", error);
    }
  };

  return (
    <Layout>
      <div className="mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-center mb-6 dark:text-gray-100">
              ${amount}/monthly {planType} Subscription Payment
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Cardholder Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Card Number
                  </label>
                  <Field
                    type="text"
                    name="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="number"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="expiry_month"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Expiry Month
                    </label>
                    <Field
                      type="text"
                      name="expiry_month"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="expiry_month"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="expiry_year"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Expiry Year
                    </label>
                    <Field
                      type="text"
                      name="expiry_year"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="expiry_year"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      CVV
                    </label>
                    <Field
                      type="text"
                      name="cvv"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="cvv"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    Submit Payment
                    {loading && <Spinner />}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
