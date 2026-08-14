import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, UserSquare2, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { OverviewTab } from './OverviewTab';
import { BookingsTab } from './BookingsTab';
import { ApplicationsTab } from './ApplicationsTab';
import { CandidatesTab } from './CandidatesTab';

type Tab = 'overview' | 'bookings' | 'applications' | 'candidates';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Interview requests', icon: Briefcase },
  { id: 'applications', label: 'Talent applications', icon: Users },
  { id: 'candidates', label: 'Candidates', icon: UserSquare2 },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-60 shrink-0 bg-cloud border-r border-hairline hidden sm:flex flex-col">
        <div className="px-5 py-6 border-b border-hairline flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-paper font-display font-bold text-sm">
            H
          </span>
          <span className="font-display font-bold text-ink text-sm">HireExact Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-ink text-paper' : 'text-slate hover:bg-paper-dim hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-hairline">
          <p className="text-xs text-slate truncate mb-2">{admin?.email}</p>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-medium text-slate hover:text-ink"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sm:hidden flex items-center justify-between px-5 py-4 bg-cloud border-b border-hairline">
          <span className="font-display font-bold text-ink text-sm">HireExact Admin</span>
          <button onClick={logout} className="text-xs font-medium text-slate">
            Sign out
          </button>
        </header>

        <div className="sm:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-cloud border-b border-hairline">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                tab === t.id ? 'bg-ink text-paper' : 'text-slate'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="p-5 sm:p-8">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'applications' && <ApplicationsTab />}
          {tab === 'candidates' && <CandidatesTab />}
        </main>
      </div>
    </div>
  );
}
