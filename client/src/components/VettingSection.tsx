import React from 'react';
import { FileCheck2, Code2, MessagesSquare, BadgeCheck } from 'lucide-react';

const STAGES = [
  { icon: FileCheck2, title: 'Application review', passRate: '100% → 35%', description: 'Resume, portfolio, and work history screened against role requirements.' },
  { icon: Code2, title: 'Technical assessment', passRate: '35% → 12%', description: 'Live coding and system design rounds scored by senior engineers.' },
  { icon: MessagesSquare, title: 'Communication & culture', passRate: '12% → 5%', description: 'English fluency, async communication, and reliability checks.' },
  { icon: BadgeCheck, title: 'Vetted & ready', passRate: 'Top 3%', description: 'Added to the talent pool, available for interviews within days.' },
];

export const VettingSection: React.FC = () => {
  return (
    <section id="vetting" className="py-20 sm:py-28 px-5 sm:px-8 bg-paper">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">Our vetting</span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
            Only the top 3% make it through.
          </h2>
          <p className="mt-4 text-slate leading-relaxed">
            Every engineer in our pool passes four stages before they're eligible for an interview with you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAGES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-cloud border border-hairline rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-soft flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber" />
                </div>
                <p className="font-mono text-[11px] text-slate mb-1.5">{s.passRate}</p>
                <h3 className="font-display font-semibold text-sm text-ink mb-2">{s.title}</h3>
                <p className="text-xs text-slate leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
