import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-margin-mobile bg-background">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -z-10"></div>
      
      <div className="glass-card w-full max-w-lg p-10 sm:p-16 rounded-2xl relative z-10 text-center shadow-lg">
        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-8 flex items-center justify-center border border-primary/20">
          <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
        </div>
        
        <h2 className="font-display-lg text-4xl mb-4 text-on-surface">Order Complete</h2>
        <p className="text-on-surface-variant font-body-lg mb-2">
          Your order has been authorized and queued for delivery.
        </p>
        <p className="text-on-surface-variant font-body-md mb-10 opacity-70">
          A confirmation email has been sent. <br/>
          <span className="text-xs text-primary mt-2 block font-medium">(Check spam if you did not receive it)</span>
        </p>
        
        <Link 
          to="/products" 
          className="inline-block w-full bg-primary text-on-primary font-bold font-label-md py-4 rounded-full hover:bg-primary-container transition-all uppercase tracking-wider shadow-sm no-underline"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
}
