import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "../component/navbar/NavBar";
import Footer from "../component/footer/Footer";
import NewsTicker from "../component/newsTicker/NewsTicker";

function Layout() {
    return (
        <div>
            <NavBar />
            <NewsTicker />
            <Outlet />
            <Toaster />
            <Footer />
        </div>
    );
}

export default Layout;
