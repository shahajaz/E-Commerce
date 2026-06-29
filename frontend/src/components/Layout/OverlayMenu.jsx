// import { motion, AnimatePresence } from "framer-motion";
// import logo from "../../assets/logo.png";
// import { MdClose } from "react-icons/md";
// import { useState } from "react";

// export default function OverlayMenu({ isOpen, onClose }) {

//   const [active, setActive] = useState("home");

//   const navItems = [
//     { name: "Home", id: "home" },
//     { name: "Shop", id: "shop" },
//     { name: "Brands", id: "brands" },
//     { name: "Latest", id: "latest" },
//     { name: "Contact", id: "contact" },
//   ];

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black backdrop-blur-md z-[999] flex flex-col"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >

//           {/* TOP BAR */}
//           <div className="flex items-center justify-between px-6 py-4">

//             <div className="flex items-center gap-1">
//               <img src={Logo} className="w-12 h-12"/>
//               <span className="text-4xl font-bold bg-gradient-to-r from-[#ff00af] to-[#ffcc00] bg-clip-text text-transparent">
//                 ShopSphere
//               </span>
//             </div>

//             <div className="p-[2px] rounded-full bg-transparent 
//               hover:bg-transparent transition-all duration-300">
                
//                 <button onClick={onClose} className="flex items-center justify-center w-10 h-10 text-white text-3xl rounded-full bg-white/5 border border-white/10 
//                   transition-all duration-300 hover:bg-white/10 hover:scale-110">
//                   <MdClose />
//                 </button> 
//             </div>

//           </div>

//           <motion.div className="flex flex-col items-center justify-center flex-1 gap-5 text-lg font-semibold"
//             initial={{ y: 40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 40, opacity: 0 }}
//             transition={{ duration: 0.4 }}>
              
//               {navItems.map((item) => (
//                 <button key={item.id} onClick={() => {
//                   setActive(item.id);
//                   const section = document.getElementById(item.id);
//                   onClose();
                  
//                   setTimeout(() => {section?.scrollIntoView({ behavior: "smooth" });}, 200);
//                 }}
//                 className="relative px-4 py-2 rounded-full">
                  
//                   {active === item.id && (
//                     <motion.div className="absolute inset-0 rounded-full 
//                       bg-gradient-to-r from-[#ff00af] to-[#ffcc00] 
//                       border border-white/20 z-0"
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ duration: 0.25 }}/>
//                     )}
                    
//                     <span className={`relative z-10 ${
//                       active === item.id ? "text-white" : "text-white"
//                       }`}>
//                       {item.name}
//                     </span>
//                 </button>
//               ))}
//             </motion.div>
//           </motion.div>
//         )}
//     </AnimatePresence>
//   );
// }

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  Search,
  Sun,
  Moon,
  User,
  ShoppingCart,
} from "lucide-react";
import logo from "../../assets/logo.png";

import {
  toggleSearchBAR,
  toggleAuthPopup,
  toggleCart,
} from "../../redux/slices/uiSlice";

export default function OverlayMenu({
  isOpen,
  onClose,
  dispatch,
  theme,
  toggleTheme,
  cartItemCount,
}) {
  const [active, setActive] = useState("home");

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
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ================= TOP BAR ================= */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />

              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ff00af] to-[#ffcc00] bg-clip-text text-transparent">
                ShopSphere
              </h1>
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <MdClose size={28} />
            </button>
          </div>

          {/* ================= NAV ITEMS ================= */}

          <motion.div
            className="flex-1 flex flex-col justify-center items-center gap-6"
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
                    y: 30,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{ duration: 0.35 }}
                className="relative px-8 py-3 rounded-full overflow-hidden"
              >
                {active === item.id && (
                  <motion.div
                    layoutId="activeMenu"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff00af] to-[#ffcc00]"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  />
                )}

                <span className="relative z-10 text-2xl font-semibold text-white">
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
            <div className="flex items-center gap-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-7 py-3">
              {/* Search */}

              <button
                onClick={() => dispatch(toggleSearchBAR())}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <Search className="w-6 h-6 text-white hover:text-orange-500" />
              </button>

              {/* Theme */}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6 text-white" />
                ) : (
                  <Moon className="w-6 h-6 text-white" />
                )}
              </button>

              {/* User */}

              <button
                onClick={() => dispatch(toggleAuthPopup())}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <User className="w-6 h-6 text-white hover:text-orange-500" />
              </button>

              {/* Cart */}

              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 rounded-full hover:bg-white/10 transition"
              >
                <ShoppingCart className="w-6 h-6 text-white hover:text-orange-500" />

                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-xs font-semibold text-white">
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