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
        {/* <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-full bg-black/20 transition-colors cursor-pointer">
          <Menu  className="w-5 h-5 text-foreground"/>
        </button> */}

        {/* Logo */}
        <div className="flex-1 flex items-center">
          <img src={logo} alt="ShopSphere" className="w-20 h-20"/>
          <h1 className="text-2xl ml-2 font-bold text-primary">Shop<span className="text-2xl text-orange-500">Sphere</span></h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer">
            {theme === "dark" ? <Sun className="w-5 h-5 text-foreground"/> : <Moon className="w-5 h-5 text-foreground"/>}
          </button>

          {/* Search Overlay */}
          <button
            onClick={() => dispatch(toggleSearchBAR())}
            className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5 text-white hover:text-orange-700" />
          </button>


          {/* User Profile */}
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-white hover:text-orange-700" />
          </button>

          {/* Cart */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2 rounded-full bg-black/20 hover:bg-bg-secondary transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-white hover:text-orange-700"/>

            {
              cartItemCount > 0 && (
                <span className="-top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 justify-center"></span>
              )
            }
          </button>

        </div>




      </div>
    </div>
  </nav>
  </>;
};

export default Navbar;
