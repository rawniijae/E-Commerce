import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function CartPopup() {
  const { totalItems = 0 } = useCart() || {};
  const [showNotification, setShowNotification] = useState(false);
  const prevItemsRef = useRef(totalItems);

  useEffect(() => {
    // If items count increased, trigger notification
    if (totalItems > prevItemsRef.current) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    prevItemsRef.current = totalItems;
  }, [totalItems]);

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[1000] glass-card px-6 py-4 rounded-full border border-secondary-fixed/50 shadow-[0_10px_30px_rgba(var(--neon-accent-rgb),0.3)] flex items-center gap-3 animate-scale-in">
      <span className="material-symbols-outlined text-secondary-fixed animate-pulse">check_circle</span>
      <span className="text-on-surface font-label-md uppercase tracking-wider text-sm">Added to Cart!</span>
    </div>
  );
}