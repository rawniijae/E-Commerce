import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Login = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password flow states
  const [authMode, setAuthMode] = useState('login'); 
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
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
        if (text.includes('not verified') || response.status === 403) {
          setError(
            <span>
              ⛔ {text || 'Account not verified.'}{' '}
              <Link to={`/verify-email?email=${encodeURIComponent(email)}`} className="text-primary underline hover:brightness-110 font-bold ml-1">
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
    <div className="min-h-screen flex items-center justify-center relative px-margin-mobile bg-background">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="glass-card w-full max-w-md p-8 sm:p-12 rounded-2xl relative z-10 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl tracking-tighter text-on-surface mb-2 uppercase">
            Electronce
          </h1>
          <p className="text-on-surface-variant font-label-md tracking-widest text-xs uppercase">
            {authMode === 'login' 
              ? 'Account Login' 
              : authMode === 'forgot-email' ? 'Reset Request' : 'Reset Verification'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-error p-3 rounded-lg text-sm mb-6 text-center border border-error/20">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-sm mb-6 text-center">
            {successMessage}
          </div>
        )}

        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="minimal-input"
                placeholder="Email Address"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="minimal-input pr-10"
                  placeholder="Password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-on-surface-variant hover:text-on-surface transition-colors"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot-email');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email || !password}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {authMode === 'forgot-email' && (
          <form onSubmit={handleRequestResetOtp} className="space-y-6">
            <p className="text-on-surface-variant text-sm font-body-md mb-2">
              Enter your email address. We will send you an OTP code to reset your password.
            </p>
            <div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="minimal-input"
                placeholder="Email Address"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full bg-surface border border-outline-variant text-on-surface font-semibold font-label-md py-3.5 rounded-full hover:bg-surface-container transition-all uppercase tracking-wider mt-2"
            >
              Return to Login
            </button>
          </form>
        )}

        {authMode === 'forgot-otp' && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <p className="text-on-surface-variant text-sm font-body-md mb-2">
              An OTP has been sent to <strong>{email}</strong>. Enter the OTP code and your new password below.
            </p>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="reset-otp">OTP Code</label>
                <button
                  type="button"
                  onClick={handleRequestResetOtp}
                  disabled={isLoading || resendTimer > 0}
                  className="text-primary text-xs font-semibold hover:underline disabled:opacity-50"
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
                className="minimal-input tracking-[0.5em] text-center font-display-md text-lg"
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="minimal-input pr-10"
                  placeholder="New Password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-0 bottom-2 text-on-surface-variant hover:text-on-surface transition-colors"
                  title={showNewPassword ? "Hide Password" : "Show Password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || resetOtp.length < 6 || !newPassword}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full bg-surface border border-outline-variant text-on-surface font-semibold font-label-md py-3.5 rounded-full hover:bg-surface-container transition-all uppercase tracking-wider mt-2"
            >
              Cancel
            </button>
          </form>
        )}

        {authMode === 'login' && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-outline-variant"></div>
              <span className="px-4 text-on-surface-variant text-xs font-label-md uppercase">OR</span>
              <div className="flex-1 border-t border-outline-variant"></div>
            </div>

            <button 
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-surface border border-primary text-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary/5 transition-all uppercase tracking-wider shadow-sm"
            >
              Guest Bypass
            </button>

            <p className="text-center mt-8 text-on-surface-variant text-sm">
              Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">Register</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;