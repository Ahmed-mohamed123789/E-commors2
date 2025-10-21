import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import "flowbite";
import { LoadingProvider } from "./Context/LoadingContext.jsx";
import Swiper from 'swiper';

import 'flowbite';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartProvider from "./CartContext/CartContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <CartProvider>
      <App />


      </CartProvider>
    </LoadingProvider>
  </StrictMode>
);
