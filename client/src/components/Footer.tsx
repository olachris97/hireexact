import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="bg-cloud border-t border-hairline py-12 px-5 sm:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-8 pb-8 border-b border-hairline">
        <div className="lg:col-span-2">
          <div className="font-display font-bold text-ink">HireExact</div>
          <p className="text-sm text-slate max-w-sm mt-3">Vetted global developers, hired directly, paid directly. One flat fee, once.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink mb-3">Company</p>
          <Link to="/about" className="block text-sm text-slate hover:text-ink mb-2">About</Link>
          <Link to="/contact" className="block text-sm text-slate hover:text-ink">Contact</Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink mb-3">Legal</p>
          <Link to="/privacy-policy" className="block text-sm text-slate hover:text-ink mb-2">Privacy Policy</Link>
          <Link to="/terms-of-service" className="block text-sm text-slate hover:text-ink mb-2">Terms of Service</Link>
          <Link to="/cookie-policy" className="block text-sm text-slate hover:text-ink mb-2">Cookie Policy</Link>
          <Link to="/refund-cancellation" className="block text-sm text-slate hover:text-ink mb-2">Refund & Cancellation</Link>
          <Link to="/disclaimer" className="block text-sm text-slate hover:text-ink">Disclaimer</Link>
        </div>
      </div>
      <div className="pt-6 text-xs text-slate space-y-2">
        <p>Support@hire-exact.com · +1 303-720-6109</p>
        <p>HireExact Ltd · 1500 N Grant St Ste C, Denver, CO 80203, United States</p>
        <p>© {new Date().getFullYear()} HireExact Ltd. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
