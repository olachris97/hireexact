import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';
import { Candidate, Region } from '../../types';

const REGIONS: Region[] = ['LATAM', 'Eastern Europe', 'South Asia', 'Southeast Asia', 'Africa'];
const SENIORITIES = ['Mid-Level', 'Senior', 'Lead / Architect'] as const;
const CATEGORIES = [
  ['development-automation', 'Development & Automation'], ['accounting-bookkeeping', 'Accounting & Bookkeeping'],
  ['sales-outreach', 'Sales & Outreach'], ['admin-support', 'General Admin & Support'],
  ['design-creative', 'Design & Creative'], ['marketing-content', 'Marketing & Content'],
  ['data-analytics', 'Data & Analytics'], ['finance-operations', 'Finance & Operations'],
] as const;

const emptyForm = {
  name: '',
  title: '',
  category: 'development-automation',
  country: '',
  flag: '',
  region: 'LATAM' as Region,
  avatar: '',
  yearsExperience: 5,
  seniority: 'Senior' as (typeof SENIORITIES)[number],
  primaryStack: '',
  secondarySkills: '',
  hourlyRate: 35,
  annualSalary: 50000,
  usEquivalentSalary: 150000,
  timezone: '',
  englishLevel: 'C1 Fluent',
  matchScore: 92,
  bio: '',
  availableFrom: 'Immediate' as const,
};

export const CandidatesTab: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .getAllCandidates()
      .then((res) => setCandidates(res.candidates))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const togglePublish = async (c: Candidate) => {
    setCandidates((prev) => prev.map((x) => (x.id === c.id ? { ...x, isPublished: !x.isPublished } : x)));
    await api.updateCandidate(c.id, { isPublished: !c.isPublished });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this candidate permanently?')) return;
    await api.deleteCandidate(id);
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        title: form.title,
        category: form.category,
        country: form.country,
        flag: form.flag || undefined,
        region: form.region,
        avatar: form.avatar || undefined,
        yearsExperience: Number(form.yearsExperience),
        seniority: form.seniority,
        primaryStack: form.primaryStack.split(',').map((s) => s.trim()).filter(Boolean),
        secondarySkills: form.secondarySkills.split(',').map((s) => s.trim()).filter(Boolean),
        hourlyRate: Number(form.hourlyRate),
        annualSalary: Number(form.annualSalary),
        usEquivalentSalary: Number(form.usEquivalentSalary),
        timezone: form.timezone,
        englishLevel: form.englishLevel,
        matchScore: Number(form.matchScore),
        bio: form.bio || undefined,
        highlights: [],
        availableFrom: form.availableFrom,
        isPublished: true,
      };
      const res = await api.createCandidate(payload);
      setCandidates((prev) => [res.candidate, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Could not create candidate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Candidates</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink text-paper text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add candidate
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-cloud border border-hairline rounded-xl p-5 mb-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Talent category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink">
                {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <Input label="Country" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as Region }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Seniority</label>
              <select
                value={form.seniority}
                onChange={(e) => setForm((f) => ({ ...f, seniority: e.target.value as any }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink"
              >
                {SENIORITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Years experience"
              type="number"
              value={String(form.yearsExperience)}
              onChange={(v) => setForm((f) => ({ ...f, yearsExperience: Number(v) }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Primary stack (comma separated)"
              value={form.primaryStack}
              onChange={(v) => setForm((f) => ({ ...f, primaryStack: v }))}
            />
            <Input
              label="Secondary skills (comma separated)"
              value={form.secondarySkills}
              onChange={(v) => setForm((f) => ({ ...f, secondarySkills: v }))}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Hourly rate (USD)"
              type="number"
              value={String(form.hourlyRate)}
              onChange={(v) => setForm((f) => ({ ...f, hourlyRate: Number(v) }))}
            />
            <Input
              label="Annual salary (USD)"
              type="number"
              value={String(form.annualSalary)}
              onChange={(v) => setForm((f) => ({ ...f, annualSalary: Number(v) }))}
            />
            <Input
              label="US equivalent salary"
              type="number"
              value={String(form.usEquivalentSalary)}
              onChange={(v) => setForm((f) => ({ ...f, usEquivalentSalary: Number(v) }))}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Timezone" value={form.timezone} onChange={(v) => setForm((f) => ({ ...f, timezone: v }))} />
            <Input label="English level" value={form.englishLevel} onChange={(v) => setForm((f) => ({ ...f, englishLevel: v }))} />
            <Input label="Avatar URL" value={form.avatar} onChange={(v) => setForm((f) => ({ ...f, avatar: v }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-teal text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Create candidate'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate">Loading…</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => (
            <div key={c.id} className="bg-cloud border border-hairline rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-hairline shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{c.name}</p>
                  <p className="text-xs text-slate truncate">{c.title} · {CATEGORIES.find(([value]) => value === c.category)?.[1] || c.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(c)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border ${
                    c.isPublished ? 'text-teal border-teal/25 bg-teal-soft' : 'text-slate border-hairline'
                  }`}
                >
                  {c.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {c.isPublished ? 'Published' : 'Hidden'}
                </button>
                <button onClick={() => remove(c.id)} className="p-1.5 rounded-md text-slate hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {candidates.length === 0 && <p className="text-sm text-slate">No candidates yet — add your first one above.</p>}
        </div>
      )}
    </div>
  );
};

const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}> = ({ label, value, onChange, type = 'text', required }) => (
  <div>
    <label className="block text-xs font-medium text-ink mb-1.5">
      {label} {required && <span className="text-teal">*</span>}
    </label>
    <input
      type={type}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink"
    />
  </div>
);
