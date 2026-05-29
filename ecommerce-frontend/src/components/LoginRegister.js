import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.text();

      if (!response.ok) {
        setMessage(data);
      } else {
        setMessage(data);
        setIsSuccess(true);
        setIsVerifying(true); // Enter verification flow
      }
    } catch (error) {
      setMessage('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
        method: 'POST',
      });

      const data = await response.text();

      if (response.ok) {
        // Navigate to dedicated login route with success state
        navigate('/login', { 
          state: { successMessage: '✅ Account verified successfully! You can now login.' } 
        });
      } else {
        setMessage(data);
      }
    } catch (error) {
      setMessage('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const data = await response.text();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data);
        setResendTimer(60);
      } else {
        setMessage(data);
      }
    } catch (error) {
      setMessage('⛔ Failed to resend verification OTP. Please try again.');
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
            {isVerifying ? 'Security Verification' : 'Operative Registration'}
          </p>
        </div>

        {message && (
          <div className={`${isSuccess ? 'bg-secondary-fixed/20 border-secondary-fixed/50 text-secondary-fixed' : 'bg-error-container/50 border-error/50 text-error'} border p-3 rounded-lg text-sm mb-6 text-center`}>
            {message}
          </div>
        )}

        {isVerifying ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-on-surface-variant text-center text-sm font-body-md mb-2">
              Please enter the 6-digit confirmation code sent to <strong className="text-on-surface">{email}</strong>.
            </p>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="verify-otp">Security OTP</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendTimer > 0}
                  className="text-secondary-fixed text-xs font-bold hover:underline disabled:opacity-50"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
              <input
                id="verify-otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface tracking-[0.5em] text-center font-display-md text-lg focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Authorize Verification'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsVerifying(false);
                setMessage('');
              }}
              className="w-full bg-surface-container border border-outline/20 text-on-surface font-bold font-label-md py-4 rounded-xl hover:bg-surface-container-highest transition-all uppercase tracking-wider mt-2"
            >
              Back
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="username"
                disabled={isLoading}
                required
              />
            </div>
            
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
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="password">Password</label>
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
              disabled={isLoading || !username || !email || !password}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {!isVerifying && (
          <p className="text-center mt-8 text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary-fixed hover:underline font-bold">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
