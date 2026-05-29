import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config';

export default function Checkout() {
  const { cartItems, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    area: '',
    pincode: '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    paymentMethod: 'credit-card'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));

    const payload = {
      userEmail: formData.email,
      fullName: formData.fullName,
      address: formData.address,
      area: formData.area,
      pincode: formData.pincode,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      totalPrice: totalPrice,
      items: orderItems
    };

    fetch(`${API_BASE_URL}/api/auth/orders/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Order transaction failed.');
      return res.json();
    })
    .then(data => {
      setLoading(false);
      clearCart();
      navigate('/order-confirmation', { replace: true });
    })
    .catch(err => {
      setLoading(false);
      console.error(err);
      alert('⛔ Order transaction failed. Please check backend connection and retry.');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display-lg text-4xl mb-8 text-center">Secure Checkout</h1>
        
        <div className="glass-card p-8 sm:p-12 rounded-3xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="border-b border-outline/20 pb-6 mb-6">
              <h2 className="font-headline-md text-2xl mb-6 text-secondary-fixed">1. Shipping Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required
                      className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required
                      pattern="[0-9]{10}"
                      placeholder="10 digit number"
                      className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Address Coordinates</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    required
                    rows="3"
                    className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Sector (Area)</label>
                    <input 
                      type="text" 
                      name="area" 
                      value={formData.area} 
                      onChange={handleChange} 
                      required
                      className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleChange} 
                      required
                      pattern="\d{6}"
                      placeholder="6 digit PIN"
                      className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-6">
              <h2 className="font-headline-md text-2xl mb-6 text-secondary-fixed">2. Transaction Mode</h2>
              <div className="relative">
                <select 
                  name="paymentMethod" 
                  value={formData.paymentMethod} 
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border border-outline/20 p-3 pr-10 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors appearance-none cursor-pointer hover:border-secondary-fixed/50"
                >
                  <option value="credit-card">Credit Card Protocol</option>
                  <option value="debit-card">Debit Card Protocol</option>
                  <option value="upi">UPI Transfer</option>
                  <option value="cod">Physical Currency (COD)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-secondary-fixed/20 mb-8 flex justify-between items-center">
              <span className="font-headline-md text-xl">Total Assessment</span>
              <span className="font-sans font-bold text-3xl text-secondary-fixed neon-glow-text tabular-nums">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-5 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">
                {loading ? 'sync' : 'lock'}
              </span>
              {loading ? 'Processing Order...' : 'Authorize Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}