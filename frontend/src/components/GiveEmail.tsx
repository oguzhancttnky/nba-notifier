import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { APIs } from "../helpers/constants";
import { EmailIcon } from "../assets/icons/others";

const GiveEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      toast.dismiss();
      setLoading(true);
      try {
        const response = await axios.post(
          APIs.forgot_password_send_email_api,
          {
            email: values.email,
          }
        );
        if (response.data.success) {
          setLoading(false);
          toast.success("Password reset link sent to your email.");
        }
      } catch (error: any) {
        setLoading(false);
        toast.error(error.response.data.error);
      }
    },
  });

  return (
    <section>
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Enter your email address
          </h2>
          <div className="relative mt-6">
            <div className="flex items-center">
              <span className="absolute left-0 flex items-center pl-3">
                <EmailIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </span>
              <input
                {...formik.getFieldProps("email")}
                type="email"
                className={`${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                } 
                  block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600
                  focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                placeholder="Email address"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Send Reset Link
              {loading && <Spinner />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default GiveEmail;
