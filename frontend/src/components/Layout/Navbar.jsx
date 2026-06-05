import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";
import logo from "../../assets/logo.png";

const Navbar = () => {

  const { theme, toggleTheme } = useTheme();
  
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  let cartItemCount = 0;

  if ( cart ){
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  return <>

  <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div className="max-w-7xl max-auto px-4">
      <div className="flex items-center justify-between h-16">

        {/* Left Hamburger */}
        <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-md hover:bg-bg-secondary transition-colors">
          <Menu  className="w-6 h-6 text-foreground"/>
        </button>

        {/* Logo */}
        <div className="flex-1 flex items-center">
          {/* <img src={logo} alt="ShopSphere" className="w-20 h-16"/> */}
          <h1 className="text-2xl ml-2 font-bold text-primary">ShopSphere</h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-black/50 hover:bg-bg-secondary transition-colors cursor-pointer">
            {theme === "dark" ? <Sun className="w-6 h-6 text-foreground"/> : <Moon className="w-6 h-6 text-foreground"/>}
          </button>
        </div>


      </div>
    </div>
  </nav>
  </>;
};

export default Navbar;
