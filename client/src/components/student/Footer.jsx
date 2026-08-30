import { assets } from "../../assets/assets.js";

const Footer = () => {
    return (
        <footer className="bg-gray-900 xl:px-36 text-left w-full mt-10">
            <div className="flex flex-col xl:flex-row items-start px-8 xl:px-0 justify-center gap-10 xl:gap-32 py-10 border-b border-white/30">
                <div className="flex flex-col xl:items-start items-center w-full">
                    <img src={assets.logo_dark} alt="logo" />
                    <p className="mt-6 text-center md:text-left text-sm text-white/80">
                        Join our community of learners and educators to access
                        exclusive content, resources, and opportunities for
                        growth.
                    </p>
                </div>
                <div className="flex flex-col xl:items-start items-center w-full">
                    <h2 className="font-semibold text-white mb-5">Company</h2>
                    <ul className="flex xl:flex-col w-full justify-between text-sm text-white/80 xl:space-y-2">
                        <li>
                            <a href="#">Home</a>
                        </li>
                        <li>
                            <a href="#">About</a>
                        </li>
                        <li>
                            <a href="#">Contact us</a>
                        </li>
                        <li>
                            <a href="#">Privacy policy</a>
                        </li>
                    </ul>
                </div>
                <div className="hidden xl:flex flex-col items-start w-full">
                    <h2 className="font-semibold text-white mb-5">
                        Subscribe to our newsletter
                    </h2>
                    <p className="text-sm text-white/80">
                        The latest news, articles, and resources sent to your
                        inbox weekly.
                    </p>
                    <div className="flex items-center gap-2 pt-4">
                        <input
                            className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
                            type="email"
                            placeholder="Enter your email"
                        />
                        <button className="bg-blue-600 w-24 h-9 text-white rounded cursor-pointer">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center text-xs lg:text-sm text-white/60">
                Copyright {new Date().getFullYear()} © Edemy. All Right
                Reserved.
            </p>
        </footer>
    );
};

export default Footer;
