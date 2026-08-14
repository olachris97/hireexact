import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAiMatcher: () => void;
  onOpenHireModal: () => void;
  onOpenApplyModal: () => void;
}

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'wage-bridge', label: 'Savings' },
  { id: 'talent', label: 'Vetted talent' },
  { id: 'vetting', label: 'Our vetting' },
  { id: 'stories', label: 'Client stories' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiMatcher, onOpenHireModal, onOpenApplyModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-cloud/95 backdrop-blur-md border-hairline shadow-[0_1px_0_0_rgba(11,27,51,0.04)]' : 'bg-paper/80 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center text-paper font-display font-bold text-lg group-hover:bg-teal transition-colors">
              H
            </span>
            <span className="font-display font-bold text-lg text-ink tracking-tight">HireExact</span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-3.5 py-2 rounded-md text-sm font-medium text-slate hover:text-ink hover:bg-paper-dim transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenAiMatcher}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium text-teal border border-teal/25 bg-teal-soft hover:bg-teal/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Matcher
            </button>
            <button
              onClick={onOpenApplyModal}
              className="px-3.5 py-2 rounded-md text-sm font-medium text-ink hover:bg-paper-dim transition-colors"
            >
              Join as talent
            </button>
            <button
              onClick={onOpenHireModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold bg-ink text-paper hover:bg-ink-soft transition-colors shadow-sm"
            >
              Start hiring
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-ink border border-hairline"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-cloud border-t border-hairline px-5 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-ink hover:bg-paper-dim"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-2 grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenAiMatcher();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-semibold text-teal border border-teal/25 bg-teal-soft"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Talent Matcher
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenApplyModal();
              }}
              className="py-2.5 rounded-md text-sm font-semibold text-ink border border-hairline"
            >
              Join as talent
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenHireModal();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-semibold bg-ink text-paper"
            >
              Start hiring <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
