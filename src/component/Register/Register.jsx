import React, { useState } from 'react'
import { useFormik } from "formik";
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoading } from '../../Context/LoadingContext';


export default function Register() {
  const [errmasg, setErrmasg] = useState("")
  const navigate  = useNavigate()
  const { setLoading } = useLoading();
async function handleSubmit(value) {
      setLoading(true); 

  try {
    const { data } = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/auth/signup",
      value
    );
    localStorage.setItem("userInfo", JSON.stringify(value));

      navigate("/home")
  } catch (err) {
    console.log(" Error:", err.response?.data || err.message);
    setErrmasg(err.response?.data?.message)
  }finally {
      setLoading(false); 
    }
}

  const yupValidation = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*\s*$/, "Name must contain only letters"),


    email: Yup.string()
      .required("Email is required")
      .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format"),


    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and include letters, numbers, and symbols"
      ),


    rePassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match")
    ,
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number")

  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
    },
    onSubmit: handleSubmit,
    validationSchema: yupValidation
  })





  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-4 mt-20">
        <h2 className="text-4xl font-medium mb-6 text-left">register  now</h2>
        {
          errmasg &&
          <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              "email aleardy axies"
            </div>
        }
        <form className="grid grid-cols-1 gap-2" onSubmit={formik.handleSubmit}>
          <label for="name" class="block   text-gray-900 text-left  ">name :</label>
          <input
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            type="text"
            placeholder="name"
            className="border border-gra  y-300 p-2 rounded w-full"
          />
          {formik.errors.name &&formik.touched.name?
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {formik.errors.name}
            </div>
            :null
            }


          {/* email */}

          <label for="email" class="block   text-gray-900 text-left  ">Email :</label>
          <input
            {...formik.getFieldProps("email")}
            type="email"
            placeholder="email"
            className="border border-gray-300 p-2 rounded w-full"
          />

          {formik.errors.email &&formik.touched.email ?
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {formik.errors.email}
            </div>
            :null}


          {/* Pasword */}
          <label for="confirm_password" class="block text-left text-gray-900">password :</label>
          <input
            {...formik.getFieldProps("password")}

            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {formik.errors.password &&formik.touched.password ?
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {formik.errors.password}
            </div>
            :null}


          {/* REpassword */}
          <label for="rePassword" class="block  text-left text-gray-900">rePassword :</label>
          <input
            {...formik.getFieldProps("rePassword")}

            type="password"
            placeholder="rePassword"
            className="border border-gray-300 p-2 rounded w-full"
          />

          {formik.errors.rePassword &&formik.touched.rePassword?
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {formik.errors.rePassword}
            </div>
            :null}

          {/* phone */}
          <label for="rePassword" class="block  text-left text-gray-900">phone :</label>
          <input
            {...formik.getFieldProps("phone")}

            type="phone"
            placeholder="phone"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {formik.errors.phone &&formik.touched.phone?
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {formik.errors.phone}
            </div>
            :null}

          <div className='text-right'>
            
              <button type="submit"
                   disabled={!(formik.isValid && formik.dirty)}
    className={`border px-3.5 py-2 rounded-2xl text-[#3c79b7] text-xl transition-all duration-300
      ${(formik.isValid && formik.dirty)
        ? "hover:bg-[#3fa43f] hover:text-white cursor-pointer"
        : "opacity-100 "
      }`}>Register now</button>

            
          </div>

        </form>


      </div>
    </div>
  )
}
