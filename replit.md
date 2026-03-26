# ClinIQ - Dental Patient Caseload Manager

Vite-based React application for NYU College of Dentistry patient tracking.

## Architecture
- **Frontend**: React (Vite) on port 5000
- **Backend**: Express.js API server on port 3001 (proxied via Vite dev server)
- **Database**: PostgreSQL (Replit-managed) via `pg` driver
- **Auth**: Session-based (express-session + connect-pg-simple), bcryptjs password hashing
- **AI**: Anthropic Claude Sonnet 4 for natural language dental note parsing + AI chatbot

## Key Files
- `src/App.jsx` — Main React application (patient roster, graduation requirements, visit logging, notes, calendar, rotations)
- `server.js` — Express backend: auth routes, patient CRUD, visit logs, notes, rotations, settings, AI proxy
- `db.js` — PostgreSQL connection pool + schema initialization
- `vite.config.js` — Vite config with proxy from `/api` to backend on port 3001

## Database Tables
- `users` — student accounts (name, email, password_hash, year)
- `patients` — patient records (per-user, full treatment data)
- `visit_logs` — visit history (linked to patients)
- `student_notes` — notebook entries (per-user)
- `rotations` — external clinical rotations (per-user)
- `user_settings` — graduation date, custom goals, clinic schedule (per-user, JSONB)
- `session` — express-session storage (auto-created by connect-pg-simple)

## API Routes
- `POST /api/auth/login` — login or auto-register on first sign-in
- `POST /api/auth/logout` — destroy session
- `GET /api/auth/me` — restore session on page load
- `GET/POST /api/patients` — list / create patients
- `PUT/DELETE /api/patients/:id` — update / delete patient
- `POST /api/patients/:id/visits` — log a visit
- `DELETE /api/patients/:id/visits/:visitId` — remove a visit
- `GET/POST/PUT/DELETE /api/notes` — notebook CRUD
- `GET/POST/PUT/DELETE /api/rotations` — rotation CRUD
- `PUT /api/rotations` (batch) — replace all rotations (used by settings save)
- `GET/PUT /api/settings` — graduation date, goals, schedule
- `POST /api/parse-note` — AI note parsing
- `POST /api/parse` — AI chat proxy

## Setup
1. Node.js 22 with Vite + React
2. Express backend proxies `/api` to Anthropic API (avoids browser CORS issues)
3. `ANTHROPIC_API_KEY` secret used by backend for AI features
4. `DATABASE_URL`, `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD` for PostgreSQL
5. `SESSION_SECRET` for secure session signing
6. Dev workflow uses `concurrently` to run both backend and Vite frontend
7. In production, Express serves the built frontend from `dist/` and handles `/api` routes

## Features
- Real login/session system (first login auto-registers, subsequent logins verify password)
- Patient roster with status tracking (Active, F/U Needed, Treatment Complete)
- All data persists to PostgreSQL — survives page refreshes and server restarts
- AI-powered visit note parsing via Claude Sonnet 4
- Floating AI chatbot with full caseload context
- Graduation requirements progress tracking by discipline
- Urgency alerts and filtering
- CSV roster export
- Lab status and pre-authorization tracking
- Clinical notebook (per-user notes, pinned, categorized)
- Calendar with appointment scheduling and external rotations
- Custom graduation goals and clinic schedule settings
- Color theme switcher (6 presets: NYU Purple, Ocean Blue, Forest, Rose, Slate, Amber) — persisted per user
- Dashboard tab reordering via ▲/▼ controls in Settings → Appearance
- Dashboard stats visibility toggle (show/hide any of the 5 stat cards)

## Theme System
- `THEMES` constant — 6 presets, each overrides: purple, purpleDark, purpleDeep, purpleLight, purpleMid, accent, lavender
- `T` object computed inside App from `{ ...NYU, ...THEMES[themePreset] }` — used in all inline styles
- CSS custom properties (`--t-purple`, `--t-mid`, `--t-dark`, `--t-deep`, `--t-light`, `--t-lav`) injected via `themeVars` style tag for CSS-class-based rules (e.g. `.nlp-box`, `input:focus`)
- `STAT_DEFS` / `TAB_DEFS` — define the canonical ids and labels for stats/tabs
- `DEFAULT_TAB_ORDER` — default tab sequence; overrideable per user via settings
