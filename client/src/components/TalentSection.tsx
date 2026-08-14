import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, MapPin, Users, X } from 'lucide-react';
import { Candidate, Region } from '../types';
import { api } from '../lib/api';

interface TalentSectionProps { onSelectCandidate: (c: Candidate) => void; }
const REGIONS: (Region | 'all')[] = ['all', 'LATAM', 'Eastern Europe', 'South Asia', 'Southeast Asia', 'Africa'];
const INITIAL_TALENT_COUNT = 6;

export const TALENT_CATEGORIES = [
  { id: 'development-automation', name: 'Development & Automation', description: 'Software engineers, developers, DevOps specialists, and automation experts who build reliable digital products and workflows.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=85&w=1200' },
  { id: 'accounting-bookkeeping', name: 'Accounting & Bookkeeping', description: 'Bookkeepers and accounting professionals who keep your books accurate, reconciled, organized, and ready for decision-making.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=85&w=1200' },
  { id: 'sales-outreach', name: 'Sales & Outreach', description: 'Sales development, lead generation, appointment setting, and outreach talent who keep your pipeline moving.', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1200' },
  { id: 'admin-support', name: 'General Admin & Support', description: 'Virtual assistants, customer support, operations, research, and administrative talent for the work that keeps teams moving.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=85&w=1200' },
  { id: 'design-creative', name: 'Design & Creative', description: 'Product designers, graphic designers, UX specialists, and creative professionals who turn ideas into polished experiences.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=85&w=1200' },
  { id: 'marketing-content', name: 'Marketing & Content', description: 'Content, social media, SEO, email, and performance marketing talent built to grow attention and demand.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1200' },
  { id: 'data-analytics', name: 'Data & Analytics', description: 'Data analysts, scientists, and BI specialists who turn business data into useful insight and action.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1200' },
  { id: 'finance-operations', name: 'Finance & Operations', description: 'Finance, operations, procurement, and business-process professionals who bring structure and efficiency to your company.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1200' },
] as const;

export const TalentSection: React.FC<TalentSectionProps> = ({ onSelectCandidate }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllTalent, setShowAllTalent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    api.getCandidates(region !== 'all' ? { region } : undefined)
      .then((res) => setCandidates(res.candidates))
      .catch(() => setError('Could not load talent directory. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, [region]);

  const counts = useMemo(() => candidates.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {}), [candidates]);

  const activeCategoryData = TALENT_CATEGORIES.find((c) => c.id === activeCategory);
  const activeCandidates = activeCategory ? candidates.filter((c) => c.category === activeCategory) : [];
  const displayedCandidates = showAllTalent ? activeCandidates : activeCandidates.slice(0, INITIAL_TALENT_COUNT);
  const hasMoreTalent = activeCandidates.length > INITIAL_TALENT_COUNT;

  const handleCategoryClick = (categoryId: string) => {
    const isClosing = activeCategory === categoryId;
    setActiveCategory(isClosing ? null : categoryId);
    setShowAllTalent(false);

    if (!isClosing) {
      window.setTimeout(() => {
        activePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  useEffect(() => {
    setActiveCategory(null);
    setShowAllTalent(false);
  }, [region]);

  return (
    <section id="talent" className="py-20 sm:py-28 px-5 sm:px-8 bg-cloud border-y border-hairline">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">Vetted talent</span>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">Find the right talent for the work you need done.</h2>
          <p className="mt-4 text-slate leading-relaxed">Start with the function you need. Open a category to meet vetted professionals, compare profiles, and book the people who fit your role.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${region === r ? 'bg-ink text-paper border-ink' : 'bg-cloud text-slate border-hairline hover:border-ink/30'}`}>
                {r === 'all' ? 'All regions' : r}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate">{candidates.length} vetted {candidates.length === 1 ? 'professional' : 'professionals'} in the current view</p>
        </div>

        {loading && <div className="grid sm:grid-cols-2 gap-5">{[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-paper-dim animate-pulse" />)}</div>}
        {error && <p className="text-sm text-slate">{error}</p>}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 gap-5 items-start">
            {TALENT_CATEGORIES.map((category) => {
              const count = counts[category.id] || 0;
              const selected = activeCategory === category.id;

              return (
                <React.Fragment key={category.id}>
                  <div className={`overflow-hidden rounded-2xl border bg-paper transition-all duration-300 ${selected ? 'border-teal shadow-lg ring-1 ring-teal/10' : 'border-hairline hover:border-ink/25 hover:shadow-md'}`}>
                    <button onClick={() => handleCategoryClick(category.id)} aria-expanded={selected} className="group w-full text-left">
                      <div className="h-40 sm:h-44 overflow-hidden">
                        <img src={category.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-display font-bold text-xl text-ink">{category.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
                          </div>
                          <ArrowRight className={`w-5 h-5 shrink-0 mt-1 transition-all ${selected ? 'rotate-90 text-teal' : 'text-slate group-hover:translate-x-1'}`} />
                        </div>
                        <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink"><Users className="w-3.5 h-3.5 text-teal" />{count} {count === 1 ? 'talent' : 'talents'} available</span>
                          <span className="text-xs font-semibold text-teal">{selected ? 'Close' : 'Meet the talent'}</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {selected && (
                    <div ref={activePanelRef} className="sm:col-span-2 rounded-2xl border border-teal/20 bg-paper shadow-sm overflow-hidden animate-[fadeIn_220ms_ease-out]">
                      <div className="p-5 sm:p-7 border-b border-hairline bg-cloud">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-teal" />
                              <span className="text-xs font-semibold text-teal uppercase tracking-wider">Available professionals</span>
                            </div>
                            <h3 className="mt-2 font-display font-bold text-2xl text-ink">{activeCategoryData?.name}</h3>
                            <p className="mt-1 text-sm text-slate">Compare vetted profiles below, then choose the person you want to interview.</p>
                          </div>
                          <button onClick={() => handleCategoryClick(category.id)} className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-hairline bg-cloud text-xs font-semibold text-slate hover:text-ink hover:border-ink/25 transition-colors">
                            <X className="w-3.5 h-3.5" /> Close category
                          </button>
                        </div>
                      </div>

                      <div className="p-5 sm:p-7">
                        {displayedCandidates.length > 0 ? (
                          <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {displayedCandidates.map((c) => (
                                <button key={c.id} onClick={() => onSelectCandidate(c)} className="text-left bg-cloud border border-hairline rounded-xl p-5 hover:border-teal/40 hover:shadow-md transition-all group">
                                  <div className="flex items-start justify-between mb-4 gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img src={c.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-hairline shrink-0" />
                                      <div className="min-w-0">
                                        <p className="font-semibold text-sm text-ink truncate">{c.name}</p>
                                        <p className="text-xs text-slate flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" /> {c.country} {c.flag}</p>
                                      </div>
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-teal bg-teal-soft px-1.5 py-0.5 rounded shrink-0">{c.matchScore}%</span>
                                  </div>
                                  <p className="text-sm font-medium text-ink mb-3 leading-snug">{c.title}</p>
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {c.primaryStack.slice(0, 4).map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-paper border border-hairline text-slate">{s}</span>)}
                                  </div>
                                  <div className="flex items-center justify-between pt-3 border-t border-hairline">
                                    <span className="text-xs text-slate flex items-center gap-1"><Clock className="w-3 h-3" /> {c.availableFrom}</span>
                                    <span className="text-xs font-semibold text-ink flex items-center gap-1 group-hover:text-teal transition-colors"><CheckCircle2 className="w-3 h-3" /> View &amp; book</span>
                                  </div>
                                </button>
                              ))}
                            </div>

                            {hasMoreTalent && (
                              <div className="mt-6 flex justify-center">
                                <button onClick={() => setShowAllTalent((value) => !value)} className="px-4 py-2.5 rounded-lg border border-hairline bg-cloud text-sm font-semibold text-ink hover:border-teal/40 hover:text-teal transition-colors">
                                  {showAllTalent ? 'Show fewer profiles' : `View all ${activeCandidates.length} talents`}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="rounded-xl border border-dashed border-hairline bg-cloud p-8 text-center">
                            <p className="font-semibold text-ink">More talent is being added to this category.</p>
                            <p className="mt-1 text-sm text-slate">Ask us to source a specialist for this function and we'll help you find the right fit.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
