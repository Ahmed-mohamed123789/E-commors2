import { faCartShopping, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../../CartContext/CartContext";

export default function NavHome() {
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("userToken");
    navigate("/");
  }

  return (
    <nav className="bg-[#f8f9fa] shadow fixed w-full z-20 top-0 start-0 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* 🔹 اللوجو */}
        <a href="#" className="flex items-center rtl:space-x-reverse">
          <FontAwesomeIcon
            icon={faCartShopping}
            className="nav-icon text-[#4fa74f] text-4xl"
          />
          <span className="self-center text-3xl text-black font-semibold whitespace-nowrap">
            fresh cart
          </span>
        </a>

        {/* 🔹 زرار التوجل */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className=" items-center p-2 w-10 h-10 justify-center text-sm text-[#323232] rounded-lg md:hidden hover:bg-gray-200 focus:outline-none block"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-2xl" />
        </button>

        {/* 🔹 الروابط + الأيقونة + اللوج آوت */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col md:p-0 mt-4 ml-5 md:ml-0 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 text-left md:text-center md:items-center">
            <li>
              <NavLink
                to="/home"
                onClick={() => setIsOpen(false)}
                className="block text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="cart"
                onClick={() => setIsOpen(false)}
                className="block relative text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                Cart
              </NavLink>
            </li>
            <li>
              <NavLink
                to="wishList"
                onClick={() => setIsOpen(false)}
                className="block relative text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                wish list
              </NavLink>
            </li>

            <li>
              <NavLink
                to="products"
                onClick={() => setIsOpen(false)}
                className="block text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                Products
              </NavLink>
            </li>

            <li>
              <NavLink
                to="categories"
                onClick={() => setIsOpen(false)}
                className="block text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                Categories
              </NavLink>
            </li>

            <li>
              <NavLink
                to="brands"
                onClick={() => setIsOpen(false)}
                className="block text-[15px] font-normal py-2 text-[#323232] hover:text-[#000000]"
              >
                Brands
              </NavLink>
            </li>
          </ul>

          <div className="flex flex-col items-center justify-center mt-5 space-y-4 md:hidden">
            <Link to="/cart" onClick={() => setIsOpen(false)} className="relative">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-4xl text-[#323232]"
              />
              <span className="absolute -top-3 -right-3 bg-[#4fa74f] text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              type="button"
              className="text-[#323232] hover:text-[#161414] cursor-pointer font-normal text-[15px] py-2 text-center"
            >
              log out
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:order-2 items-center">
          <div className="relative mr-4">
            <Link to="/cart" className="relative">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-3xl text-[#323232]"
              />
              <span className="absolute -top-5 -right-1 bg-[#4fa74f] text-white text-lg w-6 h-6 rounded flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            className="text-[#323232] hover:text-[#161414] cursor-pointer font-normal text-[15px] py-2 text-center"
          >
            log out
          </button>
        </div>
      </div>
    </nav>
  );
}
