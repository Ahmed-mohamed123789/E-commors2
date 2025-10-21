import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../Context/LoadingContext";

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
    const { setLoading } = useLoading();
  

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  async function handleSubmit(value) {
          setLoading(true); 

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        value
      );

      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        navigate("/home");
      }
    } catch (error) {
      const savedUser = JSON.parse(localStorage.getItem("userInfo"));
console.log(error);
      if (
        savedUser &&
        savedUser.email === value.email &&
        savedUser.password === value.password
      ) {
        navigate("/home");
      } else {
        setErrorMessage("Email or password is incorrect");
      }
    }finally {
      setLoading(false); 
    }
  }
useEffect(() => {
  const token = localStorage.getItem("userToken");
  if (token) {
    navigate("/home"); 
  }
}, [navigate]);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });



  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 mt-20">
        <h2 className="text-4xl font-medium mb-6 text-left">login now</h2>

        <form className="grid grid-cols-1 gap-1 md:gap-2" onSubmit={formik.handleSubmit}>
          <label
            htmlFor="email"
            className="block text-gray-900 text-left"
          >
            Email :
          </label>
          <input
            {...formik.getFieldProps("email")}
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded w-full"
          />

          {formik.touched.email && formik.errors.email && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">{formik.errors.email}</span>
            </div>
          )}

          <label
            htmlFor="password"
            className="block mt-5 text-left text-gray-900"
          >
            password :
          </label>
          <input
            {...formik.getFieldProps("password")}
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded w-full"
          />

          {formik.touched.password && formik.errors.password && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">{formik.errors.password}</span>
            </div>
          )}

          {errorMessage && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between mt-5 gap-3">
  <h2
    onClick={() => {
      setLoading(true);
      setTimeout(() => {
        navigate("/forgtpassword");
        setLoading(false);
      }, 500);
    }}
    className="block md:inline-block text-2xl font-normal hover:text-[#3fa43f] transition-colors duration-200 cursor-pointer"
  >
    forget your password ?
  </h2>

  <button
    type="submit"
    className="block md:inline-block py-1.5 px-3 cursor-pointer rounded text-xl border border-[#198754] hover:bg-[#198754] hover:text-white duration-300"
  >
    login now
  </button>
</div>

        </form>
      </div>
    </>
  );
}
