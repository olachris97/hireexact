# HireExact v2 — Redesign + Full Backend

A rebuild of the HireExact marketing site in the spirit of StaffBrigade's clean, flat-fee-focused
positioning, plus a real backend: PostgreSQL-backed candidate directory, interview-booking and
talent-application pipelines with status tracking, and a password-protected admin dashboard.

```
hireexact-v2/
├── client/   React 19 + Vite + Tailwind v4 — the public site + admin dashboard
└── server/   Express + TypeScript + PostgreSQL — the API
```

## What's new vs. the original

- **Redesign**: light "Ink Navy / Paper / Bridge Teal / Amber" palette, Sora + Inter + IBM Plex
  Mono type system, and a clearer marketing structure (hero → how it works → wage savings →
  vetted talent → vetting process → testimonials → CTA) modeled on StaffBrigade's flat-fee
  positioning. (Note: staffbrigade.com is a JS-rendered site I couldn't screenshot directly, so
  the direction is based on their stated value proposition — one flat fee, no subscriptions, no
  wage markup — plus conventions common to premium staffing sites. Swap colors/fonts freely in
  `client/src/index.css` if you want it closer to something specific.)
- **Real backend** (previously the site had no persistence): PostgreSQL schema for candidates,
  interview bookings, and talent applications; JWT-authenticated admin API; an admin dashboard
  with an overview, status-tracked pipelines, and candidate management.
- **AI Talent Matcher** ported from the original Gemini integration, now server-side, with a
  graceful fallback response when no API key is configured.

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local, Docker, or a managed provider like Supabase/Render/RDS)

## 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string,
# set a real JWT_SECRET, and optionally GEMINI_API_KEY for the AI matcher

npm install
npm run migrate   # creates tables
npm run seed       # creates the first admin login + sample candidates
npm run dev         # starts the API on http://localhost:4000
```

The seed script prints the admin email/password it created (defaults to
`admin@hireexact.com` / `ChangeMe123!` unless you set `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env`). **Change this password after your first login** — there's
no self-service password reset yet, so update it directly in the `admins` table or re-run
the seed with a new password against a fresh database.

## 2. Frontend setup

```bash
cd client
npm install
npm run dev   # starts on http://localhost:5173, proxies /api to http://localhost:4000
```

Visit `http://localhost:5173` for the public site, and `http://localhost:5173/admin/login`
for the admin dashboard.

## 3. Production build

```bash
# backend
cd server && npm run build && npm start

# frontend
cd client && npm run build   # outputs static files to client/dist — deploy behind any static host
```

In production, set `CLIENT_ORIGIN` in the server's `.env` to your deployed frontend URL (for
CORS), and point the frontend's API calls at your deployed backend — either by hosting both
behind the same domain/reverse proxy (recommended, matches the dev proxy setup) or by adding
a `VITE_API_BASE_URL` env var and using it in `client/src/lib/api.ts` if you deploy them
separately.

## Admin dashboard

- **Overview** — published candidate count, pipeline funnels for interview requests and talent
  applications, recent activity.
- **Interview requests** — every "start hiring" submission from the site, with status tracking
  (`new → contacted → interview_scheduled → offer_sent → hired / closed_lost`) and internal notes.
- **Talent applications** — every "apply as talent" submission, with status tracking
  (`submitted → screening → vetting → approved / rejected`).
- **Candidates** — add candidates to the public talent directory, publish/unpublish them, delete.

## Notes

- The AI Talent Matcher works without `GEMINI_API_KEY` set — it returns a clearly-labeled
  fallback response instead of failing, so the feature is safe to ship without a key configured.
- Admin auth uses JWTs stored in `sessionStorage` (cleared when the browser tab closes). Swap in
  httpOnly cookies if you want persistence across sessions or extra XSS hardening.
- All monetary/candidate data in the seed script is illustrative — replace with real candidates
  before going live.
