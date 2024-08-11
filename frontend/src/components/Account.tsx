import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import axios from "axios";
import Navbar from "./Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import TelegramIcon from "../assets/icons/telegram-icon.svg";
import EmailIcon from "../assets/icons/email-icon.svg";
import PasswordIcon from "../assets/icons/password-icon.svg";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

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
          `${process.env.REACT_APP_API_URL}/api/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
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
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/update/user/${userID}`,
          {
            email: values.email,
            password: values.password,
            chat_id: values.chatID,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
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
    <div className="mx-auto mt-5">
      <Navbar />
      <section>
        <div className="flex items-center justify-center my-8">
          <span className="text-gray-900 text-3xl font-semibold">
            Account Settings
          </span>
        </div>
        <div className="container flex items-center justify-center my-8 px-6 mx-auto">
          <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
            <div className="relative mt-6">
              <div className="flex items-center">
                <span className="absolute left-0 flex items-center pl-3">
                  <img
                    src={TelegramIcon.toString()}
                    alt="Telegram Icon"
                    className="w-6 h-6"
                  />
                </span>
                <input
                  {...formik.getFieldProps("chatID")}
                  type="text"
                  inputMode="numeric"
                  className={`${formik.touched.chatID && formik.errors.chatID ? "border-red-500" : ""}
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
                  <img
                    src={EmailIcon.toString()}
                    alt="Email Icon"
                    className="w-6 h-6"
                  />
                </span>
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  className={`${formik.touched.email && formik.errors.email ? "border-red-500" : ""}
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
                  <img
                    src={PasswordIcon.toString()}
                    alt="Password Icon"
                    className="w-6 h-6"
                  />
                </span>
                <input
                  {...formik.getFieldProps("password")}
                  type="password"
                  className={`${formik.touched.password && formik.errors.password ? "border-red-500" : ""}
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
    </div>
  );
};

export default Account;
