import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export const OverviewTab: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return null;

  const bookingCount = (status: string) =>
    stats.bookingsByStatus.find((b: any) => b.status === status)?.count || 0;
  const appCount = (status: string) =>
    stats.applicationsByStatus.find((a: any) => a.status === status)?.count || 0;

  const totalBookings = stats.bookingsByStatus.reduce((sum: number, b: any) => sum + b.count, 0);
  const totalApplications = stats.applicationsByStatus.reduce((sum: number, a: any) => sum + a.count, 0);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Published candidates" value={`${stats.candidates.published} / ${stats.candidates.total}`} />
        <StatCard label="Interview requests" value={totalBookings} />
        <StatCard label="New requests" value={bookingCount('new')} accent />
        <StatCard label="Talent applications" value={totalApplications} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-cloud border border-hairline rounded-xl p-5">
          <h2 className="font-display font-semibold text-sm text-ink mb-4">Interview requests by status</h2>
          <div className="space-y-2">
            {['new', 'contacted', 'interview_scheduled', 'offer_sent', 'hired', 'closed_lost'].map((s) => (
              <StatusRow key={s} label={s} count={bookingCount(s)} total={totalBookings || 1} />
            ))}
          </div>
        </div>

        <div className="bg-cloud border border-hairline rounded-xl p-5">
          <h2 className="font-display font-semibold text-sm text-ink mb-4">Talent applications by status</h2>
          <div className="space-y-2">
            {['submitted', 'screening', 'vetting', 'approved', 'rejected'].map((s) => (
              <StatusRow key={s} label={s} count={appCount(s)} total={totalApplications || 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-cloud border border-hairline rounded-xl p-5">
        <h2 className="font-display font-semibold text-sm text-ink mb-4">Recent interview requests</h2>
        <div className="space-y-3">
          {stats.recentBookings.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-ink font-medium">{b.company_name}</p>
                <p className="text-xs text-slate">{b.contact_name}</p>
              </div>
              <span className="text-xs font-mono text-slate">{b.status}</span>
            </div>
          ))}
          {stats.recentBookings.length === 0 && <p className="text-sm text-slate">No requests yet.</p>}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: React.ReactNode; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="bg-cloud border border-hairline rounded-xl p-5">
    <p className="text-xs text-slate mb-1.5">{label}</p>
    <p className={`font-mono text-2xl font-semibold ${accent ? 'text-teal' : 'text-ink'}`}>{value}</p>
  </div>
);

const StatusRow: React.FC<{ label: string; count: number; total: number }> = ({ label, count, total }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate w-32 shrink-0 capitalize">{label.replace(/_/g, ' ')}</span>
    <div className="flex-1 h-1.5 rounded-full bg-paper-dim overflow-hidden">
      <div className="h-full bg-teal rounded-full" style={{ width: `${(count / total) * 100}%` }} />
    </div>
    <span className="font-mono text-xs text-ink w-6 text-right">{count}</span>
  </div>
);
