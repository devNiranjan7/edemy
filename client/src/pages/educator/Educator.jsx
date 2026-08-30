import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar.jsx";
import Sidebar from "../../components/educator/Sidebar.jsx";
import Footer from "../../components/educator/Footer.jsx";

const Educator = () => {
    return (
        <div className="text-default min-h-screen bg-white">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1">{<Outlet />}</div>
            </div>
            <Footer />
        </div>
    );
};

export default Educator;
