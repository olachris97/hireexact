# HireExact v2 — Render + Hostinger deployment

## Architecture
- Frontend: React/Vite static build hosted on Hostinger.
- Backend/API: Express/TypeScript hosted on Render.
- Database: PostgreSQL hosted on Render.
- The frontend calls the Render API using `VITE_API_BASE_URL`.

## Render
This repository includes `render.yaml`.
1. Push the project to GitHub.
2. In Render, create a Blueprint from the repository.
3. Render creates `hireexact-api` and `hireexact-db`.
4. In the API service Environment settings, set:
   - `CLIENT_ORIGIN` = your final Hostinger website URL, e.g. `https://www.yourdomain.com`
   - `GEMINI_API_KEY` = your Gemini key (optional)
   - `SEED_ADMIN_EMAIL` = your real admin email
   - `SEED_ADMIN_PASSWORD` = a strong admin password
5. Deploy. Check:
   `https://YOUR-RENDER-SERVICE.onrender.com/api/health`
   It should return JSON with `status: "ok"`.

The database migration runs automatically before deployment.

## Hostinger
After the Render API is live:
1. Copy `client/.env.production.example` to `client/.env.production`.
2. Replace `VITE_API_BASE_URL` with the actual Render API URL.
3. From `client/`, run:
   `npm install`
   `npm run build`
4. Upload the contents of `client/dist/` to Hostinger's public web root (`public_html`).
5. Keep the generated `.htaccess` file in the same directory as `index.html`.
6. Update Render `CLIENT_ORIGIN` to the exact Hostinger URL, including `https://` and without a trailing slash.
7. Test:
   - `/`
   - `/admin/login`
   - a public booking/application form
   - AI Talent Matcher
   - admin login/dashboard

## Important
Do not upload `.env.production` to GitHub. It is ignored by `.gitignore`.
