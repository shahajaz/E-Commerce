import { motion, AnimatePresence } from "framer-motion";
import {Search, ShoppingCart, Sun, Moon, User,} from "lucide-react";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import logo from "../../assets/logo.png";
import {toggleSearchBar, toggleAuthPopup, toggleCart,} from "../../store/slices/popupSlice";

export default function OverlayMenu({
   isOpen,
  onClose,
  cartItemCount = 0,
}) {
  const [active, setActive] = useState("home");
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Shop", id: "shop" },
    { name: "Brands", id: "brands" },
    { name: "Latest", id: "latest" },
    { name: "Contact", id: "contact" },
  ];

  const handleClick = (id) => {
    setActive(id);

    const section = document.getElementById(id);

    onClose();

    setTimeout(() => {
      section?.scrollIntoView({
        behavior: "smooth",
      });
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          {/* ================= TOP BAR ================= */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 object-contain"/>
                <span className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 hover:scale-105">ShopSphere</span>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center
              bg-white/5 border border-white/10 
              transition-all duration-300 cursor-pointer">
              <MdClose
                className="text-white"
                size={30}
              />
            </button>
          </div>

          {/* ================= NAVIGATION ================= */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >

            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleClick(item.id)}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{
                  duration: .4,
                }}
                className="relative px-10 py-3 rounded-full cursor-pointer"
              >

                {active === item.id && (
                  <motion.div
                    layoutId="mobile-nav"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 shadow-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 25,}}
                  />
                )}

                <span
                  className={`relative z-10 text-3xl font-semibold ${
                    active === item.id
                      ? "text-white"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </span>

              </motion.button>
            ))}

          </motion.div>

          {/* ================= BOTTOM ICONS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="pb-8 flex justify-center"
          >
            <div
              className="flex items-center gap-5
              rounded-full
              border border-white/10
              bg-white/5
              backdrop-blur-xl
              px-7 py-3"
            >
              {/* Search */}
              <button
                onClick={() => {
                  dispatch(toggleSearchBar());
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <Search className="w-6 h-6 text-white hover:text-orange-600" />
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-white" />
                )}
              </button>

              {/* User */}
              <button
                onClick={() => {
                  dispatch(toggleAuthPopup());
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <User className="w-6 h-6 text-white hover:text-orange-600" />
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  dispatch(toggleCart());
                  onClose();
                }}
                className="relative p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6 text-white hover:text-orange-600" />

                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1
                    flex items-center justify-center
                    w-5 h-5
                    rounded-full
                    bg-orange-600
                    text-white
                    text-xs
                    font-semibold"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}