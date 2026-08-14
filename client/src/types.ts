export type Region = 'LATAM' | 'Eastern Europe' | 'South Asia' | 'Southeast Asia' | 'Africa';

export interface Candidate {
  id: string;
  name: string;
  title: string;
  category: string;
  country: string;
  flag: string;
  region: Region;
  avatar: string;
  yearsExperience: number;
  seniority: 'Mid-Level' | 'Senior' | 'Lead / Architect';
  primaryStack: string[];
  secondarySkills: string[];
  hourlyRate: number;
  annualSalary: number;
  usEquivalentSalary: number;
  timezone: string;
  englishLevel: string;
  matchScore: number;
  bio: string;
  vettedBadgeDate: string;
  highlights: string[];
  featuredProject: { title: string; description: string; tech: string[] };
  availableFrom: 'Immediate' | 'In 1 Week' | 'In 2 Weeks';
  isPublished?: boolean;
}

export type BookingStatus = 'new' | 'contacted' | 'interview_scheduled' | 'offer_sent' | 'hired' | 'closed_lost';

export interface Booking {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  roleTitle?: string;
  candidateId?: string | null;
  candidateName?: string;
  teamSize?: number;
  budgetRange?: string;
  preferredTimezone?: string;
  message?: string;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'submitted' | 'screening' | 'vetting' | 'approved' | 'rejected';

export interface TalentApplication {
  id: string;
  fullName: string;
  email: string;
  country?: string;
  roleTitle?: string;
  yearsExperience?: number;
  primaryStack: string[];
  desiredHourlyRate?: number | null;
  portfolioUrl?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  notes?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role: string;
}
