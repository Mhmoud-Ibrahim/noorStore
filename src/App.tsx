

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
