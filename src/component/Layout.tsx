
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";


function Layout() {

    const navbarHeight = "3rem";
    return <>
<Navbar/>
        <main style={{ minHeight: `calc(100vh - ${navbarHeight})` }} className="bg-gray-50">
            <Outlet />
        </main>
        <Footer/>
    </>
}

export default Layout;