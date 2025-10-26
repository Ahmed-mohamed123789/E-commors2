import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function NavLogin() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  // علشان نضمن إنها مقفولة أول ما الصفحة تتفتح
  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <div>
      <nav className="bg-white z-[1000]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-0">
          <Link to="/" className="flex items-center" onClick={handleClose}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="nav-icon text-[#4fa74f] text-4xl"
            />
            <span className="self-center text-black text-3xl font-medium whitespace-nowrap">
              fresh cart
            </span>
          </Link>

          <button
            onClick={handleToggle}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={isOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div
            className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <NavLink
                  to="register"
                  onClick={handleClose}
                  className="block py-2 px-3 text-[#000000a6] hover:text-[#000000db] rounded-sm md:p-0"
                >
                  register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  onClick={handleClose}
                  className="block py-2 md:p-0 text-[#000000a6] px-3 rounded-sm hover:text-[#000000db]"
                >
                  log in
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
