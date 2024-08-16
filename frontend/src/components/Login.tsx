import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  subscribe,
  toInital,
} from "../features/subscriptions/subscriptionsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import { LogoIcon, EmailIcon, PasswordIcon } from "../assets/icons/others";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { apiEndpoints } from "../constants";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      toast.dismiss();
      setLoading(true);
      dispatch(toInital());
      try {
        const response = await axios.post(apiEndpoints.login_api_endpoint, {
          email: values.email,
          password: values.password,
        });

        if (response.data.success) {
          const userID = response.data.userID;
          const jwtToken = response.data.token;
          localStorage.setItem("jwtToken", jwtToken);
          dispatch(login(userID));
          axios
            .get(
              apiEndpoints.get_subscriptions_by_user_id_api_endpoint + userID,
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            )
            .then((response) => {
              const dbsubs = response.data.subscriptions;
              if (dbsubs !== null) {
                for (let i = 0; i < dbsubs.length; i++) {
                  const team = dbsubs[i];
                  dispatch(subscribe(team));
                }
              }
            })
            .catch((error) =>
              console.error("Error fetching subscriptions:", error)
            );
          setLoading(false);
          navigate("/home");
          toast.success("Login successful");
        }
      } catch (error) {
        console.error("Login failed", error);
        setLoading(false);
        toast.error("Login failed");
      }
    },
  });

  return (
    <section>
      <Link
        to={"/features"}
        className="flex justify-center items-center text-4xl font-extrabold text-gray-800 dark:text-gray-200 text-center my-36"
      >
        Explore Our Features
      </Link>
      <div className="container flex items-center justify-center px-6 mx-auto">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
          <div className="flex items-center justify-center">
            <LogoIcon className="w-8 h-8 mr-2 text-gray-900 dark:text-gray-100" />
            <span className="text-gray-900 dark:text-gray-100 text-3xl font-semibold">
              NBA Notifier
            </span>
          </div>

          <div className="flex items-center justify-center mt-6">
            <Link
              to="/login"
              className="w-1/3 pb-4 font-medium text-center text-gray-800 dark:text-gray-200 capitalize border-b-2 border-blue-500 dark:border-blue-400"
            >
              sign in
            </Link>
            <Link
              to="/register"
              className="w-1/3 pb-4 font-medium text-center text-gray-600 dark:text-gray-400 capitalize border-b dark:border-gray-400"
            >
              sign up
            </Link>
          </div>

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

          <div className="relative mt-6">
            <div className="flex items-center">
              <span className="absolute left-0 flex items-center pl-3">
                <PasswordIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </span>
              <input
                {...formik.getFieldProps("password")}
                type="password"
                className={`${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                } 
                block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
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
          <Link
            to="/resetpassword"
            className="flex justify-end text-sm text-blue-500 dark:text-blue-400 hover:underline mt-4"
          >
            Forgot password?
          </Link>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Sign In
              {loading && <Spinner />}
            </button>

            <div className="mt-6 text-center dark:text-gray-200">
              Don't you have an account?
              <a
                href="/register"
                className="ml-1 text-sm text-blue-500 dark:text-blue-400 hover:underline"
              >
                Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
