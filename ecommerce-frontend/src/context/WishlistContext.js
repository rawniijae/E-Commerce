import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../config';
const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // Generate a unique storage key based on the logged-in user's email
  const getStorageKey = () => {
    const email = localStorage.getItem('userEmail');
    return email ? `wishlistItems_${email}` : 'wishlistItems_guest';
  };

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    // Fetch wishlist from backend on mount if user is logged in
    const fetchWishlist = async () => {
      if (userEmail) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/wishlist?email=${encodeURIComponent(userEmail)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.items) {
              setWishlistItems(data.items);
              localStorage.setItem(getStorageKey(), JSON.stringify(data.items));
            }
          }
        } catch (err) {
          console.error('Failed to fetch wishlist from server:', err);
        }
      }
    };
    fetchWishlist();
  }, [userEmail]);

  // Sync to backend whenever wishlist changes (debounced by React state)
  const syncToBackend = async (items) => {
    if (userEmail) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/wishlist/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail, items })
        });
      } catch (err) {
        console.error('Failed to sync wishlist to server:', err);
      }
    }
  };

  const value = useMemo(() => {
    const toggleWishlist = (product) => {
      if (!product?.id) return;
      setWishlistItems(prev => {
        const exists = prev.some(item => item.id === product.id);
        let newItems;
        if (exists) {
          newItems = prev.filter(item => item.id !== product.id);
        } else {
          newItems = [...prev, product];
        }
        
        // Update local storage immediately
        try {
          localStorage.setItem(getStorageKey(), JSON.stringify(newItems));
        } catch (e) {}
        
        // Sync to backend
        syncToBackend(newItems);
        
        return newItems;
      });
    };

    const isInWishlist = (productId) => {
      return wishlistItems.some(item => item.id === productId);
    };

    return {
      wishlistItems,
      totalWishlistItems: wishlistItems.length,
      toggleWishlist,
      isInWishlist
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
