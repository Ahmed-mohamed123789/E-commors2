import React, { useEffect, useState, useContext } from "react";
import { FaStar, FaHeart, FaCheckCircle, FaMotorcycle } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLoading } from "../../Context/LoadingContext";
import toast from "react-hot-toast";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { CartContext } from "../../CartContext/CartContext"; // ✅ استيراد الكونتكست

export default function ProductDetails() {
  const [wishListIds, setWishListIds] = useState(
    JSON.parse(localStorage.getItem("wishListIds")) || []
  );
  const { id } = useParams();
  const { setLoading } = useLoading();
  const { setCartCount, updateCart } = useContext(CartContext); // ✅ استخدام الكونتكست
const [loadingId, setLoadingId] = useState(null)

  const [productsDetails, setProductsDetails] = useState(null);
  const [addingId, setAddingId] = useState(null);

  async function getProductsDetails() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/products/" + id
      );
      setProductsDetails(data.data);
    } catch (err) {
      console.log("Error:", err);
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
    getProductsDetails();
            getWishList()

  }, [id]);

  const images = [
    productsDetails?.imageCover,
    ...(productsDetails?.images || []),
  ];

  async function addProduct(prI) {
    try {
      setAddingId(prI);
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId: prI },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );

      // ✅ تحديث العداد من السيرفر
      if (data?.numOfCartItems !== undefined) {
        setCartCount(data.numOfCartItems);
      } else {
        updateCart(1); // في حالة السيرفر مارجعش الرقم
      }

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } flex items-center gap-2 max-w-xs w-full bg-[#51a351] text-white px-4 py-4 mt-10 rounded-lg shadow-md`}
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
      {productsDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 mt-15">
          <div className="col-span-4 mr-5 flex flex-col items-center">
            <div className="relative w-full">
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                loop={true}
                grabCursor={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{
                  clickable: true,
                  el: ".custom-pagination",
                  renderBullet: (index, className) => {
                    return `<span class="${className} inline-block w-3 h-3 rounded-full bg-gray-400 mx-1 opacity-70"></span>`;
                  },
                }}
                className="w-full rounded-lg"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      className="w-full rounded-lg object-cover"
                      alt={productsDetails.title + " " + (i + 1)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="custom-pagination absolute bottom-2 left-0 right-0 flex justify-center z-10"></div>
            </div>
          </div>

          <div className="col-span-8 my-auto text-left">
            <h2 className="mb-5 text-4xl font-medium">
              {productsDetails.title}
            </h2>
            <p className="mb-5">{productsDetails.description}</p>

            <div className="flex justify-between items-center mb-5">
              <h5>{productsDetails.price + " EGP"}</h5>
              <div className="flex items-center text-yellow-500 text-lg">
                <FaStar className="mr-1" /> {productsDetails.ratingsAverage}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                className="mx-auto cursor-pointer w-[70%] text-center py-2 text-sm font-medium text-white bg-[#1fc512] rounded-lg hover:bg-[#18a20e] transition flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  if (addingId === productsDetails._id) return;
                  addProduct(productsDetails._id);
                }}
                disabled={addingId === productsDetails._id}
              >
                {addingId === productsDetails._id ? (
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
                      className="opacity-75 cursor-pointer"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                    ></path>
                  </svg>
                ) : (
                  "+Add"
                )}
              </button>


<div
  onClick={(e) => {
    e.preventDefault();
    if (loadingId === productsDetails._id) return;
    wishList(productsDetails._id);
  }}
  className="flex justify-end text-2xl transition-colors duration-200 mb-3"
>
  {loadingId === productsDetails._id ? (
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
        wishListIds.includes(productsDetails._id)
          ? "text-red-500"
          : "text-[#1f513b] hover:text-red-400"
      }`}
    />
  )}
</div>


            </div>
          </div>
        </div>
      )}
    </>
  );
}
