import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

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

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(wishlistItems));
    } catch (err) {
      console.error(err);
    }
  }, [wishlistItems]);

  const value = useMemo(() => {
    const toggleWishlist = (product) => {
      if (!product?.id) return;
      setWishlistItems(prev => {
        const exists = prev.some(item => item.id === product.id);
        if (exists) {
          return prev.filter(item => item.id !== product.id);
        } else {
          return [...prev, product];
        }
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
