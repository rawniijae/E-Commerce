import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Login = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password flow states
  // 'login', 'forgot-email', 'forgot-otp'
  const [authMode, setAuthMode] = useState('login'); 
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Load redirect messages from register page (e.g. "verified successfully")
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clean history state so message disappears on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      if (response.ok && text.includes('Login successful')) {
        const token = text.split('Token: ')[1];
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userEmail', email);
        onLogin();
        navigate('/products');
      } else {
        // If unverified, provide a link to verify directly
        if (text.includes('not verified') || response.status === 403) {
          setError(
            <span>
              ⛔ {text || 'Account not verified.'}{' '}
              <Link to={`/verify-email?email=${encodeURIComponent(email)}`} className="text-secondary-fixed underline hover:brightness-110 font-bold ml-1">
                Verify Now
              </Link>
            </span>
          );
        } else {
          setError(text || 'Invalid email or password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', 'guest');
    localStorage.setItem('guestId', Date.now());
    onLogin();
    navigate('/products');
  };

  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('⛔ Please enter your email first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      const text = await response.text();
      if (response.ok) {
        setSuccessMessage(text || '✅ Reset OTP code sent to your email.');
        setAuthMode('forgot-otp');
        setResendTimer(60);
      } else {
        setError(text || '⛔ Failed to dispatch reset code.');
      }
    } catch (err) {
      setError('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !resetOtp || !newPassword) {
      setError('⛔ All fields are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(resetOtp)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: 'POST',
      });
      const text = await response.text();
      if (response.ok) {
        setSuccessMessage(text || '✅ Password reset successful!');
        setAuthMode('login');
        setResetOtp('');
        setNewPassword('');
      } else {
        setError(text || '⛔ Password reset failed.');
      }
    } catch (err) {
      setError('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-margin-mobile">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-fixed/10 blur-[100px] rounded-full -z-10"></div>
      
      <div className="glass-card w-full max-w-md p-8 sm:p-12 rounded-3xl relative overflow-hidden z-10">
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl tracking-tighter text-secondary-fixed shadow-[0_0_15px_rgba(0,253,238,0.3)] mb-2 uppercase">
            Electronce
          </h1>
          <p className="text-on-surface-variant font-label-md tracking-widest text-xs uppercase">
            {authMode === 'login' 
              ? 'Account Login' 
              : authMode === 'forgot-email' ? 'Reset Request' : 'Reset Verification'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container/50 border border-error/50 text-error p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-secondary-fixed/20 border border-secondary-fixed/50 text-secondary-fixed p-3 rounded-lg text-sm mb-6 text-center">
            {successMessage}
          </div>
        )}

        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="operator@electronce.com"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot-email');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-secondary-fixed text-xs font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email || !password}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {authMode === 'forgot-email' && (
          <form onSubmit={handleRequestResetOtp} className="space-y-5">
            <p className="text-on-surface-variant text-sm font-body-md mb-2">
              Enter your email address. We will send you an OTP code to reset your password.
            </p>
            <div>
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="operator@electronce.com"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4"
            >
              {isLoading ? 'Sending Request...' : 'Send Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full bg-surface-container border border-outline/20 text-on-surface font-bold font-label-md py-4 rounded-xl hover:bg-surface-container-highest transition-all uppercase tracking-wider mt-2"
            >
              Return to Login
            </button>
          </form>
        )}

        {authMode === 'forgot-otp' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <p className="text-on-surface-variant text-sm font-body-md mb-2">
              An OTP has been sent to <strong>{email}</strong>. Enter the OTP code and your new password below.
            </p>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="reset-otp">OTP Code</label>
                <button
                  type="button"
                  onClick={handleRequestResetOtp}
                  disabled={isLoading || resendTimer > 0}
                  className="text-secondary-fixed text-xs font-bold hover:underline disabled:opacity-50"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
              <input
                id="reset-otp"
                type="text"
                maxLength={6}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface tracking-[0.5em] text-center font-display-md text-lg focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || resetOtp.length < 6 || !newPassword}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full bg-surface-container border border-outline/20 text-on-surface font-bold font-label-md py-4 rounded-xl hover:bg-surface-container-highest transition-all uppercase tracking-wider mt-2"
            >
              Cancel
            </button>
          </form>
        )}

        {authMode === 'login' && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-outline/20"></div>
              <span className="px-4 text-on-surface-variant text-xs font-label-md uppercase">OR</span>
              <div className="flex-1 border-t border-outline/20"></div>
            </div>

            <button 
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-surface-container border border-secondary-fixed/30 text-secondary-fixed font-bold font-label-md py-4 rounded-xl hover:bg-secondary-fixed/10 transition-all uppercase tracking-wider"
            >
              Guest Bypass
            </button>

            <p className="text-center mt-8 text-on-surface-variant text-sm">
              Don't have an account? <Link to="/register" className="text-secondary-fixed hover:underline font-bold">Register</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;