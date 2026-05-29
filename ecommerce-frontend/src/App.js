import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProductList from './components/ProductList';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CartPopup from './components/CartPopup';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './components/Login';
import LoginRegister from './components/LoginRegister';
import VerifyEmail from './components/VerifyEmail';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import CancelPurchase from './pages/CancelPurchase';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/WishlistPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('guestId');
      localStorage.setItem('isLoggedIn', 'false');
    } catch (error) {
      console.error('Failed to clean login session:', error);
    }
    setIsLoggedIn(false);
  };

  // Persist login state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('isLoggedIn', isLoggedIn);
    } catch (error) {
      console.error('Failed to save login state:', error);
    }
  }, [isLoggedIn]);

  return (
    <div className="dark font-body-md selection:bg-secondary-fixed/30 text-on-surface">
      <div className="grain-overlay"></div>
      <CustomCursor />
      <Router>
        <WishlistProvider>
          <CartProvider>
            <div className="app min-h-screen">
              {isLoggedIn && <Navbar onLogout={handleLogout} />}
            
            <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/products" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/products"
              element={
                isLoggedIn ? (
                  <>
                    <ProductList />
                    <CartPopup />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/cart"
              element={
                isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/checkout"
              element={
                isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/order-confirmation"
              element={
                isLoggedIn ? <OrderConfirmation /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <Login onLogin={() => setIsLoggedIn(true)} />
                ) : (
                  <Navigate to="/products" replace />
                )
              }
            />

            <Route
              path="/register"
              element={
                !isLoggedIn ? (
                  <LoginRegister onLogin={() => setIsLoggedIn(true)} />
                ) : (
                  <Navigate to="/products" replace />
                )
              }
            />

            <Route
              path="/verify-email"
              element={
                !isLoggedIn ? (
                  <VerifyEmail />
                ) : (
                  <Navigate to="/products" replace />
                )
              }
            />

            <Route
              path="/cancel-purchase"
              element={<CancelPurchase />}
            />

            <Route
              path="/wishlist"
              element={
                isLoggedIn ? <WishlistPage /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? '/products' : '/login'} replace />}
            />
          </Routes>
          
          {isLoggedIn && <Footer />}
        </div>
      </CartProvider>
    </WishlistProvider>
    </Router>
    </div>
  );
}

export default App;