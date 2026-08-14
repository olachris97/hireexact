import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cloud border-t border-hairline py-12 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-paper font-display font-bold text-sm">
              H
            </span>
            <span className="font-display font-bold text-ink">HireExact</span>
          </div>
          <p className="text-sm text-slate max-w-sm">
            Vetted global developers, hired directly, paid directly. One flat fee, once.
          </p>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate">© {new Date().getFullYear()} HireExact. All rights reserved.</p>
          <Link to="/admin/login" className="text-xs text-slate hover:text-ink transition-colors">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
};
