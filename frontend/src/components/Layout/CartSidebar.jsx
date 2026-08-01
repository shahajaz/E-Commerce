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
                  <img src={item.product.images[0].url} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg"/>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                    <p className="text-primary font-semibold">${item.product.price}</p>
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

    </div>
  </>
);
};

export default CartSidebar;
