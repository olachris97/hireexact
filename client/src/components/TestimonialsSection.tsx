import React from 'react';

const TESTIMONIALS = [
  {
    quote: "We hired a senior backend engineer within a week. No markup on his pay, and the process felt honest from the first call.",
    name: 'Priya Shah',
    role: 'CTO, Fintech Startup',
    metric: 'Saved $108k/yr',
  },
  {
    quote: "The flat fee model meant our CFO didn't have to think twice. Vetting quality was better than two agencies we'd tried before.",
    name: 'Daniel Osei',
    role: 'Head of Engineering, SaaS Co.',
    metric: '3 hires in 6 weeks',
  },
  {
    quote: 'Straightforward, transparent, and the candidates were genuinely strong. Exactly what the name promises.',
    name: 'Laura Bennett',
    role: 'Founder, E-commerce Platform',
    metric: '65% cost reduction',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="stories" className="py-20 sm:py-28 px-5 sm:px-8 bg-cloud border-y border-hairline">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">Client stories</span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
            Teams that hired through HireExact
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-paper border border-hairline rounded-xl p-6 flex flex-col">
              <p className="text-sm text-ink leading-relaxed flex-1">"{t.quote}"</p>
              <div className="mt-5 pt-5 border-t border-hairline flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-slate">{t.role}</p>
                </div>
                <span className="font-mono text-[11px] font-semibold text-teal bg-teal-soft px-2 py-1 rounded-full whitespace-nowrap">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
