import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WageBridgeSectionProps {
  onOpenHireModal: () => void;
}

const ROLES = [
  { role: 'Senior Full-Stack Engineer', us: 165000, hireexact: 54000 },
  { role: 'DevOps / Infrastructure Engineer', us: 158000, hireexact: 50000 },
  { role: 'Staff Frontend Engineer', us: 172000, hireexact: 58000 },
  { role: 'Backend Engineer (Python)', us: 150000, hireexact: 46000 },
];

function pct(us: number, he: number) {
  return Math.round(((us - he) / us) * 100);
}

export const WageBridgeSection: React.FC<WageBridgeSectionProps> = ({ onOpenHireModal }) => {
  return (
    <section id="wage-bridge" className="py-20 sm:py-28 px-5 sm:px-8 bg-paper">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">The wage bridge</span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
            Same seniority. A fraction of the US cost.
          </h2>
          <p className="mt-4 text-slate leading-relaxed">
            Our talent pool spans LATAM, Eastern Europe, South &amp; Southeast Asia, and Africa — regions with deep
            engineering talent and strong US-timezone overlap. You get senior-level work without the Bay Area price
            tag.
          </p>
          <button
            onClick={onOpenHireModal}
            className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors"
          >
            See savings for your role
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {ROLES.map((r) => {
            const savings = pct(r.us, r.hireexact);
            return (
              <div key={r.role} className="bg-cloud border border-hairline rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-ink">{r.role}</span>
                  <span className="font-mono text-xs font-semibold text-teal bg-teal-soft px-2 py-0.5 rounded-full">
                    -{savings}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate w-16 shrink-0">US avg</span>
                    <div className="flex-1 h-2 rounded-full bg-paper-dim overflow-hidden">
                      <div className="h-full rounded-full bg-hairline" style={{ width: '100%' }} />
                    </div>
                    <span className="font-mono text-xs text-ink w-16 text-right">${(r.us / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate w-16 shrink-0">HireExact</span>
                    <div className="flex-1 h-2 rounded-full bg-paper-dim overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${(r.hireexact / r.us) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-teal font-semibold w-16 text-right">
                      ${(r.hireexact / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
