import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import img from "../../assets/img3.png"
import toast from "react-hot-toast"
import { useLoading } from "../../Context/LoadingContext"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../../CartContext/CartContext"

export default function Cart() {
  const { updateCart, setCartCount } = useContext(CartContext);

  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState(null)
  const { setLoading } = useLoading();

  async function getCart() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          headers: { token: localStorage.getItem("userToken") },
        }
      )
      setCartDetails(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

 async function removeItem(id) {
  setLoading(true);
  try {
    const { data } = await axios.delete(
      `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      {
        headers: { token: localStorage.getItem("userToken") },
      }
    );

    setCartDetails(data);
    toast.success("Item removed 🗑");

    if (data?.numOfCartItems !== undefined) {
      setCartCount(data.numOfCartItems);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
}


async function clearCart() {
  setLoading(true);
  try {
    await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: { token: localStorage.getItem("userToken") },
    });

    // ✅ صفّر الحالة بشكل مباشر
    setCartDetails(null);
    setCartCount(0);

    // ❌ متبعتش object لدالة بتاخد رقم
    // updateCart({ numOfCartItems: 0, data: { products: [] } });

    toast("🧺 Your cart has been cleared!", {
      icon: "🧺",
      style: {
        border: "1px solid #16a34a",
        background: "#ecfdf5",
        color: "#16a34a",
      },
    });

    // ✅ ارجع بعد ثانية علشان التوست يتعرض
    setTimeout(() => navigate("/"), 1000);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
}


  async function updateCount(productId, newCount) {
    setLoading(true)
    try {
      if (newCount < 1) return removeItem(productId) 
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count: newCount },
        {
          headers: { token: localStorage.getItem("userToken") },
        }
      )
      setCartDetails(data)
      
      if (data?.numOfCartItems !== undefined) {
        setCartCount(data.numOfCartItems);
      }
      updateCart(data);

      toast.success("Cart updated 🛺")
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  const productsArray = cartDetails?.data?.products || []

  return (
    <div className="mt-10 gap-5 p-6">
      <div className=" bg-gray-50 rounded-2xl w-full p-5 grid">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-4xl font-bold text-gray-800">Cart Shop</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-3 py-2 rounded-lg font-semibold transition">
            Check Out
          </button>
        </div>

        <div className="flex items-center justify-between text-center md:text-left mb-5">
          <p className="text-lg font-medium">
            Total Price:{" "}
            <span className="text-green-600 font-semibold">
              {cartDetails?.data?.totalCartPrice ?? 0} EGP
            </span>
          </p>
          <p className="text-lg font-medium md:text-right">
            Total Items:{" "}
            <span className="text-green-600 font-semibold">
              {cartDetails?.numOfCartItems ?? 0}
            </span>
          </p>
        </div>

        {/* Loading */}
        {productsArray.length === 0 ? (
          <p className="text-center text-gray-500 text-xl font-medium">
            Your cart is empty 🛒
          </p>
        ) : (
          productsArray.map((item, idx) => {
            const p = item.product;
            return (
              <div
                key={p._id || idx}
                className="flex flex-col sm:flex-row justify-between items-center sm:items-center rounded-2xl p-6 bg-white shadow-sm mb-4"
              >
                {/* Product Image + Info */}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-start w-full sm:w-auto">
                  <img
                    src={p.imageCover || img}
                    alt={p.title}
                    className="rounded-xl w-full sm:w-32 object-cover"
                  />

                  <div className="my-auto sm:ml-6 mt-3 sm:mt-0 text-left">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 font-medium mb-2">
                      {(item.price ?? p.price ?? 0)} EGP
                    </p>
                    <button
                      onClick={() => removeItem(p._id)}
                      className="text-red-500 flex items-center gap-1 cursor-pointer hover:text-red-600"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex sm:flex-row flex-col items-center justify-between sm:justify-center  gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                  <div className="flex items-center justify-center   gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => updateCount(p._id, item.count + 1)}
                      className="border cursor-pointer border-green-500 text-green-600 rounded px-3 py-1 hover:bg-green-50"
                    >
                      +
                    </button>

                    <span className="font-semibold text-gray-800">
                      {item.count}
                    </span>

                    <button
                      onClick={() => updateCount(p._id, item.count - 1)}
                      className="border cursor-pointer border-green-500 text-green-600 rounded px-3 py-1 hover:bg-green-50"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {productsArray.length > 0 && (
          <div className="text-center">
            <button
              onClick={clearCart}
              className="border cursor-pointer border-green-500 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 font-semibold transition"
            >
              Clear Your Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
