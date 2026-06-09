import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero_tech.png';

export default function CartPage() {
  const { cartItems, totalPrice, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="pt-36 md:pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto relative bg-background">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <h1 className="font-display-lg text-4xl mb-8 text-on-surface">
        Your Cart <span className="text-on-surface-variant font-body-md text-lg font-normal">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center mt-20 glass-card p-12 rounded-2xl max-w-lg mx-auto shadow-sm">
          <p className="text-on-surface-variant mb-6 font-headline-md text-2xl font-semibold">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 bg-primary text-on-primary font-bold font-label-md rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div 
                key={item.id} 
                className="glass-card p-6 rounded-xl flex justify-between items-center group relative overflow-hidden"
              >
                <div className="flex items-center gap-6 z-10">
                  <div className="w-24 h-24 bg-surface rounded-lg flex items-center justify-center p-3 border border-outline-variant">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                    />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-semibold mb-1 text-on-surface">{item.name}</h3>
                    <p className="text-on-surface-variant m-0 font-body-md">
                      <span className="text-on-surface font-sans font-semibold tabular-nums">₹{item.price.toFixed(2)}</span> × {item.quantity || 1}
                    </p>
                  </div>
                </div>
                
                <div className="text-right z-10 flex flex-col justify-between h-full">
                  <p className="font-sans font-bold text-xl mb-4 tabular-nums text-on-surface">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-on-surface-variant hover:text-error text-xs uppercase font-label-md transition-colors flex items-center justify-end gap-1 w-full"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-8 rounded-2xl sticky top-28 shadow-md">
              <h2 className="font-headline-md text-2xl mb-6 border-b border-outline-variant pb-4 font-semibold text-on-surface">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-sans font-medium tabular-nums text-on-surface">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Tax</span>
                  <span className="text-on-surface">₹0.00</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-primary font-semibold">FREE</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-outline-variant pt-6 mb-8">
                <span className="font-headline-md text-xl font-semibold text-on-surface">Total</span>
                <span className="font-sans font-bold text-2xl text-on-surface tabular-nums">₹{totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleProceedToBuy}
                className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}