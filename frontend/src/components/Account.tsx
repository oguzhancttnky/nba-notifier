import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TelegramIcon, EmailIcon, PasswordIcon } from "../assets/icons/others";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { APIs } from "../helpers/constants";
import { sha256 } from "js-sha256";

const Account: React.FC = () => {
  const userID = useSelector((state: RootState) => state.auth.userID);
  const [userEmail, setUserEmail] = useState("");
  const [userChatID, setUserChatID] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.get(
          APIs.get_user_by_user_id_api + userID,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setUserEmail(response.data.email);
        setUserChatID(response.data.chat_id);
      } catch (err) {
        console.error("Get user data failed:", err);
      }
    };
    getUserData();
  }, [userID]);

  const formik = useFormik({
    initialValues: {
      chatID: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      chatID: Yup.number()
        .typeError("Chat ID must be a number")
        .positive("Invalid Chat ID")
        .integer("Invalid Chat ID"),
      email: Yup.string().email("Invalid email address"),
      password: Yup.string().min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      toast.dismiss();
      setLoading(true);
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const hashedPassword = sha256(values.password);
        await axios.put(
          APIs.update_user_by_user_id_api + userID,
          {
            email: values.email,
            password: hashedPassword,
            chat_id: values.chatID,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setLoading(false);
        toast.success("Account updated successfully");
      } catch (err: any) {
        console.error("Update failed:", err);
        setLoading(false);
        toast.error("Update failed " + err.response.data.error);
      }
    },
  });

  return (
    <Layout>
      <div className="mx-auto my-5 px-4 sm:px-6 lg:px-8">
        <section>
          <div className="flex items-center justify-center my-8">
            <span className="text-gray-900 text-2xl sm:text-3xl font-semibold dark:text-gray-100">
              Account Settings
            </span>
          </div>
          <div className="container flex items-center justify-center my-8 mx-auto">
            <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
              <div className="relative mt-6">
                <div className="flex items-center">
                  <span className="absolute left-0 flex items-center pl-3">
                    <TelegramIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  </span>
                  <input
                    {...formik.getFieldProps("chatID")}
                    type="text"
                    inputMode="numeric"
                    className={`${
                      formik.touched.chatID && formik.errors.chatID
                        ? "border-red-500"
                        : ""
                    }
            block w-full py-3 pl-12 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                    placeholder={
                      userChatID === 0
                        ? "Please enter Telegram Chat ID"
                        : userChatID.toString()
                    }
                  />
                </div>
                {formik.touched.chatID && formik.errors.chatID ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.chatID}
                  </div>
                ) : null}
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
                    placeholder={userEmail}
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

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center"
                >
                  Save Changes
                  {loading && <Spinner />}
                </button>
              </div>
            </form>
          </div>
        </section>
        <div className="text-center mt-6">
          <div className="text-pretty text-lg font-semibold dark:text-gray-200">
            Unlock exclusive features by upgrading your account!
          </div>
          <Link
            to="/upgrade"
            className="text-blue-500 hover:underline mt-4 inline-block text-lg font-medium"
          >
            Upgrade now to unlock more features!
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
