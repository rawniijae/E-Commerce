import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-margin-mobile">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary-fixed/20 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="glass-card w-full max-w-lg p-10 sm:p-16 rounded-3xl relative overflow-hidden z-10 text-center">
        <div className="w-24 h-24 bg-surface-container rounded-full mx-auto mb-8 flex items-center justify-center border border-secondary-fixed/50 shadow-[0_0_30px_rgba(0,253,238,0.3)]">
          <span className="material-symbols-outlined text-5xl text-secondary-fixed">check_circle</span>
        </div>
        
        <h2 className="font-display-lg text-4xl mb-4 text-on-surface">Transmission Complete</h2>
        <p className="text-on-surface-variant font-body-lg mb-2">
          Your order has been authorized and queued for delivery.
        </p>
        <p className="text-on-surface-variant font-body-md mb-10 opacity-70">
          A confirmation sequence has been sent to your email. <br/>
          <span className="text-xs text-secondary-fixed mt-2 block">(Check spam if you did not receive the confirmation)</span>
        </p>
        
        <Link 
          to="/products" 
          className="inline-block w-full bg-primary-container text-on-primary-fixed font-bold font-label-md py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,170,255,0.3)] no-underline"
        >
          Return to Electronce
        </Link>
      </div>
    </div>
  );
}
