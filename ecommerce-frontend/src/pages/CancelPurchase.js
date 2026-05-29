import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function CancelPurchase() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('⛔ Missing Order Reference Code.');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/orders/${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error('Order not found in sector.');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('⛔ Order reference not found in the ELECTRONCE database grid.');
        setLoading(false);
      });
  }, [orderId]);

  const handleCancelOrder = () => {
    if (!orderId) return;
    setCancelling(true);

    fetch(`${API_BASE_URL}/api/auth/orders/cancel?orderId=${orderId}`, {
      method: 'POST'
    })
      .then(res => {
        if (!res.ok) throw new Error('Cancellation request rejected.');
        return res.text();
      })
      .then(msg => {
        setCancelling(false);
        setCancelSuccess(msg);
        // Update local order status
        setOrder(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
      })
      .catch(err => {
        setCancelling(false);
        alert('⛔ Cancellation failed: ' + err.message);
      });
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center border border-secondary-fixed/20 shadow-lg">
          <span className="material-symbols-outlined text-[48px] text-secondary-fixed animate-spin mb-4">
            sync
          </span>
          <h2 className="text-xl font-headline-md uppercase tracking-wider text-on-surface">
            Retrieving Grid Order Details...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center border border-error/20 shadow-lg">
          <span className="material-symbols-outlined text-[64px] text-error mb-4 bg-error/10 p-4 rounded-full">
            error
          </span>
          <h2 className="text-2xl font-headline-md mb-4 text-on-surface">{error}</h2>
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-surface-container-highest border border-outline/20 py-3 rounded-xl hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all uppercase tracking-wider text-sm font-label-md"
          >
            Return to Grid
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen px-margin-mobile md:px-gutter max-w-container-max mx-auto pb-20 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary-fixed/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto">
        <h1 className="font-display-lg text-3xl md:text-4xl mb-8 text-center uppercase tracking-tight">
          Cancellation Control Portal
        </h1>

        <div className="glass-card p-8 md:p-10 rounded-3xl border border-outline/10 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Order Details Panel */}
          <div>
            <div className="flex justify-between items-start border-b border-outline/10 pb-4 mb-4">
              <div>
                <h3 className="font-headline-md text-xl text-on-surface mb-1">Order Summary</h3>
                <p className="text-xs text-on-surface-variant font-mono m-0">REF: {order.id}</p>
              </div>
              <span className={`font-label-md text-xs px-3 py-1 rounded-full border ${
                order.status === 'CANCELLED' 
                  ? 'bg-error/10 text-error border-error/20' 
                  : 'bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/20'
              }`}>
                STATUS: {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-body-md text-on-surface-variant mb-4">
              <div>
                <span className="block text-xs uppercase tracking-wider text-outline mb-1">Customer Coordinates</span>
                <span className="text-on-surface font-semibold">{order.fullName}</span>
                <span className="block">{order.userEmail}</span>
                <span className="block">{order.phone}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-outline mb-1">Destination Address</span>
                <span className="text-on-surface">{order.address}</span>
                <span className="block">{order.area} - {order.pincode}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-surface-container/30 border border-outline/10 rounded-2xl p-4 mb-4">
              <span className="block text-xs uppercase tracking-wider text-outline mb-2">Acquired Items</span>
              <div className="space-y-2">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-outline/5 last:border-0">
                    <span className="text-on-surface font-medium">
                      {item.name} <span className="text-secondary-fixed">×{item.quantity}</span>
                    </span>
                    <span className="font-sans tabular-nums text-on-surface-variant">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Assessment */}
            <div className="flex justify-between items-center border-t border-outline/10 pt-4 font-bold">
              <span className="text-on-surface text-base">Total Assessment</span>
              <span className="font-sans text-2xl text-secondary-fixed tabular-nums">₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-6 border-t border-outline/10">
            {order.status === 'CANCELLED' ? (
              <div className="bg-error/15 border border-error/30 p-6 rounded-2xl text-center space-y-3">
                <span className="material-symbols-outlined text-[32px] text-error">
                  cancel
                </span>
                <h4 className="font-headline-md text-lg text-on-surface m-0">Purchase Aborted</h4>
                <p className="text-sm text-on-surface-variant m-0 max-w-md mx-auto">
                  {cancelSuccess || "This transaction has been successfully canceled in our system database. All currency blocks and reserves have been released."}
                </p>
                <button 
                  onClick={() => navigate('/products')}
                  className="mt-4 px-6 py-2.5 bg-surface-container-highest border border-outline/15 rounded-xl text-xs uppercase font-label-md hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-warning-container/10 border border-secondary-fixed/20 p-4 rounded-xl flex gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary-fixed shrink-0">
                    warning
                  </span>
                  <p className="m-0 leading-relaxed">
                    <strong>Grid Warning:</strong> You are about to authorize the permanent cancellation of this order. Once submitted, order fulfillment will be aborted and items returned to stock.
                  </p>
                </div>

                <button 
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full py-4 rounded-xl bg-error/95 text-white font-bold font-label-md uppercase tracking-wider hover:bg-error transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">
                    {cancelling ? 'sync' : 'block'}
                  </span>
                  {cancelling ? 'Transmitting Abort Code...' : 'Authorize Cancel Purchase'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
