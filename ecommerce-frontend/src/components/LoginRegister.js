import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function LoginRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
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
    <div className="min-h-screen flex items-center justify-center relative px-margin-mobile bg-background">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="glass-card w-full max-w-md p-8 sm:p-12 rounded-2xl relative z-10 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl tracking-tighter text-on-surface mb-2 uppercase">
            Electronce
          </h1>
          <p className="text-on-surface-variant font-label-md tracking-widest text-xs uppercase">
            {isVerifying ? 'Security Verification' : 'Operative Registration'}
          </p>
        </div>

        {message && (
          <div className={`${isSuccess ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-error-container border-error/20 text-error'} border p-3 rounded-lg text-sm mb-6 text-center`}>
            {message}
          </div>
        )}

        {isVerifying ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-on-surface-variant text-center text-sm font-body-md mb-2">
              Please enter the 6-digit confirmation code sent to <strong className="text-on-surface">{email}</strong>.
            </p>
            <p className="text-xs text-primary text-center bg-primary/5 border border-primary/10 p-2.5 rounded-xl leading-normal">
              💡 <strong>Tip:</strong> If the email did not arrive, check your <strong>Spam / Junk folder</strong>.
            </p>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="verify-otp">Security OTP</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendTimer > 0}
                  className="text-primary text-xs font-semibold hover:underline disabled:opacity-50"
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
                className="minimal-input tracking-[0.5em] text-center font-display-md text-lg"
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Authorize'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsVerifying(false);
                setMessage('');
              }}
              className="w-full bg-surface border border-outline-variant text-on-surface font-semibold font-label-md py-3.5 rounded-full hover:bg-surface-container transition-all uppercase tracking-wider mt-2"
            >
              Back
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="minimal-input"
                placeholder="Username"
                disabled={isLoading}
                required
              />
            </div>
            
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
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !username || !email || !password}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {!isVerifying && (
          <p className="text-center mt-8 text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
