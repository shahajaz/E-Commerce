import {
  X, Home, Package, Info, HelpCircle, ShoppingCart, List, Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [];

  const { isSidebarOpen } = useSelector(state => state.popup);
  if(!isSidebarOpen) return null;

  return <></>;
};

export default Sidebar;
