import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline/10 py-12 px-margin-mobile md:px-gutter mt-auto relative z-10">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="font-display-lg text-headline-md tracking-tighter text-secondary-fixed shadow-[0_0_15px_rgba(0,253,238,0.3)] uppercase no-underline">
            ELECTRONCE
          </Link>
          <p className="text-on-surface-variant font-body-md text-sm mt-2">
            Next-gen tech gear engineered for peak performance and futuristic aesthetics.
          </p>
        </div>

        {/* Directory Column */}
        <div className="space-y-3">
          <h4 className="text-on-surface font-label-md text-xs uppercase tracking-wider">Inventory</h4>
          <ul className="space-y-2 text-sm font-body-md list-none p-0 m-0">
            <li>
              <Link to="/products" className="text-on-surface-variant hover:text-secondary-fixed no-underline transition-colors">Products Catalog</Link>
            </li>
            <li>
              <Link to="/cart" className="text-on-surface-variant hover:text-secondary-fixed no-underline transition-colors">Cart Session</Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="space-y-3">
          <h4 className="text-on-surface font-label-md text-xs uppercase tracking-wider">Coordinates</h4>
          <ul className="space-y-2 text-sm font-body-md list-none p-0 m-0 text-on-surface-variant">
            <li>Email: electronce20@gmail.com</li>
            <li>Comlink: +1 (800) 999-ELECTRON</li>
            <li>Sector: 7-G Core Grid</li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <h4 className="text-on-surface font-label-md text-xs uppercase tracking-wider">Protocol</h4>
          <ul className="space-y-2 text-sm font-body-md list-none p-0 m-0">
            <li>
              <span className="text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer">Security Auditing</span>
            </li>
            <li>
              <span className="text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer">Operative Terms</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto border-t border-outline/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant font-body-md">
        <p>&copy; {new Date().getFullYear()} ELECTRONCE Grid. All authorization codes active.</p>
        <div className="flex gap-4">
          <span className="hover:text-secondary-fixed transition-colors cursor-pointer">GitHub</span>
          <span className="hover:text-secondary-fixed transition-colors cursor-pointer">Discord</span>
          <span className="hover:text-secondary-fixed transition-colors cursor-pointer">Nexus</span>
        </div>
      </div>
    </footer>
  );
}
