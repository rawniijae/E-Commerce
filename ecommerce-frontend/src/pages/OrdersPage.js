import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const fetchOrders = async () => {
    if (!userEmail) {
      setError("User not identified.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/orders/user?email=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Connection to grid failed. Could not retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to abort this purchase?")) return;
    
    try {
      setCancellingOrderId(orderId);
      const response = await fetch(`${API_BASE_URL}/api/auth/orders/cancel?orderId=${encodeURIComponent(orderId)}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to cancel order');
      }
      
      // Refresh order list
      await fetchOrders();
      alert('Order successfully cancelled.');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Error occurred while trying to cancel.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-primary border-primary shadow-[0_0_10px_rgba(0,170,255,0.3)]';
      case 'COMPLETED': return 'text-secondary-fixed border-secondary-fixed shadow-[0_0_10px_rgba(0,253,238,0.3)]';
      case 'CANCELLED': return 'text-error border-error shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      default: return 'text-on-surface border-outline';
    }
  };

  return (
    <div className="pt-24 pb-12 px-margin-mobile md:px-gutter max-w-container-max mx-auto min-h-screen">
      <h1 className="font-display-lg text-headline-lg text-secondary-fixed shadow-sm uppercase tracking-tighter mb-8 animate-fade-in flex items-center gap-3">
        <span className="material-symbols-outlined text-[32px]">history</span>
        Grid Purchase History
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-secondary-fixed/20 border-t-secondary-fixed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-card border-error/50 p-6 text-center text-error font-body-md animate-fade-in">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card text-center py-20 animate-fade-in">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4 block">receipt_long</span>
          <p className="font-body-md text-on-surface-variant">No purchases found in your grid record.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="glass-card border border-outline/10 p-5 md:p-6 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline/10 pb-4">
                    <div>
                      <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Ref Code</p>
                      <p className="font-body-md text-sm text-on-surface font-mono">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Date</p>
                      <p className="font-body-md text-sm text-on-surface">
                        {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Acquired Components</p>
                    <ul className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-surface-container-highest/30 p-2 rounded-lg text-sm">
                          <span className="font-body-md text-on-surface truncate pr-4">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-label-md text-secondary-fixed shrink-0">₹{item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="w-full lg:w-48 shrink-0 flex flex-col justify-between items-end gap-4 lg:border-l border-outline/10 lg:pl-6">
                  <div className="text-right w-full flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-end">
                    <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider lg:mb-1">Total</p>
                    <p className="font-headline-md text-xl text-primary font-bold">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="w-full flex flex-col gap-3">
                    <div className={`px-4 py-2 border rounded-full text-xs font-label-md uppercase tracking-wider text-center ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="w-full py-2 bg-error/10 hover:bg-error/20 text-error border border-error/50 rounded-xl text-xs font-label-md uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {cancellingOrderId === order.id ? 'Aborting...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
