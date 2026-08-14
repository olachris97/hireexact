import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onOpenHireModal: () => void;
  onOpenAiMatcher: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenHireModal, onOpenAiMatcher }) => {
  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-soft border border-teal/20 text-teal text-xs font-semibold mb-7">
          <ShieldCheck className="w-3.5 h-3.5" />
          1,400+ engineers vetted · top 3% accepted
        </div>

        <h1 className="font-display font-bold text-[2.4rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] text-ink tracking-tight max-w-4xl mx-auto">
          Hire vetted developers.
          <br />
          Pay one flat fee, <span className="text-teal">once.</span>
        </h1>

        <p className="mt-6 text-lg text-slate max-w-2xl mx-auto leading-relaxed">
          We find and vet a senior engineer for your team. You interview them, hire them directly, and pay them
          directly. No subscriptions, no monthly markup on their salary — just one placement fee.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenHireModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-ink text-paper font-semibold text-sm hover:bg-ink-soft transition-colors shadow-md"
          >
            Start hiring — book a call
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAiMatcher}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-cloud text-ink font-semibold text-sm border border-hairline hover:border-teal/40 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-teal" />
            Try the AI talent matcher
          </button>
        </div>

        {/* Signature element: flat-fee receipt strip */}
        <div className="receipt-strip mt-14 max-w-xl mx-auto bg-cloud border border-hairline rounded-xl px-6 py-5 text-left shadow-sm">
          <div className="flex items-center justify-between text-[13px] text-slate pb-3 dash">
            <span>Monthly subscription fee</span>
            <span className="text-ink font-medium">$0.00</span>
          </div>
          <div className="flex items-center justify-between text-[13px] text-slate py-3 dash">
            <span>Markup on developer's wage</span>
            <span className="text-ink font-medium">$0.00</span>
          </div>
          <div className="flex items-center justify-between text-[13px] text-slate pt-3">
            <span className="font-medium">HireExact placement fee</span>
            <span className="text-teal font-semibold">One flat fee, paid once</span>
          </div>
        </div>
      </div>
    </section>
  );
};
