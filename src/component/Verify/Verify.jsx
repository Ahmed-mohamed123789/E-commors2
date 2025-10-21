import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../Context/LoadingContext'

export default function Verify() {
  const [resetCode, setResetCode] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
    const { setLoading } = useLoading();

  async function handleCode() {
              setLoading(true); 

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        { resetCode }
      )

      console.log(data)

      if (data.status === "Success") {
          localStorage.setItem("verified", "true")

        navigate("/resetpassword")
      }
    } catch (error) {
      console.log(error)
      setError("Invalid or expired code. Try again.")
      setResetCode("")
    }finally {
      setLoading(false); 
    }
  }

  return (
    <>
      <form className="grid grid-cols-1 gap-2 mt-10">
        <div>
          <label
            htmlFor="code"
            className="block text-gray-900 text-left mb-4 text-4xl font-medium"
          >
            Reset your account password
          </label>

          <input
            type="text"
            placeholder="Enter your verification code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            className="border border-gray-300 p-4 rounded w-full"
          />
        </div>

        {error && (
          <div className="text-[#198754]">{error}</div>
        )}

<div>
          <button
          type="button"
          onClick={handleCode}
          className="py-1.5 px-2 cursor-pointer rounded text-xl mt-4 border border-[#198754] hover:bg-[#198754] hover:text-white block duration-300 "
        >
          Verify
        </button>
</div>
      </form>
    </>
  )
}
