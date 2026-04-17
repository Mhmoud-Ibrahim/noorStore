

import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./component/Home.tsx";
import Layout from "./component/Layout.tsx";
import { HelmetProvider } from 'react-helmet-async';
import { MainProvider } from "./component/mainContext.tsx";


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./component/auth/login.tsx";
import Products from "./component/Products.tsx";
import Profile from "./component/auth/Profile.tsx";
import AddProduct from "./component/AddProduct.tsx";
import Register from "./component/auth/Register.tsx";
import ProductDetails from "./component/ProductDetails.tsx";
import Cart from "./component/Cart.tsx";
import About from "./component/ِAbout.tsx";
import Contact from "./component/Contact.tsx";
import UserManagement from "./component/UserManagement.tsx";
import ProductManagement from "./component/ProductManagement.tsx";
import UpdateProduct from "./component/UpdateProduct.tsx";
import OrderManagement from "./component/Orders.tsx";
import ForgotPassword from "./component/auth/ForgotPassword.tsx";
import ResetPassword from "./component/auth/ResetPassword.tsx";

function App() {
  let routers = createHashRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <Home /> },
        { path: 'register', element: <Register/> },
        { path: 'login', element: <Login /> },
        { path: 'home', element: <Home /> },
        { path: 'products', element: <Products /> },
        { path: 'profile', element: <Profile/> },
        { path: 'addProduct', element: <AddProduct/> },
        { path: 'productDetails/:id', element: <ProductDetails/> },
        { path: 'cart', element: <Cart/> },
        { path: 'about', element: <About/> },
        { path: 'contact', element: <Contact/> },
         {path:'/forgot-password',element:<ForgotPassword/>},
      {path:'/reset-password/:token',element:<ResetPassword/>},
        { path: 'userManagement', element: <UserManagement/> },
        { path: 'productManagement', element: <ProductManagement/> },
        { path: 'orders', element: <OrderManagement/> },
        { path: 'updateProduct/:id', element: <UpdateProduct/> },


        // { path: '*', element: <NotFound /> }
      ]
    }
  ])



  return <HelmetProvider>
    <MainProvider>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // بما أن متجرك باللغة العربية
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={routers} />
    </MainProvider>
  </HelmetProvider>


}


export default App
