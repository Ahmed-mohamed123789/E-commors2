import axios from "axios";
import React, { useState } from "react";

export default function CheckOut() {
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false); 

  async function CheckOut(e) {
    e.preventDefault();
        const newErrors = {}
    if (!details.trim()) newErrors.details = "من فضلك أدخل التفاصيل"
    if (!phone.trim()) newErrors.phone = "من فضلك أدخل رقم الهاتف"
    if (!city.trim()) newErrors.city = "من فضلك أدخل المدينة"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
            setIsSubmitting(true); 

      const { data: cart } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token: localStorage.getItem("userToken") } }
      );
      const pId = cart.data._id;

      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${pId}?url=http://localhost:5174`,
        {
          shippingAddress: { details, phone, city },
        },
        {
          headers: { token: localStorage.getItem("userToken") },
        }
      );

      window.location.href = data.session.url;
    } catch (error) {
      console.log(error);
    }finally {
      setIsSubmitting(false); // ✅ بعد الإرسال
    }
  }
  const isFormValid = details.trim() && phone.trim() && city.trim();

  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-4 mt-20">
        <form onSubmit={CheckOut} className="grid grid-cols-1 gap-2">
          <label htmlFor="name" className="block text-gray-900 text-left">
            Details
          </label>
          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.details && <p className="text-[#51a351] text-sm">{errors.details}</p>}

          <label htmlFor="email" className="block text-gray-900 text-left">
            Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.phone && <p className="text-[#51a351] text-sm">{errors.phone}</p>}

          <label
            htmlFor="confirm_password"
            className="block text-left text-gray-900"
          >
            City
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.city && <p className="text-[#51a351] text-sm">{errors.city}</p>}

              <div className="border border-[#61dcf5] mt-4 text-[#61dcf5] rounded-sm">
            <button
  disabled={!isFormValid || isSubmitting}
  className={`w-full p-1.5 cursor-pointer  rounded-sm flex items-center justify-center gap-2 transition ${
    !isFormValid || isSubmitting
      ? " text-gray-500 cursor-not-allowed"
      : "bg-[#0dcaf0] text-black  hover:text-black"
  }`}
>
  {isSubmitting ? (
    <svg
      className="animate-spin h-5 w-5 text-[#0dcaf0]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
      ></path>
    </svg>
  ) : (
    "Pay Now"
  )}
</button>

          </div>
        </form>
      </div>
    </div>
  );
}
