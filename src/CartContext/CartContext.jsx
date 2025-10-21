import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  // 🔹 تجيب العدد من الـ API
  async function getCartCount() {
    try {
      const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token: localStorage.getItem("userToken") },
      });
      setCartCount(data?.numOfCartItems || 0);
    } catch (err) {
      console.log(err);
    }
  }

  // 🔹 تستدعيها أول مرة لما المستخدم يدخل
  useEffect(() => {
    getCartCount();
  }, []);

  // 🔹 دالة علشان تحدث العدد يدويًا بعد إضافة أو حذف
  async function refreshCart() {
    await getCartCount();
  }

  // 🔹 أو تحدثه محليًا بعد Add / Remove بسيط
  function updateCart(change) {
    setCartCount(prev => Math.max(prev + change, 0));
  }

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
