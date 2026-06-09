import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const hasAutoRun = useRef(false);

  // Parse email and OTP from URL if present
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const otpParam = searchParams.get('otp');

    if (emailParam) {
      setEmail(emailParam);
    }
    if (otpParam) {
      setOtp(otpParam);
    }

    // Auto verify if both parameters exist and we haven't tried yet
    if (emailParam && otpParam && !hasAutoRun.current) {
      hasAutoRun.current = true;
      handleVerify(emailParam, otpParam);
    }
  }, [searchParams]);

  // Handle countdown for resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (verifyEmail, verifyOtp) => {
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(verifyEmail)}&otp=${encodeURIComponent(verifyOtp)}`, {
        method: 'POST',
      });
      
      const text = await response.text();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(text || '✅ Verification complete.');
      } else {
        setMessage(text || '⛔ Verification failed. Please check your inputs.');
      }
    } catch (err) {
      setMessage('⛔ Communication link offline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && otp) {
      handleVerify(email, otp);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage('⛔ Please enter email address to resend verification.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const text = await response.text();
      
      if (response.ok) {
        setMessage(text || '✅ Verification OTP resent to your email.');
        setResendTimer(60); // 1 minute cooldown
      } else {
        setMessage(text || '⛔ Failed to resend code.');
      }
    } catch (err) {
      setMessage('⛔ Communication link offline. Please try again.');
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
            Email Verification
          </p>
        </div>

        {message && (
          <div className={`${isSuccess ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-error-container border-error/20 text-error'} border p-3 rounded-lg text-sm mb-6 text-center`}>
            {message}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center mx-auto my-4">
              <span className="material-symbols-outlined text-primary text-[36px]">verified_user</span>
            </div>
            <p className="text-on-surface font-body-md">
              Identity confirmed. You may now log in.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4"
            >
              Log In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="otp">Verification Code (OTP)</label>
                {email && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading || resendTimer > 0}
                    className="text-primary text-xs font-semibold hover:underline disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `Retry in ${resendTimer}s` : 'Resend Code'}
                  </button>
                )}
              </div>
              <input
                id="otp"
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

            <p className="text-xs text-primary text-center bg-primary/5 border border-primary/10 p-2.5 rounded-xl leading-normal">
              💡 <strong>Tip:</strong> If the email did not arrive, check your <strong>Spam folder</strong>.
            </p>
            
            <button 
              type="submit" 
              disabled={isLoading || !email || otp.length < 6}
              className="w-full bg-primary text-on-primary font-bold font-label-md py-3.5 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying Identity...' : 'Confirm'}
            </button>

            <p className="text-center mt-6 text-on-surface-variant text-sm">
              <Link to="/login" className="text-primary hover:underline font-bold">Return to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
