import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface AiTalentMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedCandidate: (candName: string, roleTitle: string) => void;
}

export const AiTalentMatcherModal: React.FC<AiTalentMatcherModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedCandidate,
}) => {
  const [form, setForm] = useState({
    jobTitle: '',
    techStack: '',
    seniority: 'Senior (5+ yrs)',
    budgetRange: '',
    projectType: '',
    teamSize: '1',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFallbackNote(null);
    try {
      const res = await api.matchTalent({
        jobTitle: form.jobTitle,
        techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
        seniority: form.seniority,
        budgetRange: form.budgetRange,
        projectType: form.projectType,
        teamSize: Number(form.teamSize) || 1,
      });
      setResult(res.data);
      if (res.fallback) setFallbackNote(res.message || null);
    } catch (err: any) {
      setError(err.message || 'Could not generate a match right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={close}>
      <div
        className="bg-cloud rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-soft flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-teal" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-ink">AI Talent Matcher</h3>
              <p className="text-xs text-slate mt-0.5">Get instant wage benchmarks and role guidance</p>
            </div>
          </div>
          <button onClick={close} className="p-1.5 rounded-md hover:bg-paper-dim text-slate">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Job title</label>
              <input
                required
                value={form.jobTitle}
                onChange={update('jobTitle')}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Tech stack</label>
              <input
                value={form.techStack}
                onChange={update('techStack')}
                placeholder="React, Node.js, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Seniority</label>
                <select
                  value={form.seniority}
                  onChange={update('seniority')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
                >
                  <option>Mid-Level (2-4 yrs)</option>
                  <option>Senior (5+ yrs)</option>
                  <option>Lead / Architect</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Team size</label>
                <input
                  type="number"
                  min={1}
                  value={form.teamSize}
                  onChange={update('teamSize')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Budget range (optional)</label>
              <input
                value={form.budgetRange}
                onChange={update('budgetRange')}
                placeholder="e.g. $40–60/hr"
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Project context (optional)</label>
              <input
                value={form.projectType}
                onChange={update('projectType')}
                placeholder="e.g. Rapid scaling startup"
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Matching…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate match
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            {fallbackNote && (
              <p className="text-xs text-slate bg-paper-dim rounded-lg px-3.5 py-2.5">{fallbackNote}</p>
            )}
            <p className="text-sm text-ink leading-relaxed">{result.summary}</p>

            {result.wageBridge && (
              <div className="bg-paper border border-hairline rounded-xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-slate mb-0.5">US market avg</p>
                  <p className="font-mono text-sm font-semibold text-ink">{result.wageBridge.usMarketAvg}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate mb-0.5">HireExact avg</p>
                  <p className="font-mono text-sm font-semibold text-teal">{result.wageBridge.hireExactAvg}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate mb-0.5">Annual savings</p>
                  <p className="font-mono text-sm font-semibold text-ink">{result.wageBridge.annualSavingsDollar}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate mb-0.5">Savings %</p>
                  <p className="font-mono text-sm font-semibold text-teal">{result.wageBridge.savingsPercentage}</p>
                </div>
              </div>
            )}

            {result.candidates?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Suggested candidates</p>
                {result.candidates.map((c: any, i: number) => (
                  <div key={i} className="bg-paper border border-hairline rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-ink">{c.name}</p>
                      <span className="font-mono text-[11px] font-semibold text-teal bg-teal-soft px-1.5 py-0.5 rounded">
                        {c.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-slate mb-2">
                      {c.title} · {c.location}
                    </p>
                    <p className="text-xs text-ink mb-3">{c.bioHighlight}</p>
                    <button
                      onClick={() => {
                        onSelectRecommendedCandidate(c.name, result.roleTitle || form.jobTitle);
                        close();
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-teal"
                    >
                      Request interview <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {result.roiAdvice && <p className="text-xs text-slate leading-relaxed">{result.roiAdvice}</p>}

            <button
              onClick={() => {
                onSelectRecommendedCandidate('', result.roleTitle || form.jobTitle);
                close();
              }}
              className="w-full py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors"
            >
              Book a call about this role
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
