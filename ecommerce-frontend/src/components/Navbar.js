import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Navbar({ onLogout }) {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync search input value with URL parameter changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (location.pathname === '/products') {
      setSearchParams(prev => {
        if (query) prev.set('search', query);
        else prev.delete('search');
        return prev;
      });
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/products') {
      setSearchParams(prev => {
        prev.delete('search');
        return prev;
      });
    } else {
      navigate('/products');
    }
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b border-outline-variant shadow-sm ${
        scrolled ? 'bg-surface/95 backdrop-blur-xl py-2 md:py-3' : 'bg-surface py-3 md:py-4'
      }`}>
        {showProfileMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileMenu(false)}
          />
        )}
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-8 mx-auto gap-3 md:gap-4">
          
          {/* Logo & Mobile Actions Wrapper */}
          <div className="flex justify-between items-center w-full md:w-auto">
            {/* Brand Logo & Categories */}
            <div className="flex items-center gap-6">
              <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-on-surface uppercase no-underline shrink-0 hover:text-primary transition-colors">
                ELECTRONCE
              </Link>
              
              {/* Desktop Categories */}
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/products?search=Phones" className="text-on-surface-variant hover:text-primary font-label-md text-sm transition-colors uppercase tracking-wider">Phones</Link>
                <Link to="/products?search=Wearables" className="text-on-surface-variant hover:text-primary font-label-md text-sm transition-colors uppercase tracking-wider">Wearables</Link>
                <Link to="/products?search=Audio" className="text-on-surface-variant hover:text-primary font-label-md text-sm transition-colors uppercase tracking-wider">Audio</Link>
              </div>
            </div>

            {/* Mobile Actions - only visible on small screens */}
            <div className="flex md:hidden items-center gap-4">
              <Link to="/wishlist" className="relative cursor-pointer no-underline text-on-surface-variant animate-fade-in" title="Wishlist">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-surface">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative cursor-pointer no-underline text-on-surface-variant animate-fade-in" title="Shopping Cart">
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-surface">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <div className="relative cursor-pointer z-50">
                <span 
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-[24px]"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  account_circle
                </span>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full pt-2 w-40 z-50">
                    <div className="bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden py-1">
                      <button 
                         onClick={() => { setShowSettings(true); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                        Settings
                      </button>
                      <button 
                        onClick={() => { navigate('/orders'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        Orders
                      </button>
                      <button 
                         onClick={() => { setShowSupport(true); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">contact_support</span>
                        Support
                      </button>
                      <div className="border-t border-outline-variant my-1"></div>
                      <button 
                        onClick={() => { if(onLogout) onLogout(); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="w-full md:flex-1 md:max-w-md relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tech products, brands..."
              className="w-full pl-10 pr-10 py-2 md:py-2.5 bg-surface border border-outline-variant rounded-full text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title="Clear Search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Desktop Actions - only visible on larger screens */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link to="/wishlist" className="relative cursor-pointer group no-underline text-on-surface-variant" title="Wishlist">
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">favorite</span>
              {totalWishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-surface">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative cursor-pointer group no-underline text-on-surface-variant" title="Shopping Cart">
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-surface">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <div className="relative cursor-pointer z-50">
              <span 
                className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                account_circle
              </span>
              {showProfileMenu && (
                <div className="absolute right-0 top-full pt-2 w-48 z-50">
                  <div className="bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden py-1">
                    <button 
                      onClick={() => { setShowSettings(true); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Settings
                    </button>
                    <button 
                      onClick={() => { navigate('/orders'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">history</span>
                      Orders
                    </button>
                    <button 
                      onClick={() => { setShowSupport(true); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">contact_support</span>
                      Support
                    </button>
                    <div className="border-t border-outline-variant my-1"></div>
                    <button 
                      onClick={() => { if(onLogout) onLogout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              title="Close Settings"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-2xl text-on-surface mb-6 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </h3>
            
            <div className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-2 border-b border-outline-variant pb-4">
                <h4 className="text-sm font-label-md text-on-surface-variant">Profile</h4>
                <p className="text-sm font-body-md">Email: <strong className="text-on-surface">{localStorage.getItem('userEmail') || 'guest@electronce.com'}</strong></p>
                <p className="text-sm font-body-md">Access Level: <strong className="text-on-surface">{localStorage.getItem('userType') === 'guest' ? 'Guest Bypass' : 'Full Access'}</strong></p>
              </div>

              {/* Password simulation placeholder */}
              <div className="space-y-2">
                <h4 className="text-sm font-label-md text-on-surface-variant">Security</h4>
                <button
                  disabled
                  className="w-full text-center py-2.5 bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-sm rounded-lg cursor-not-allowed"
                >
                  Modify Password (Sync Encrypted)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <SupportModal onClose={() => setShowSupport(false)} />
      )}
    </>
  );
}

// Support Modal Sub-component
function SupportModal({ onClose }) {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState(localStorage.getItem('userEmail') || '');
  const [subject, setSubject] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/support-enquiry?name=${encodeURIComponent(name)}&email=${encodeURIComponent(emailInput)}&subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(messageInput)}`, {
        method: 'POST'
      });
      
      const text = await response.text();
      
      if (response.ok) {
        setTransmissionSuccess(true);
        setName('');
        setSubject('');
        setMessageInput('');
      } else {
        alert(text || '⛔ Failed to transmit enquiry.');
      }
    } catch (err) {
      alert('⛔ Communication link offline. Please try again.');
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm px-4">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Close Support"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h3 className="font-headline-md text-2xl text-on-surface font-semibold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">contact_support</span>
          Support
        </h3>

        {transmissionSuccess ? (
          <div className="text-center py-6 space-y-4">
            <span className="material-symbols-outlined text-[64px] text-primary bg-primary/10 p-4 rounded-full">
              check_circle
            </span>
            <h4 className="font-headline-md text-xl text-on-surface font-semibold">Message Sent</h4>
            <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto">
              Your enquiry has been received. Our support team will get back to you shortly.
            </p>
            <button
              onClick={() => {
                setTransmissionSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-primary text-on-primary font-medium font-label-md rounded-lg hover:brightness-110 transition-all text-sm mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coordinates Section */}
            <div className="space-y-4 font-body-md text-sm border-r border-outline-variant pr-4 hidden md:block">
              <h4 className="text-sm font-label-md text-on-surface-variant">Contact Info</h4>
              <div className="space-y-3 text-on-surface">
                <p className="flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                  electronce20@gmail.com
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">phone_in_talk</span>
                  +1 (800) 999-ELECTRON
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSendEnquiry} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="minimal-input"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email Address"
                  className="minimal-input"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="minimal-input"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <div>
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="How can we help?"
                  rows="3"
                  className="minimal-input resize-none"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full bg-primary text-on-primary font-medium font-label-md py-2.5 rounded-lg hover:brightness-110 transition-all text-sm mt-2 disabled:opacity-50"
              >
                {isTransmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
