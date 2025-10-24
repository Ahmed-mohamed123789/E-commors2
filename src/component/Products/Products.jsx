import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { FaHeart, FaStar, FaCheckCircle, FaMotorcycle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLoading } from "../../Context/LoadingContext";
import toast from "react-hot-toast";
import { CartContext } from "../../CartContext/CartContext";

export default function Products() {
  const [wishListIds, setWishListIds] = useState(
    JSON.parse(localStorage.getItem("wishListIds")) || []
  );
  const { setLoading } = useLoading();
  const { updateCart } = useContext(CartContext);

  const [quary, setQuary] = useState("");
  const [result, setResult] = useState([]);
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null); // 👈 الجديد هنا
const [loadingId, setLoadingId] = useState(null)

  async function getProducts() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/products"
      );
      setProducts(data.data);
    } catch (err) {
      console.log("errors", err);
    } finally {
      setLoading(false);
    }
  }

  async function wishList(prI) {
  setLoadingId(prI);
  try {
    if (wishListIds.includes(prI)) {
      // ✅ لو المنتج موجود بالفعل → نحذفه
      await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${prI}`, {
        headers: { token: localStorage.getItem("userToken") },
      });

      const updatedIds = wishListIds.filter((id) => id !== prI);
      setWishListIds(updatedIds);
      localStorage.setItem("wishListIds", JSON.stringify(updatedIds)); // ← الخطوة التالتة هنا

      toast("تم الحذف من المفضلة 💔", {
        icon: "🗑️",
      });
    } else {
      // ✅ لو المنتج مش موجود → نضيفه
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId: prI },
        { headers: { token: localStorage.getItem("userToken") } }
      );

      const updatedIds = [...wishListIds, prI];
      setWishListIds(updatedIds);
      localStorage.setItem("wishListIds", JSON.stringify(updatedIds)); // ← والخطوة دي برضو هنا

      toast.success("تمت الإضافة إلى المفضلة ❤️");
    }
  } catch (error) {
    console.log(error);
    toast.error("حدث خطأ أثناء العملية 😔");
  } finally {
    setLoadingId(null);
  }
}

  async function getWishList() {
  try {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      { headers: { token: localStorage.getItem("userToken") } }
    );
    setWishListIds(data.data.map((item) => item._id)); // نخزن بس الـ IDs
    localStorage.setItem("wishListIds", JSON.stringify(data.data.map((item) => item._id)));

  } catch (err) {
    console.log(err);
  }
}

  useEffect(() => {
    getProducts();
        getWishList()

  }, []);

  useEffect(() => {
    if (!quary.trim()) {
      setResult([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(quary.toLowerCase())
      );
      setResult(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [quary, products]);

  async function addProductToCart(productId) {
    setAddingId(productId);
    try {
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        { headers: { token: localStorage.getItem("userToken") } }
      );
      updateCart(1);

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } flex items-center gap-2 mt-10 max-w-xs w-full bg-[#51a351] text-white px-4 py-2 rounded-lg shadow-md`}
        >
          <FaCheckCircle className="text-white" />
          <FaMotorcycle className="text-red-300" />
          <span>It has been successfully added.</span>
        </div>
      ));
    } catch (err) {
      console.log(err);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <>
      <form className="max-w-5xl mt-30 mb-16 mx-auto w-full">
        <div className="w-full">
          <input
            type="search"
            id="search"
            value={quary}
            onChange={(e) => setQuary(e.target.value)}
            className="mb-10 shadow-sm w-full p-2.5 text-sm rounded-lg"
            placeholder="Search..."
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {(result.length ? result : products).map((product) => (
          <Link
            key={product._id}
            to={`/productDetails/${product._id}`}
            onTouchStart={() => setHoveredId(product._id)} // 👈 يشتغل للموبايل
            onMouseEnter={() => setHoveredId(product._id)} // 👈 يشتغل للكمبيوتر
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`group flex flex-col rounded-lg shadow-sm transform transition duration-300 h-full 
              ${
                hoveredId === product._id
                  ? "scale-[1.03] shadow-[0_4px_15px_#7aa77a]"
                  : ""
              } 
              hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_4px_15px_#7aa77a]
              `}
            >
              <img
                className="rounded-t-lg w-full"
                src={product.imageCover}
                alt={product.title}
              />

              <div className="p-4 flex-grow flex flex-col">
                <h5 className="mb-1 text-sm font-medium text-[#4fa782] text-left">
                  {product.slug}
                </h5>

                <h2 className="mb-2 text-sm text-left text-dark leading-snug">
                  {product.title}
                </h2>

                <div className="flex justify-between items-center w-full mb-3">
                  <p className="text-gray-900 font-medium text-sm">
                    {product.price}
                  </p>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <FaStar className="mr-1" /> {product.ratingsAverage}
                  </div>
                </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        if (loadingId === product._id) return;
                        wishList(product._id);
                      }}
                      className="flex justify-end text-2xl transition-colors duration-200 mb-3"
                    >
                      {loadingId === product._id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-[#4fa782]"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                          ></path>
                        </svg>
                      ) : (
                        <FaHeart
                          className={`cursor-pointer transition-colors duration-300 ${
                            wishListIds.includes(product._id)
                              ? "text-red-500"
                              : "text-[#1f513b] hover:text-red-400"
                          }`}
                        />
                      )}
                    </div>

                <button
                  className={`
                    mt-auto cursor-pointer flex justify-center items-center 
                    w-full py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800
                    transition-all duration-500 ease-out
                    ${
                      hoveredId === product._id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-24"
                    }
                    sm:opacity-0 sm:translate-y-24 sm:group-hover:opacity-100 sm:group-hover:translate-y-0
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (addingId === product._id) return;
                    addProductToCart(product._id);
                  }}
                  disabled={addingId === product._id}
                >
                  {addingId === product._id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                      ></path>
                    </svg>
                  ) : (
                    "+Add"
                  )}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
