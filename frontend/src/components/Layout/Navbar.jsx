import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { TiThMenu } from "react-icons/ti";
import OverlayMenu from "./OverlayMenu";
import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {toggleSidebar, toggleSearchBar, toggleAuthPopup, toggleCart,} from "../../store/slices/popupSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();

  const cartItemCount = 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Shop", id: "shop" },
    { name: "Brands", id: "brands" },
    { name: "Latest", id: "latest" },
    { name: "Contact", id: "contact" },
  ];

  // ✅ SCROLL SPY (AUTO ACTIVE SECTION)
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "home";

      navItems.forEach((item) => {
        const section = document.getElementById(item.id);

        if (section) {
          const rect = section.getBoundingClientRect();

          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = item.id;
          }
        }
      });

      setActive(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR (ALWAYS VISIBLE) */}
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-10 py-2 z-[999] backdrop-blur-md shadow-md transition-all duration-300 ${
        theme === "dark" ? "bg-slate-900/80 border-b border-slate-700"
        : "bg-amber-50/80 border-b border-gray-200"
        }`}>

        {/* LOGO */}
        <a href="#home" className="flex items-center cursor-pointer">
          <img
            src={logo} alt="logo"
            className="w-18 h-18 object-contain transition-all duration-300 hover:scale-110"/>
            <span className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 hover:scale-105"></span>
        </a>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center bg-orange-600 px-4 py-2 rounded-full gap-2 border border-orange-600">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();  // 🔥 prevent default jump
                setActive(item.id); // 🔥 instant highlight

                const section = document.getElementById(item.id);
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative px-2 py-2 text-xl font-xl">

              {/* ACTIVE BACKGROUND */}
              {active === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white border-2 border-yellow-400 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 25}}/>
              )}

              <span className="relative z-10 text-black">
                {item.name}
              </span>

            </a>
          ))}
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* Search Overlay */}
          <button
            onClick={() => dispatch(toggleSearchBar())}
            className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer">
            <Search className="w-5 h-5 text-white hover:text-orange-700" />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer">
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
              <Moon className="w-5 h-5 text-white" />
              )}
          </button>
          
          {/* User Profile */}
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer">
              <User className="w-5 h-5 text-white hover:text-orange-700" />
          </button>
          
          {/* Cart */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer">
              <ShoppingCart className="w-5 h-5 text-white hover:text-orange-700" />
              
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
          </button>
        </div>


        {/* MOBILE MENU BUTTON */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-white text-2xl 
            rounded-full bg-black border-2 border-white/20 cursor-pointer">
            <TiThMenu />
          </button>
        </div>

      </nav>

      {/* MOBILE MENU */}
      <OverlayMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

