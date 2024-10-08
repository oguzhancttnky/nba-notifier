import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { LogoIcon, EmailIcon, PasswordIcon } from "../assets/icons/others";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { APIs } from "../helpers/constants";
import Footer from "./Footer";
import { sha256 } from "js-sha256";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      toast.dismiss();
      setLoading(true);
      const hashedPassword = sha256(values.password);
      try {
        const response = await axios.post(APIs.register_api, {
          email: values.email,
          password: hashedPassword,
        });

        if (response.data.success) {
          setLoading(false);
          navigate("/login");
          toast.success("Registration successful");
        }
      } catch (error: any) {
        console.error("Registration failed", error);
        setLoading(false);
        toast.error("Registration failed " + error.response.data.error);
      }
    },
  });

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Link
          to={"/features"}
          className="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-200 text-center my-24 sm:my-36"
        >
          Explore Our Features
        </Link>
        <div className="container flex items-center justify-center px-6 mx-auto">
          <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
            <div className="flex items-center justify-center">
              <LogoIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-gray-900 dark:text-gray-100" />
              <span className="text-gray-900 dark:text-gray-100 text-2xl sm:text-3xl font-semibold">
                NBA Notifier
              </span>
            </div>

            <div className="flex items-center justify-center mt-6">
              <Link
                to="/login"
                className="w-1/3 pb-4 font-medium text-center text-gray-600 dark:text-gray-400 capitalize border-b dark:border-gray-400"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="w-1/3 pb-4 font-medium text-center text-gray-800 dark:text-gray-200 capitalize border-b-2 border-blue-500 dark:border-blue-400"
              >
                Sign Up
              </Link>
            </div>

            <div className="relative mt-6">
              <div className="flex items-center">
                <span className="absolute left-0 flex items-center pl-3">
                  <EmailIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                </span>
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  className={`${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : ""
                  } 
                    block w-full py-2 sm:py-3 pl-10 sm:pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600
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

            <div className="relative mt-6">
              <div className="flex items-center">
                <span className="absolute left-0 flex items-center pl-3">
                  <PasswordIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                </span>
                <input
                  {...formik.getFieldProps("password")}
                  type="password"
                  className={`${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : ""
                  } 
                  block w-full py-2 sm:py-3 pl-10 sm:pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
                  focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                  placeholder="Password"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <div className="relative mt-6">
              <div className="flex items-center">
                <span className="absolute left-0 flex items-center pl-3">
                  <PasswordIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                </span>
                <input
                  {...formik.getFieldProps("confirmPassword")}
                  type="password"
                  className={`${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  } 
                  block w-full py-2 sm:py-3 pl-10 sm:pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
                  focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                  placeholder="Password"
                />
              </div>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-2 sm:py-3 text-sm sm:text-base font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                Sign Up
                {loading && <Spinner />}
              </button>

              <div className="mt-6 text-center dark:text-gray-200">
                <Link
                  to="/login"
                  className="ml-1 text-sm sm:text-base text-blue-500 dark:text-blue-400 hover:underline"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Register;
