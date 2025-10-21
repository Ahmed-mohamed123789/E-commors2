import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../Context/LoadingContext";

export default function Brands() {
  const { setLoading } = useLoading();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openModel, setOpenModel] = useState(false);

  async function getbrands() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/brands");
      setBrands(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getbrands();
  }, []);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setOpenModel(true);
  };

  return (
    <>
      <div className="mt-20 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((bra) => (
          <div
            key={bra._id}
            onClick={() => handleBrandClick(bra)}
            className="shadow transform   transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_4px_15px_#7aa77a] cursor-pointer"
          >
            <img
              src={bra.image}
              alt={bra.name}
              className="w-full h-75 rounded-lg object-cover"
            />
            <h2
              className="h-20 flex justify-center items-center w-full rounded-lg bg-white border border-blue-100 text-[#198754] text-center text-2xl font-medium"
            >
              {bra.name}
            </h2>
          </div>
        ))}
      </div>

{/* ✅ Alert فوق الصفحة */}
{openModel && selectedBrand && (
  <div className="fixed inset-0 flex items-start justify-center z-50">
    {/* خلفية شفافة تغطي الشاشة بالكامل */}
    <div className="absolute inset-0  bg-black/20 backdrop-blur-[1px]"></div>

    {/* محتوى الأليرت */}
    <div className="relative h-[250px] mt-8 bg-white rounded-2xl shadow-lg  w-[500px] border border-green-200 animate-[fadeIn_0.3s_ease-in-out] z-50 flex flex-col items-center text-center">
      {/* زرار × */}  
      <button
        onClick={() => setOpenModel(false)}
        className="absolute top-2 right-3 cursor-pointer text-gray-400 text-2xl font-bold hover:text-gray-600"
      >
        ×
      </button>

      {/* محتوى النص والصورة */}
      <div className="flex justify-between items-center mt-auto w-full">
        <div className="">
        <h3 className="text-5xl ml-4 font-sm text-green-600">
          {selectedBrand.name}
        </h3>
        <p className="text-gray-500 text-lg mb-4">{selectedBrand.slug}</p>
        </div>

        
        <img
          src={selectedBrand.image}
          alt={selectedBrand.name}
          className="w-40 mb-6"
        />

      </div>

      {/* الزرار في النص تحت */}
      <button
        onClick={() => setOpenModel(false)}
        className="bg-gray-600 text-white cursor-pointer mt-auto ml-auto mr-4 mb-4 px-5 py-2 rounded-md hover:bg-gray-700 transition "
      >
        Close
      </button>
    </div>
  </div>
)}

    </>
  );
}
