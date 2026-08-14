import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export default function AdminLoginPage() {
  const { admin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <span className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center text-paper font-display font-bold text-lg">
            H
          </span>
          <span className="font-display font-bold text-lg text-ink">HireExact Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-cloud border border-hairline rounded-2xl p-7 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
