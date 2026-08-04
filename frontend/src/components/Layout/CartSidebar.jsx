import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateCartQuantity,
} from "../../store/slices/cartSlice";

import { closeCart } from "../../store/slices/popupSlice";

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

  const totalPrice =
  cart?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  return (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => dispatch(closeCart())}
    ></div>

    {/* Sidebar */}
    <div className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-white text-black dark:bg-black dark:text-white border-l border-gray-200 dark:border-gray-700 shadow-lg z-[10001] overflow-y-auto transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>

        <button onClick={() => dispatch(closeCart())}>
          <X size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-6">
        {!cart || cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your cart is empty</p>
            
            <Link to="/product"
              className="inline-block mt-4 px-6 py-2 gradient-primary-foreground rounded-lg hover:glow-on-hover animate-smooth">Continue Shopping
            </Link>
          </div>
        ) : (
         <>
         <div className="space-y-4 mb-6">
          {cart && cart.map((item) => {
            return (
              <div key={item.product.id} className="glass-card p-4">
                <div className="flex items-center space-x-4">
                  <img src={item.product.images?.[0]?.url || "/placeholder.png"} alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                    <p className="text-primary font-semibold">${item.product.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 mt-2">
                    <button className="p-1 rounded glass-card hover:glow-on-hover animate-smooth"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="w-4 h-4 text-primary"></Minus>
                    </button>
                    
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
                    <button className="p-1 rounded glass-card hover:glow-on-hover animate-smooth"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="w-4 h-4 text-primary"></Plus>
                    </button>

                    <button className="p-1 rounded glass-card hover:glow-on-hover animate-smooth ml-2 text-destructive"
                      onClick={() => dispatch(removeFromCart(item.product.id))}>
                      <Trash2 className="w-4 h-4 text-destructive-foreground"/>
                    </button>
                  </div>
                </div>
              </div>
            )
          }
          )}
         </div>
         </>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-[hsla(var(--border))] p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
        </div>

        <Link to="/cart" onClick={() => dispatch(closeCart())}
          className="w-full block text-center py-3 gradient-primary gradient-primary-foreground rounded-full hover:glow-on-hover animate-smooth font-semibold"
        >Proceed to Checkout
        </Link>
      </div>
    </div>
  </>
);
};

export default CartSidebar;
