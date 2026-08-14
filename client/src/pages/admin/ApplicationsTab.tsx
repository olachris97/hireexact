import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TalentApplication, ApplicationStatus } from '../../types';

const STATUSES: ApplicationStatus[] = ['submitted', 'screening', 'vetting', 'approved', 'rejected'];

export const ApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getApplications(statusFilter)
      .then((res) => setApplications(res.applications))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await api.updateApplication(id, { status });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl text-ink">Talent applications</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-hairline bg-cloud text-sm text-ink"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-slate">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate border-b border-hairline">
                <th className="py-2.5 pr-4 font-medium">Name</th>
                <th className="py-2.5 pr-4 font-medium">Role</th>
                <th className="py-2.5 pr-4 font-medium">Stack</th>
                <th className="py-2.5 pr-4 font-medium">Rate</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b border-hairline">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-ink">{a.fullName}</p>
                    <p className="text-xs text-slate">{a.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-ink">{a.roleTitle || '—'}</td>
                  <td className="py-3 pr-4 text-xs text-slate max-w-[200px]">
                    {a.primaryStack.join(', ') || '—'}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-ink">
                    {a.desiredHourlyRate ? `$${a.desiredHourlyRate}/hr` : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value as ApplicationStatus)}
                      className="px-2.5 py-1.5 rounded-md border border-hairline bg-paper text-xs text-ink font-medium"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
