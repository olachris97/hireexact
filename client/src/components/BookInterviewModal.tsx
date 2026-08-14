import React, { useEffect, useState } from 'react';
import {
  Award,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { Candidate } from '../types';
import { api } from '../lib/api';

interface BookInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: Candidate | null;
}

export const BookInterviewModal: React.FC<BookInterviewModalProps> = ({ isOpen, onClose, selectedCandidate }) => {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    roleTitle: '',
    teamSize: '',
    budgetRange: '',
    preferredTimezone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError(null);
      setForm((f) => ({
        ...f,
        roleTitle: selectedCandidate?.title || f.roleTitle,
      }));
    }
  }, [isOpen, selectedCandidate]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createBooking({
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone || undefined,
        roleTitle: form.roleTitle || undefined,
        candidateId: selectedCandidate?.id,
        candidateName: selectedCandidate?.name,
        teamSize: form.teamSize ? Number(form.teamSize) : undefined,
        budgetRange: form.budgetRange || undefined,
        preferredTimezone: form.preferredTimezone || undefined,
        message: form.message || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-sm p-3 sm:p-5 lg:p-8 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={selectedCandidate ? `Book ${selectedCandidate.name}` : 'Start hiring'}
    >
      <div
        className="min-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-cloud rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-40px)] lg:max-h-[calc(100vh-64px)] overflow-hidden shadow-2xl border border-white/20 animate-[fadeIn_180ms_ease-out] flex flex-col">
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-hairline bg-cloud shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">HireExact</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-ink mt-1">
                {selectedCandidate ? 'Meet your potential hire' : 'Start hiring'}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg hover:bg-paper-dim text-slate transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="overflow-y-auto p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-soft flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-teal" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Request received</p>
              <h4 className="font-display font-bold text-2xl text-ink mt-2">We'll help you make the match.</h4>
              <p className="text-sm text-slate max-w-md mx-auto mt-3 leading-6">
                Our team will review your request and reach out within one business day to coordinate the next step.
              </p>
              <button onClick={onClose} className="mt-7 px-6 py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="overflow-y-auto">
              <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="bg-paper border-b lg:border-b-0 lg:border-r border-hairline p-5 sm:p-7">
                  {selectedCandidate ? (
                    <CandidateProfile candidate={selectedCandidate} />
                  ) : (
                    <GenericHiringProfile />
                  )}
                </aside>

                <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8 space-y-5">
                  <div className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal">Tell us about the role</p>
                    <h4 className="font-display font-bold text-xl text-ink mt-1">Let's plan the right hire.</h4>
                    <p className="text-sm text-slate mt-1.5 leading-5">Share a few details and we'll coordinate the interview process.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Company name" required value={form.companyName} onChange={update('companyName')} />
                    <Field label="Your name" required value={form.contactName} onChange={update('contactName')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Work email" type="email" required value={form.email} onChange={update('email')} />
                    <Field label="Phone (optional)" value={form.phone} onChange={update('phone')} />
                  </div>
                  <Field label="Role you're hiring for" value={form.roleTitle} onChange={update('roleTitle')} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Team size to hire" type="number" min="1" value={form.teamSize} onChange={update('teamSize')} />
                    <Field label="Budget range" value={form.budgetRange} onChange={update('budgetRange')} placeholder="e.g. $40–60/hr" />
                  </div>
                  <Field label="Preferred timezone overlap" value={form.preferredTimezone} onChange={update('preferredTimezone')} placeholder="e.g. 9am–1pm ET" />
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1.5">Anything else we should know?</label>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      rows={4}
                      placeholder="Tell us about the work, start date, or anything important about the role."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink placeholder:text-slate/60 focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none resize-none transition"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{error}</p>}

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending request…' : selectedCandidate ? `Request interview with ${selectedCandidate.name}` : 'Request a hiring conversation'}
                    </button>
                    <p className="text-[11px] text-slate text-center mt-2.5">No commitment required. We'll confirm the next step with you.</p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateProfile: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
  <div>
    <div className="relative">
      <img
        src={candidate.avatar}
        alt={candidate.name}
        className="w-24 h-24 rounded-2xl object-cover border-4 border-cloud shadow-sm"
      />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal text-white border-4 border-paper flex items-center justify-center">
        <ShieldCheck className="w-4 h-4" />
      </div>
    </div>

    <div className="mt-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display font-bold text-2xl text-ink leading-tight">{candidate.name}</h4>
          <p className="text-sm text-slate mt-1">{candidate.title}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-teal-soft text-teal px-2.5 py-1 text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" /> {candidate.matchScore}% match
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate">
        <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal" />{candidate.country} {candidate.flag}</span>
        <span className="inline-flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5 text-teal" />{candidate.timezone}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2.5 mt-6">
      <MiniStat icon={<BriefcaseBusiness className="w-3.5 h-3.5" />} label="Experience" value={`${candidate.yearsExperience} years`} />
      <MiniStat icon={<Award className="w-3.5 h-3.5" />} label="Level" value={candidate.seniority} />
      <MiniStat icon={<Clock3 className="w-3.5 h-3.5" />} label="Available" value={candidate.availableFrom} />
      <MiniStat icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Vetted" value="HireExact" />
    </div>

    <div className="mt-6 pt-5 border-t border-hairline">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Core skills</p>
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {[...candidate.primaryStack, ...candidate.secondarySkills].slice(0, 10).map((skill) => (
          <span key={skill} className="text-[11px] px-2.5 py-1 rounded-full bg-cloud border border-hairline text-ink">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-6 rounded-xl bg-cloud border border-hairline p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-ink">
        <CheckCircle2 className="w-4 h-4 text-teal" /> Ready for interview
      </div>
      <p className="text-xs text-slate leading-5 mt-1.5">{candidate.bio || 'Vetted and ready to discuss your role, scope, and start date.'}</p>
    </div>
  </div>
);

const GenericHiringProfile = () => (
  <div className="flex flex-col justify-center min-h-[420px]">
    <div className="w-12 h-12 rounded-xl bg-teal-soft flex items-center justify-center text-teal">
      <Sparkles className="w-5 h-5" />
    </div>
    <h4 className="font-display font-bold text-2xl text-ink mt-5">Tell us what you need.</h4>
    <p className="text-sm text-slate leading-6 mt-2">We'll help you identify the right function, seniority, and talent profile for your team.</p>
    <div className="mt-6 space-y-3">
      {['Clarify the role', 'Shortlist vetted talent', 'Coordinate interviews'].map((item) => (
        <div key={item} className="flex items-center gap-2.5 text-sm text-ink">
          <span className="w-6 h-6 rounded-full bg-cloud border border-hairline flex items-center justify-center"><Check className="w-3.5 h-3.5 text-teal" /></span>
          {item}
        </div>
      ))}
    </div>
  </div>
);

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-lg bg-cloud border border-hairline p-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate">{icon}{label}</div>
    <p className="text-xs font-semibold text-ink mt-1.5 leading-4">{value}</p>
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
}> = ({ label, value, onChange, type = 'text', required, placeholder, min }) => (
  <div>
    <label className="block text-xs font-medium text-ink mb-1.5">
      {label} {required && <span className="text-teal">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink placeholder:text-slate/60 focus:border-teal focus:ring-2 focus:ring-teal/10 outline-none transition"
    />
  </div>
);
