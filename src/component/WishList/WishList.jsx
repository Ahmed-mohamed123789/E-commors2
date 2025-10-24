  import axios from 'axios'
  import React, { useContext, useEffect, useState } from 'react'
  import { useLoading } from '../../Context/LoadingContext';
  import toast from 'react-hot-toast';
  import { CartContext } from '../../CartContext/CartContext';
  import { FaCheckCircle, FaMotorcycle, FaTrash } from 'react-icons/fa';

  export default function WishList() {

    const { setLoading } = useLoading();
    const { setCartCount } = useContext(CartContext);

    const [addingId, setAddingId] = useState(null);
    const [wishlist, setWishList] = useState([]);
    const [error, setError] = useState("");

    async function getWishList() {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/wishlist",
          { headers: { token: localStorage.getItem("userToken") } }
        );
        setWishList(data.data || []);
        setError("");
      } catch (err) {
        console.log(err);
        setError("حدث خطأ أثناء تحميل قائمة المفضلة ");
      } finally {
        setLoading(false);
      }
    }

 async function addProduct(prI) {
  try {
    setAddingId(prI);

    // ✅ أولاً نضيف المنتج للسلة
    const { data } = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/cart",
      { productId: prI },
      { headers: { token: localStorage.getItem("userToken") } }
    );
      console.log(data);

    await axios.delete(
      `https://ecommerce.routemisr.com/api/v1/wishlist/${prI}`,
      { headers: { token: localStorage.getItem("userToken") } }
    );

    setWishList((prev) => prev.filter((it) => it._id !== prI));

    const storedIds = JSON.parse(localStorage.getItem("wishListIds")) || [];
    const updatedIds = storedIds.filter((id) => id !== prI);
    localStorage.setItem("wishListIds", JSON.stringify(updatedIds));

    toast.success("تمت الإضافة إلى السلة 🛒 ");

    setCartCount((prev) => prev + 1);
  } catch (err) {
    console.log(err);
    toast.error("حدث خطأ أثناء الإضافة");
  } finally {
    setAddingId(null);
  }
}


    async function removeFromWishlist(id) {
      try {
        setLoading(true);
        await axios.delete(
          `https://ecommerce.routemisr.com/api/v1/wishlist/${id}`,
          { headers: { token: localStorage.getItem("userToken") } }
        );
        setWishList((prev) => prev.filter((it) => it._id !== id));
        toast.success("تم الحذف من المفضلة");
      } catch (err) {
        console.log(err);
        toast.error("فشل الحذف، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      getWishList();
    }, []);

    return (
      <div className="mt-10 gap-5 p-6">
        <div className="bg-gray-50 rounded-2xl w-full p-0 md:p-5">
          <div className="flex justify-between items-center pb-4">
            <h1 className="text-4xl font-bold text-gray-800">My Wish List</h1>
          </div>


          {wishlist.length > 0 && !error && (

          
            wishlist.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row justify-between items-center sm:items-center rounded-2xl p-6 bg-white shadow-sm mb-4"
              >
                <div className="flex flex-col sm:flex-row justify-center sm:justify-start w-full sm:w-auto">
                  <img
                    src={item.imageCover}
                    alt={item.title}
                    className="rounded-xl w-full sm:w-32 object-cover"
                  />

                  <div className="my-auto sm:ml-6 mt-3 sm:mt-0 text-left">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h2>
<div className="flex justify-between sm:flex-col sm:items-start mt-2.5 mb-5">
                      <p className="text-gray-600 font-medium mb-2">
                      {item.price} EGP
                    </p>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="text-red-500 flex items-center gap-2 cursor-pointer hover:text-red-600"
                    >
                      <FaTrash /> Remove
                    </button>
</div>
                  </div>
                </div>

                <button
                  className="border px-3 py-2.5 cursor-pointer rounded-xl border-[#51a351] text-xl"
                  disabled={addingId === item._id}
                  onClick={() => {
                    if (addingId === item._id) return;
                    addProduct(item._id);
                  }}
                >
                  {addingId === item._id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-[#51a351]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                      ></path>
                    </svg>
                  ) : (
                    "add To Cart"
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
