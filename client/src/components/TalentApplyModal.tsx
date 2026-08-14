import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface TalentApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalentApplyModal: React.FC<TalentApplyModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    country: '',
    roleTitle: '',
    yearsExperience: '',
    primaryStack: '',
    desiredHourlyRate: '',
    portfolioUrl: '',
    linkedinUrl: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createApplication({
        fullName: form.fullName,
        email: form.email,
        country: form.country || undefined,
        roleTitle: form.roleTitle || undefined,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        primaryStack: form.primaryStack
          ? form.primaryStack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        desiredHourlyRate: form.desiredHourlyRate ? Number(form.desiredHourlyRate) : undefined,
        portfolioUrl: form.portfolioUrl || undefined,
        linkedinUrl: form.linkedinUrl || undefined,
        notes: form.notes || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={close}>
      <div
        className="bg-cloud rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Apply as talent</h3>
            <p className="text-xs text-slate mt-0.5">Join the vetted pool — top 3% of applicants are accepted.</p>
          </div>
          <button onClick={close} className="p-1.5 rounded-md hover:bg-paper-dim text-slate">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-soft flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-teal" />
            </div>
            <h4 className="font-display font-semibold text-ink text-lg mb-1.5">Application submitted</h4>
            <p className="text-sm text-slate">
              We'll review your profile and follow up by email if you're invited to the next vetting stage.
            </p>
            <button onClick={close} className="mt-6 px-5 py-2.5 rounded-lg bg-ink text-paper text-sm font-semibold">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name" required value={form.fullName} onChange={update('fullName')} />
              <Field label="Email" type="email" required value={form.email} onChange={update('email')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country" value={form.country} onChange={update('country')} />
              <Field label="Years of experience" type="number" value={form.yearsExperience} onChange={update('yearsExperience')} />
            </div>
            <Field label="Current role / title" value={form.roleTitle} onChange={update('roleTitle')} />
            <Field
              label="Primary tech stack"
              value={form.primaryStack}
              onChange={update('primaryStack')}
              placeholder="React, Node.js, PostgreSQL (comma separated)"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Desired hourly rate (USD)" type="number" value={form.desiredHourlyRate} onChange={update('desiredHourlyRate')} />
              <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={update('linkedinUrl')} />
            </div>
            <Field label="Portfolio / GitHub URL" value={form.portfolioUrl} onChange={update('portfolioUrl')} />
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Anything else we should know?</label>
              <textarea
                value={form.notes}
                onChange={update('notes')}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', required, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-ink mb-1.5">
      {label} {required && <span className="text-teal">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg border border-hairline bg-paper text-sm text-ink focus:border-teal outline-none"
    />
  </div>
);
