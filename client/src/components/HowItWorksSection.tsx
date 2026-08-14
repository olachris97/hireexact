import React from 'react';
import { ClipboardList, Users2, Handshake } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: ClipboardList,
    title: 'Tell us what you need',
    description: 'Share the role, tech stack, seniority, and budget. Takes about five minutes, no job listing required.',
  },
  {
    n: '02',
    icon: Users2,
    title: 'Meet your shortlist',
    description: 'We hand-pick 2–3 vetted candidates who match, usually within 3–5 business days. You interview them directly.',
  },
  {
    n: '03',
    icon: Handshake,
    title: 'Hire and pay directly',
    description: "Like who you meet? You hire them and pay them directly — no HireExact markup on their pay, ever. You pay us one flat fee, once.",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-5 sm:px-8 bg-cloud border-y border-hairline">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">How it works</span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
            Three steps. No agency games.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(100%-1.25rem)] w-8 h-px bg-hairline" />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs text-slate">{step.n}</span>
                  <div className="w-10 h-10 rounded-lg bg-teal-soft flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
