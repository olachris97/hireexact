import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  onOpenHireModal: () => void;
  onOpenApplyModal: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenHireModal, onOpenApplyModal }) => {
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8 bg-ink">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
          Ready to hire, or ready to be hired?
        </h2>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto" style={{ color: '#B7BFCC' }}>
          Whichever side of the bridge you're on, it starts with a five-minute conversation.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenHireModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-paper text-ink font-semibold text-sm hover:bg-white transition-colors"
          >
            Book a hiring call
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenApplyModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-white/20 text-paper font-semibold text-sm hover:bg-white/5 transition-colors"
          >
            Apply as a developer
          </button>
        </div>
      </div>
    </section>
  );
};
