-- HireExact database schema (PostgreSQL)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- admin | super_admin
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'development-automation',
  country TEXT NOT NULL,
  flag TEXT,
  region TEXT NOT NULL, -- LATAM | Eastern Europe | South Asia | Southeast Asia | Africa
  avatar_url TEXT,
  years_experience INT NOT NULL DEFAULT 0,
  seniority TEXT NOT NULL, -- Mid-Level | Senior | Lead / Architect
  primary_stack TEXT[] NOT NULL DEFAULT '{}',
  secondary_skills TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate NUMERIC(10,2) NOT NULL,
  annual_salary NUMERIC(12,2) NOT NULL,
  us_equivalent_salary NUMERIC(12,2) NOT NULL,
  timezone TEXT NOT NULL,
  english_level TEXT NOT NULL,
  match_score INT NOT NULL DEFAULT 90,
  bio TEXT,
  vetted_badge_date TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  featured_project_title TEXT,
  featured_project_description TEXT,
  featured_project_tech TEXT[] NOT NULL DEFAULT '{}',
  available_from TEXT NOT NULL DEFAULT 'Immediate',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_category ON candidates(category);
CREATE INDEX IF NOT EXISTS idx_candidates_region ON candidates(region);
CREATE INDEX IF NOT EXISTS idx_candidates_published ON candidates(is_published);

-- Employers requesting to book an interview / start a hire
CREATE TABLE IF NOT EXISTS interview_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role_title TEXT,
  candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  candidate_name_snapshot TEXT,
  team_size INT,
  budget_range TEXT,
  preferred_timezone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | contacted | interview_scheduled | offer_sent | hired | closed_lost
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON interview_bookings(status);

-- Developers applying to join the vetted talent pool
CREATE TABLE IF NOT EXISTS talent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  role_title TEXT,
  years_experience INT,
  primary_stack TEXT[] NOT NULL DEFAULT '{}',
  desired_hourly_rate NUMERIC(10,2),
  portfolio_url TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted | screening | vetting | approved | rejected
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON talent_applications(status);

-- Safe upgrade for databases created before talent categories were introduced.
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'development-automation';
CREATE INDEX IF NOT EXISTS idx_candidates_category ON candidates(category);
