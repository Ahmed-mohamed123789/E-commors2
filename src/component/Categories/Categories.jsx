import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Products from '../Products/Products'
import { useLoading } from '../../Context/LoadingContext';

export default function Categories() {
        const { setLoading } = useLoading();
  
  const [categories, setCategories] = useState([])
  async function getCategories() {
                  setLoading(true); 

    try {
      const {data} =await axios.get("https://ecommerce.routemisr.com/api/v1/categories")
    setCategories(data.data)
    } catch (err) {
      console.log(err);
    }finally {
      setLoading(false); 
    }
  }


    useEffect(() => {
    getCategories()
    
    },[])
    
  
  return (
    
<>
    <div className=' mt-20 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {categories.map((cat)=>
              <div className='key={cat._id} shadow transform transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_4px_15px_#7aa77a]'>
        <img
         src={cat.image}
          alt={cat.name}
           className='w-full h-75 rounded-lg object-cover '
           onClick={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // loading لمدة ثانية
      }} />
  <h2 
  className=" h-20  flex justify-center items-center w-full rounded-lg bg-white border
   border-blue-100 text-[#198754]  text-center text-2xl font-medium"
   onClick={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // loading لمدة ثانية
      }}>
          {cat.name}</h2>
      </div>

      )}

    </div>

      <h1 className='text-[#198754] text-4xl my-8 font-medium'>Men's Fashion subcategories</h1>

    <div onClick={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // loading لمدة ثانية
      }}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        <p className='text-2xl py-5  font-medium shadow-sm rounded-sm border border-black/10 transform transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_4px_15px_#7aa77a]'>
Bags & luggage        </p>
        <p className='py-5 text-2xl font-medium shadow-2xl rounded-sm border border-black/10 transform transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_4px_15px_#7aa77a]'>
          Men's Clothing
        </p>
        
      </div>
    </div>

    </>


    
    
  )
}
