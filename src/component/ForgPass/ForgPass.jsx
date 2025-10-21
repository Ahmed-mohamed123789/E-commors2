import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../Context/LoadingContext'

export default function ForgPass() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
    const { setLoading } = useLoading();

  async function sendCode() {
    setLoading(true); 
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        { email }
      )
      if (data.statusMsg === "success") {
        localStorage.setItem("userEmail", email)
        navigate("/verify")
      }
    } catch (error) {
      console.log(error)
      setError("Email not found, please try again")
      setEmail("")
    }finally {
      setLoading(false); 
    }
  }

  return (
    <form className="grid grid-cols-1 gap-2 mt-10">
      <div>
        <label
          htmlFor="email"
          className="block text-gray-900 text-left mb-4 text-4xl font-medium"
        >
          please enter your verification email
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-4 rounded w-full"
        />
      </div>

      {error && <p className="text-[#198754]">{error}</p>}

<div>
        <button
        type="button"
        onClick={sendCode}
        className="py-1.5 px-2 cursor-pointer rounded text-xl mt-4 border border-[#198754] hover:bg-[#198754] hover:text-white duration-300 block"
      >
        Send Verification Code
      </button>
</div>
    </form>
  )
}
