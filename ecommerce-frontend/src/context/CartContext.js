import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Create context
const CartContext = createContext();

// 2. Create provider component (must be PascalCase)
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Calculate derived values
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    totalPrice: cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
  }), [cartItems]);

  // Cart operations
  const cartFunctions = useMemo(() => ({
    addToCart: (product) => {
      if (!product?.id) return;
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        return existing 
          ? prev.map(item => item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item)
          : [...prev, { ...product, quantity: 1 }];
      });
    },
    removeFromCart: (productId) => {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    },
    updateQuantity: (productId, newQty) => {
      setCartItems(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      ));
    },
    clearCart: () => setCartItems([])
  }), []);

  // Context value
  const contextValue = useMemo(() => ({
    cartItems,
    totalItems,
    totalPrice,
    ...cartFunctions
  }), [cartItems, totalItems, totalPrice, cartFunctions]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// 3. Create custom hook
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// 4. Export as named exports
export { CartProvider, useCart };