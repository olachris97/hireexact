import React from 'react';
import { Link } from 'react-router-dom';

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <header className="border-b border-hairline bg-cloud">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="font-display font-bold text-lg">HireExact</Link>
          <Link to="/" className="text-sm font-medium text-slate hover:text-ink">Back to HireExact</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal mb-3">{eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">{title}</h1>
          <p className="mt-4 text-base sm:text-lg leading-8 text-slate">{intro}</p>
          <p className="mt-3 text-xs text-slate">Last updated: August 17, 2026</p>
        </div>
        <div className="grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-hairline bg-cloud p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold mb-3">{section.title}</h2>
              {section.paragraphs?.map((p) => <p key={p} className="text-sm sm:text-base leading-7 text-slate mb-3">{p}</p>)}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-7 text-slate">
                  {section.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <footer className="border-t border-hairline bg-cloud">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 text-sm text-slate">
          <p>HireExact Ltd · 1500 N Grant St Ste C, Denver, CO 80203, United States</p>
          <p className="mt-2">Support@hire-exact.com · +1 303-720-6109</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <Link to="/refund-cancellation">Refund & Cancellation</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
