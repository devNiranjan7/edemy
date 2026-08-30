import { UserButton, useUser } from "@clerk/clerk-react";
import { assets } from "../../assets/assets.js";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

const Navbar = () => {
    const { navigate } = useContext(AppContext);
    const { user } = useUser();
    return (
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="logo"
                className="w-28 lg:w-32"
            />
            <div className="flex items-center gap-5 text-gray-500 relative">
                <p>Hi, {user ? user.fullName : "Developers"}</p>
                {user ? (
                    <UserButton />
                ) : (
                    <img
                        src={assets.profile_img}
                        alt="profile pic"
                        className="max-w-8"
                    />
                )}
            </div>
        </div>
    );
};

export default Navbar;
