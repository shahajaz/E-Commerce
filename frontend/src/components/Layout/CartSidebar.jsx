import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { isCartOpen } = useSelector((state) => state.popup);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    }else{
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  let totalPrice = 0;
  if (cart) {
    total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  if (!isCartOpen) {
    return null;
  }

  return (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => dispatch(closeCart())}
    ></div>

    {/* Sidebar */}
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 animate-slide-in-right overflow-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>

        <button onClick={() => dispatch(closeCart())}>
          <X size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4">
        {cart.map((item) => (
          <div key={item.product._id}>
            {item.product.name}
          </div>
        ))}
      </div>
    </div>
  </>
);
};

export default CartSidebar;
