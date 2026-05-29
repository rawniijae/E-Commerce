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
  
  // Theme settings (cyan, violet, emerald)
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('theme-accent') || 'cyan';
  });

  // Apply theme accent class on body
  useEffect(() => {
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
    if (activeTheme !== 'cyan') {
      document.body.classList.add(`theme-${activeTheme}`);
    }
  }, [activeTheme]);

  const changeTheme = (themeName) => {
    setActiveTheme(themeName);
    localStorage.setItem('theme-accent', themeName);
  };

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
      <header className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b border-secondary-fixed/20 shadow-lg shadow-secondary-fixed/5 ${
        scrolled ? 'bg-surface/80 py-2 md:py-4 backdrop-blur-xl' : 'bg-surface/40 backdrop-blur-xl py-3 md:py-0 md:h-20'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto gap-3 md:gap-4 md:h-full">
          
          {/* Logo & Mobile Actions Wrapper */}
          <div className="flex justify-between items-center w-full md:w-auto">
            {/* Brand Logo */}
            <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-secondary-fixed shadow-[0_0_15px_rgba(0,253,238,0.5)] uppercase no-underline shrink-0">
              ELECTRONCE
            </Link>

            {/* Mobile Actions - only visible on small screens */}
            <div className="flex md:hidden items-center gap-4">
              <Link to="/wishlist" className="relative cursor-pointer no-underline text-on-surface-variant animate-fade-in" title="Wishlist">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-surface shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative cursor-pointer no-underline text-on-surface-variant animate-fade-in" title="Shopping Cart">
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-container text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-surface">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <div className="group relative cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors text-[24px]">account_circle</span>
                <div className="absolute right-0 top-full pt-2 w-36 hidden group-hover:block z-50">
                  <div className="bg-surface-container rounded-lg shadow-xl border border-outline/20 overflow-hidden py-1">
                    <button 
                      onClick={() => setShowSettings(true)}
                      className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">settings</span>
                      Settings
                    </button>
                    <button 
                      onClick={() => setShowSupport(true)}
                      className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">contact_support</span>
                      Support
                    </button>
                    <div className="border-t border-outline/10 my-1"></div>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
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
              className="w-full pl-10 pr-10 py-2 md:py-2.5 bg-surface-container-highest/60 border border-outline/20 rounded-full text-sm text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-all"
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
              <span className="material-symbols-outlined group-hover:text-secondary-fixed transition-colors">favorite</span>
              {totalWishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-surface shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative cursor-pointer group no-underline text-on-surface-variant" title="Shopping Cart">
              <span className="material-symbols-outlined group-hover:text-secondary-fixed transition-colors">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-surface">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <div className="group relative cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors">account_circle</span>
              <div className="absolute right-0 top-full pt-2 w-36 hidden group-hover:block z-50">
                <div className="bg-surface-container rounded-lg shadow-xl border border-outline/20 overflow-hidden py-1">
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                  </button>
                  <button 
                    onClick={() => setShowSupport(true)}
                    className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">contact_support</span>
                    Support
                  </button>
                  <div className="border-t border-outline/10 my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-secondary-fixed/20 shadow-2xl">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              title="Close Settings"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-2xl text-secondary-fixed shadow-sm mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span>
              Operative Settings
            </h3>
            
            <div className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-2 border-b border-outline/10 pb-4">
                <h4 className="text-xs uppercase font-label-md tracking-wider text-on-surface-variant">Operative Profile</h4>
                <p className="text-sm font-body-md">Email: <strong className="text-on-surface">{localStorage.getItem('userEmail') || 'guest@electronce.com'}</strong></p>
                <p className="text-sm font-body-md">Access Level: <strong className="text-on-surface">{localStorage.getItem('userType') === 'guest' ? 'Guest Bypass' : 'Full Operative'}</strong></p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3 border-b border-outline/10 pb-4">
                <h4 className="text-xs uppercase font-label-md tracking-wider text-on-surface-variant">Grid Theme Accent</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeTheme('cyan')}
                    className={`py-2 px-3 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all border ${
                      activeTheme === 'cyan'
                        ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed shadow-[0_0_8px_rgba(0,253,238,0.3)] font-bold'
                        : 'bg-surface-container-highest border-outline/20 text-on-surface hover:border-secondary-fixed/50'
                    }`}
                  >
                    Cyan Neon
                  </button>
                  <button
                    onClick={() => changeTheme('violet')}
                    className={`py-2 px-3 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all border ${
                      activeTheme === 'violet'
                        ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed shadow-[0_0_8px_rgba(210,20,255,0.3)] font-bold'
                        : 'bg-surface-container-highest border-outline/20 text-on-surface hover:border-secondary-fixed/50'
                    }`}
                  >
                    Violet Plasma
                  </button>
                  <button
                    onClick={() => changeTheme('emerald')}
                    className={`py-2 px-3 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all border ${
                      activeTheme === 'emerald'
                        ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed shadow-[0_0_8px_rgba(16,253,115,0.3)] font-bold'
                        : 'bg-surface-container-highest border-outline/20 text-on-surface hover:border-secondary-fixed/50'
                    }`}
                  >
                    Emerald Grid
                  </button>
                </div>
              </div>

              {/* Password simulation placeholder */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-label-md tracking-wider text-on-surface-variant">Security Protocol</h4>
                <button
                  disabled
                  className="w-full text-center py-3 bg-surface-container border border-outline/10 text-on-surface/40 font-label-md text-xs rounded-xl uppercase tracking-wider cursor-not-allowed"
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-secondary-fixed/20 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Close Support"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h3 className="font-headline-md text-2xl text-secondary-fixed shadow-sm mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined">contact_support</span>
          Support Terminal
        </h3>

        {transmissionSuccess ? (
          <div className="text-center py-6 space-y-4">
            <span className="material-symbols-outlined text-[64px] text-secondary-fixed shadow-[0_0_15px_rgba(0,253,238,0.2)] bg-secondary-fixed/10 p-4 rounded-full animate-bounce">
              send_and_archive
            </span>
            <h4 className="font-headline-md text-xl text-on-surface">Transmission Successful</h4>
            <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto">
              Your enquiry has been encrypted and routed to our central dispatch grid. A support drone will reply to your comlink shortly.
            </p>
            <button
              onClick={() => {
                setTransmissionSuccess(false);
                onClose();
              }}
              className="px-6 py-3 bg-primary-container text-on-primary-fixed font-bold font-label-md rounded-xl hover:brightness-110 transition-all uppercase tracking-wider text-xs"
            >
              Clear Terminal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coordinates Section */}
            <div className="space-y-4 font-body-md text-sm border-r border-outline/10 pr-4 hidden md:block">
              <h4 className="text-xs uppercase font-label-md tracking-wider text-on-surface-variant">Grid Contact Coordinates</h4>
              <div className="space-y-3 text-on-surface-variant">
                <p className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">mail</span>
                  electronce20@gmail.com
                </p>
                <p className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">phone_in_talk</span>
                  +1 (800) 999-ELECTRON
                </p>
                <p className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">explore</span>
                  Sector 7-G Core Grid
                </p>
              </div>
              <div className="border-t border-outline/10 pt-4">
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                  Operative support nodes are active 24/7. Transmit any queries regarding product diagnostics, shipment coordinate failures, or token authorization issues.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSendEnquiry} className="space-y-4">
              <h4 className="text-xs uppercase font-label-md tracking-wider text-on-surface-variant">Enquiry Transmission</h4>
              
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Operative Name"
                  className="w-full bg-surface-container-highest border border-outline/20 p-2.5 rounded-lg text-xs text-on-surface focus:outline-none focus:border-secondary-fixed transition-colors"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-surface-container-highest border border-outline/20 p-2.5 rounded-lg text-xs text-on-surface focus:outline-none focus:border-secondary-fixed transition-colors"
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
                  className="w-full bg-surface-container-highest border border-outline/20 p-2.5 rounded-lg text-xs text-on-surface focus:outline-none focus:border-secondary-fixed transition-colors"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <div>
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Write enquiry payload..."
                  rows="3"
                  className="w-full bg-surface-container-highest border border-outline/20 p-2.5 rounded-lg text-xs text-on-surface focus:outline-none focus:border-secondary-fixed transition-colors resize-none"
                  disabled={isTransmitting}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-3 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider text-xs shadow-[0_0_10px_rgba(0,170,255,0.2)] disabled:opacity-50"
              >
                {isTransmitting ? 'Transmitting Encryption...' : 'Transmit Enquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
