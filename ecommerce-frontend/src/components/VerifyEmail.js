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
      setMessage('⛔ Please enter email sequence to resend verification.');
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
            Comlink Verification
          </p>
        </div>

        {message && (
          <div className={`${isSuccess ? 'bg-secondary-fixed/20 border-secondary-fixed/50 text-secondary-fixed' : 'bg-error-container/50 border-error/50 text-error'} border p-3 rounded-lg text-sm mb-6 text-center`}>
            {message}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-fixed/20 border border-secondary-fixed flex items-center justify-center mx-auto my-4 shadow-[0_0_15px_rgba(0,253,238,0.4)] animate-bounce">
              <span className="material-symbols-outlined text-secondary-fixed text-[36px]">verified_user</span>
            </div>
            <p className="text-on-surface font-body-md">
              Identity confirmed. Security clearances active.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4"
            >
              Enter Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-on-surface-variant font-label-md text-xs mb-2 uppercase tracking-wider" htmlFor="email">Email Sequence</label>
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
                <label className="block text-on-surface-variant font-label-md text-xs uppercase tracking-wider" htmlFor="otp">Verification Code (OTP)</label>
                {email && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading || resendTimer > 0}
                    className="text-secondary-fixed text-xs font-bold hover:underline disabled:opacity-50"
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
                className="w-full bg-surface-container-highest border border-outline/20 p-3 rounded-lg text-on-surface tracking-[0.5em] text-center font-display-md text-lg focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed transition-colors"
                placeholder="••••••"
                disabled={isLoading}
                required
              />
            </div>

            <p className="text-xs text-secondary-fixed text-center bg-secondary-fixed/5 border border-secondary-fixed/10 p-2.5 rounded-xl leading-normal">
              💡 <strong>Tip:</strong> If the email did not arrive, check your <strong>Spam folder</strong>.
            </p>
            
            <button 
              type="submit" 
              disabled={isLoading || !email || otp.length < 6}
              className="w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying Identity...' : 'Confirm Authentication'}
            </button>

            <p className="text-center mt-6 text-on-surface-variant text-sm">
              <Link to="/login" className="text-secondary-fixed hover:underline font-bold">Return to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
