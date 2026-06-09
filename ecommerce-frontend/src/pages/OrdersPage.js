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
      setError('Connection failed. Could not retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
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
      case 'PENDING': return 'text-primary bg-primary/10 border-primary/20';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'CANCELLED': return 'text-error bg-error/10 border-error/20';
      default: return 'text-on-surface-variant bg-surface border-outline-variant';
    }
  };

  return (
    <div className="pt-24 pb-12 px-margin-mobile md:px-gutter max-w-container-max mx-auto min-h-screen bg-background">
      <h1 className="font-display-lg text-4xl text-on-surface mb-8 animate-fade-in flex items-center gap-3">
        <span className="material-symbols-outlined text-[32px]">history</span>
        Order History
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-card border-error/20 p-6 text-center text-error font-body-md animate-fade-in shadow-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card text-center py-20 animate-fade-in shadow-sm rounded-2xl">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant bg-surface-container p-4 rounded-full mb-4">receipt_long</span>
          <p className="font-body-md text-on-surface-variant">No orders found in your history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="glass-card border border-outline-variant p-5 md:p-6 rounded-xl animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
                    <div>
                      <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Order ID</p>
                      <p className="font-body-md text-sm text-on-surface font-mono font-medium">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Date</p>
                      <p className="font-body-md text-sm text-on-surface font-medium">
                        {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Items</p>
                    <ul className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-surface border border-outline-variant/50 p-3 rounded-lg text-sm shadow-sm">
                          <span className="font-body-md text-on-surface truncate pr-4 font-medium">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="font-label-md text-on-surface font-bold shrink-0">₹{item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="w-full lg:w-48 shrink-0 flex flex-col justify-between items-end gap-4 lg:border-l border-outline-variant lg:pl-6">
                  <div className="text-right w-full flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-end">
                    <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider lg:mb-1">Total</p>
                    <p className="font-headline-md text-2xl text-on-surface font-bold">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="w-full flex flex-col gap-3">
                    <div className={`px-4 py-2 border rounded-full text-xs font-label-md uppercase tracking-wider text-center font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>

                    {order.status === 'PENDING' && (
                       <button
                         onClick={() => handleCancelOrder(order.id)}
                         disabled={cancellingOrderId === order.id}
                         className="w-full py-2 bg-surface hover:bg-error/5 text-error border border-error/30 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors disabled:opacity-50 font-semibold"
                       >
                         {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
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
