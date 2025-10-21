import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './component/Login/Login'
import LayOut from './component/LayOut/LayOut'
import Register from './component/Register/Register'
import Home from './component/Home/Home'
import MainLayout from './component/MainLayout/MainLayout'
import ProductDetails from './component/ProductDetails/ProductDetails'
import Products from './component/Products/Products'
import Categories from './component/Categories/Categories'
import Brands from './component/Brands/Brands'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Cart from './component/Cart/Cart'
import { Toaster } from "react-hot-toast";
import { LoadingProvider } from './Context/LoadingContext'
import ForgPass from './component/ForgPass/ForgPass'
import Verify from './component/Verify/Verify'
import ResPass from './component/ResPass/ResPass'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgtpassword", element: <ForgPass /> },
      { path: "verify", element: <Verify /> },
      { path: "resetPassword", element: <ResPass /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "productDetails/:id", element: <ProductDetails /> },
      { path: "products", element: <Products /> },
      { path: "categories", element: <Categories /> },
      { path: "brands", element: <Brands /> },
      { path: "cart", element: <Cart /> },
    ],
  },
]);

function App() {
  return (
    <>
          <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
        <ReactQueryDevtools />
      </LoadingProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
