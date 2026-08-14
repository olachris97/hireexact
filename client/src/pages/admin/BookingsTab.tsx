import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Booking, BookingStatus } from '../../types';

const STATUSES: BookingStatus[] = ['new', 'contacted', 'interview_scheduled', 'offer_sent', 'hired', 'closed_lost'];

export const BookingsTab: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .getBookings(statusFilter)
      .then((res) => setBookings(res.bookings))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await api.updateBooking(id, { status });
  };

  const saveNotes = async (id: string, notes: string) => {
    await api.updateBooking(id, { adminNotes: notes });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl text-ink">Interview requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-hairline bg-cloud text-sm text-ink"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-slate">No interview requests found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-cloud border border-hairline rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-sm text-ink">{b.companyName}</p>
                  <p className="text-xs text-slate mt-0.5">
                    {b.contactName} · {b.email}
                    {b.phone ? ` · ${b.phone}` : ''}
                  </p>
                  {b.roleTitle && <p className="text-xs text-ink mt-1.5">Role: {b.roleTitle}</p>}
                  {b.candidateName && <p className="text-xs text-teal mt-0.5">Interested in: {b.candidateName}</p>}
                </div>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                  className="px-2.5 py-1.5 rounded-md border border-hairline bg-paper text-xs text-ink font-medium"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                className="text-xs text-slate mt-3 hover:text-ink"
              >
                {expanded === b.id ? 'Hide details' : 'Show details & notes'}
              </button>

              {expanded === b.id && (
                <div className="mt-3 pt-3 border-t border-hairline space-y-3">
                  {b.message && <p className="text-xs text-ink"><span className="text-slate">Message: </span>{b.message}</p>}
                  {b.budgetRange && <p className="text-xs text-ink"><span className="text-slate">Budget: </span>{b.budgetRange}</p>}
                  {b.preferredTimezone && <p className="text-xs text-ink"><span className="text-slate">Timezone: </span>{b.preferredTimezone}</p>}
                  {b.teamSize && <p className="text-xs text-ink"><span className="text-slate">Team size: </span>{b.teamSize}</p>}
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1.5">Admin notes</label>
                    <textarea
                      defaultValue={b.adminNotes || ''}
                      onBlur={(e) => saveNotes(b.id, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-hairline bg-paper text-xs text-ink outline-none focus:border-teal resize-none"
                      placeholder="Internal notes about this request…"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
