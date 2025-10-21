import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../Context/LoadingContext'

export default function ResPass() {
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
    const { setLoading } = useLoading();

  async function handlePass(e) {
    e.preventDefault()
    const email = localStorage.getItem("userEmail")
    const verified = localStorage.getItem("verified")

    // تحقق إن المستخدم فعلاً عمل verify قبل reset
    if (!verified || !email) {
      setError("Please verify your email before resetting password.")
      return
    }

    try {
                setLoading(true); 

      const { data } = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        { email, newPassword }
      )

      if (data.token) {
        localStorage.removeItem("verified")
        localStorage.removeItem("userEmail")
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      setError("Failed to reset password. Try again.")
    }finally {
      setLoading(false); 
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-20">
      <h2 className="text-4xl font-medium mb-6 text-left">Reset your password</h2>

      <form className="grid grid-cols-1 gap-4" onSubmit={handlePass}>
        <label htmlFor="password" className="block text-left text-gray-900">
          New Password:
        </label>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="Enter new password"
          className="border border-gray-300 p-2 rounded w-full"
          required
        />

        {error && <div className="text-[#198754]">{error}</div>}
<div>
<button
          type="submit"
          className="py-2 px-4 cursor-pointer rounded text-xl mt-4 border border-[#198754] hover:bg-[#198754] hover:text-white block duration-300"
        >
          Reset Password
        </button>
</div>
        
      </form>
    </div>
  )
}
