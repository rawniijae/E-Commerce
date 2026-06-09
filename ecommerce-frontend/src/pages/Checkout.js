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
    <div className="pt-36 md:pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto relative bg-background">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display-lg text-4xl mb-8 text-center text-on-surface">Secure Checkout</h1>
        
        <div className="glass-card p-8 sm:p-12 rounded-2xl relative overflow-hidden shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="border-b border-outline-variant pb-8">
              <h2 className="font-headline-md text-2xl mb-6 text-on-surface font-semibold">1. Shipping Details</h2>
              <div className="space-y-5">
                <div>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    required
                    placeholder="Full Name"
                    className="minimal-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required
                      placeholder="Email Address"
                      className="minimal-input"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required
                      pattern="[0-9]{10}"
                      placeholder="Phone Number (10 digits)"
                      className="minimal-input"
                    />
                  </div>
                </div>

                <div>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    required
                    rows="3"
                    placeholder="Full Address"
                    className="minimal-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input 
                      type="text" 
                      name="area" 
                      value={formData.area} 
                      onChange={handleChange} 
                      required
                      placeholder="City / Area"
                      className="minimal-input"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleChange} 
                      required
                      pattern="\d{6}"
                      placeholder="Pincode (6 digits)"
                      className="minimal-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-4">
              <h2 className="font-headline-md text-2xl mb-6 text-on-surface font-semibold">2. Payment Method</h2>
              <div className="relative">
                <select 
                  name="paymentMethod" 
                  value={formData.paymentMethod} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-outline-variant p-3.5 pr-10 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="upi">UPI Transfer</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant flex justify-between items-center shadow-sm">
              <span className="font-headline-md text-xl text-on-surface">Total Order</span>
              <span className="font-sans font-bold text-3xl text-on-surface tabular-nums">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-4 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">
                {loading ? 'sync' : 'lock'}
              </span>
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}