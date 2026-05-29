import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
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
