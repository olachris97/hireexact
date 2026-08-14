import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-sm text-slate">Loading…</div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};
