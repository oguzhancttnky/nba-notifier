import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface NewPasswordProps {
  token: string;
}

const NewPassword: React.FC<NewPasswordProps> = ({ token }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
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
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/resetpassword/${token}`,
          {
            new_password: values.password,
          }
        );

        if (response.data.success) {
          setLoading(false);
          toast.success("Password reset successfully.");
          navigate("/login");
        } else {
          setLoading(false);
          toast.error("Failed to reset password.");
        }
      } catch (error: any) {
        setLoading(false);
        console.error("Password reset failed", error);
        toast.error(error.response.data.error);
      }
    },
  });

  return (
    <section>
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            Set New Password
          </h2>

          <div className="relative mt-6">
            <input
              {...formik.getFieldProps("password")}
              type="password"
              className={`${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              } 
            block w-full py-3 pl-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
              placeholder="New Password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="relative mt-6">
            <input
              {...formik.getFieldProps("confirmPassword")}
              type="password"
              className={`${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : ""
              } 
            block w-full py-3 pl-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 
            focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
              placeholder="Confirm New Password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Reset Password
              {loading && <Spinner />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewPassword;
