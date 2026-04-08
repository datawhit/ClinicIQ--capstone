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
- `changelog` — audit log entries (user_id, action_type, patient_alias, description, timestamp)
- `session` — express-session storage (auto-created by connect-pg-simple)

## API Routes
- `POST /api/auth/login` — login or auto-register on first sign-in
- `POST /api/auth/logout` — destroy session
- `GET /api/auth/me` — restore session on page load
- `GET/POST /api/patients` — list / create patients
- `POST /api/patients/import` — bulk CSV import (creates patients from mapped row array)
- `PUT/DELETE /api/patients/:id` — update / delete patient
- `POST /api/patients/:id/visits` — log a visit
- `DELETE /api/patients/:id/visits/:visitId` — remove a visit
- `GET/POST/PUT/DELETE /api/notes` — notebook CRUD
- `GET/POST/PUT/DELETE /api/rotations` — rotation CRUD
- `PUT /api/rotations` (batch) — replace all rotations (used by settings save)
- `GET/PUT /api/settings` — graduation date, goals, schedule
- `POST /api/parse-note` — AI note parsing
- `POST /api/parse` — AI chat proxy
- `POST /api/changelog` — insert audit log entry
- `GET /api/changelog` — fetch last 50 entries for current user

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
- Primary/Supporting provider role per patient — set at add-time, editable in detail view
- D4 students can share patients with a D3 from the Add Patient modal (inline expand)
- Graduation requirements count only primary-provider visits; breakdown shows "X as primary · Y as supporting"
- AI assistant context includes `primary: yes/no` per patient line
- **Today tab** (first tab) — greeting, stat chips (today's patients / pending items / requirements left), today's appointments sorted by time with Log Visit shortcut, and "Also needs attention" urgent patients section
- **Quick Log floating button** (bottom-left teal circle) — compact modal with patient selector and AI-parsed note input; green success toast on submit
- **Roster search bar** — filters patient list in real time by alias, chart number, or procedure
- **ConfirmDelete system** — reusable confirm modal for delete patient, visit, note, appointment, rotation (all with "This cannot be undone" warning)
- **Post-grad year options** — login and settings year selector includes GPR, OMFS, Periodontics, Endodontics, Prosthodontics, Orthodontics, Pediatric Dentistry Residents; AI prompt treats residents as clinical peers
- **Partner Quick Notes** — chat-style message thread in Paired Provider section; teal bubbles for self, gray for partner; sent notes saved to patient record
- **Changelog audit log** — `logChange` fires on patient add/delete, visit log/delete, note delete, appointment removal, rotation removal, treatment complete toggle, preAuth/lab status changes; Settings shows last 10 entries with "View all" expansion
- **Predictive Nudge System** — Treatment Phase selector (0–V) with phase descriptions and recall-day guidance in patient detail; Specialty Referral tracking (type + status + referral date); Faculty Name field in Log Visit modal + shown in visit timeline; Graduation Transfer modal for D4 students when marking treatment complete (log transfer to resident/faculty, stored as `transferredTo`/`transferDate`); `calculateUrgency` integrates phase/specialty overdue nudges; Today tab shows "🔮 Predictive nudges" section for overdue phase/specialty patients; Predictive next appointment (`getPredictedNextAppt`) shown in Treatment Phase card
- **Behavioral Pattern Analysis** — `analyzeBehavior(patients, customGoals)` runs silently on all visit history; detects: pace trend (slowing/accelerating vs all-time avg), preferred clinic day (≥40% of visits), inactivity risk (gap >21 days in last 60), neglected disciplines (active patients, no visit in 30+ days), month-over-month decline; Today tab shows "🔬 Behavioral Insights" cards (soft purple, icon + observation + recommendation); Monday morning weekly summary toast (purple gradient, dismissable, stored in localStorage); Caseload Intelligence panel shows behavioral trend impact on graduation (amber warning or green check); AI chat receives `BEHAVIORAL PATTERNS` context so it can factor trends into answers
- **Grouped Graduation Goals** — Graduation Goals tab groups disciplines into collapsible sections (Restorative & General, Periodontics & Hygiene, Endodontics, Oral Surgery, Orthodontics, Pediatric Dentistry, Special Care); each group shows X/N complete badge; `DISCIPLINE_GROUPS` constant drives mapping; "Show all (N hidden)" toggle reveals visibility-hidden goals; `collapsedGoalGroups` state tracks which groups are collapsed; custom disciplines fall into "Custom Goals" bucket
- **4-step Onboarding Modal** — shown automatically to first-time users (0 patients + no `cliniq-onboarded` localStorage key); steps: (1) Welcome with feature grid, (2) Add first patient with option to open Add Patient modal inline, (3) Graduation goals preview with tip about setting graduation date, (4) AI assistant intro with example queries; progress bar at top; localStorage key set on completion or skip; `onboardingStep` state (null = hidden, 1–4 = active step)
- **Mobile Responsiveness** — `isMobile` state (resize listener); modals render as bottom sheets on mobile (CSS @media); tab nav scrolls horizontally; floating buttons repositioned to `bottom:16px, left/right:12px`; patient detail header wraps; page inner reduces to `20px 12px`
- **Settings Modal 5-tab layout** — `settingsTab` state ('profile','schedule','rotations','appearance','activity'); tab pill row below settings header; each tab shows only its relevant sections
- **Error Toast System** — `errorToast` state + `showError(msg)` helper (auto-clears in 4s); red pill toast fixed at bottom center (zIndex 9999); wired into addPatient, logVisit, sendChat, loadUserData, settings save
- **Add Patient modal new fields** — Patient Type pill selector (In-Clinic/Outreach/External), Referring Faculty text input, Treatment Phase dropdown — inserted after Discipline, before First Procedure; `emptyPatient` updated with `patientType:"In-Clinic"`, `referringFaculty:""`
- **Graduation Goals 3-section view** — replaced discipline-group grouping with status-based sections: Needs Cases (amber), ✓ Complete (green), Not Started (hidden by default); `showAllGoals` toggle shows/hides Not Started section
- **Collapsible Patient Detail Sections** — `expandedSections` state (default: `["visitHistory"]`); Treatment Phase, Specialty Referral, Lab & Pre-Auth, Notes, Patient Language, Paired Provider all start collapsed; Visit History starts expanded; each section header shows title + animated › chevron; click header to toggle
- **Stats Grid Hidden** — main dashboard and Roster Panel no longer show the 5-stat grid row (data still computed for Caseload Intelligence panel and AI context); `STAT_DEFS` and `visibleStats` state still used for settings visibility control
- **Simplified Hamburger Menu** — removed Patient Roster, Graduation Goals, Notebook, Calendar from menu; kept: Paired Provider View, Urgent Patients, Add Patient, Import Roster, Export Roster, Settings, Sign Out
- **CSV Roster Import** — 4-step import modal (`showImportModal`, `importStep` 1–4): (1) drag-drop/file upload, (2) column mapping (chart number, last visit, procedure, discipline with auto-detect), (3) preview first 5 rows, (4) success/error result; `parseCSVFile()` reads CSV + parses headers; `buildImportPreview()` maps rows; `runImport()` POSTs to `/api/patients/import`; triggered from hamburger menu + Settings → Profile tab; server auto-generates alias from chart number or sequential ID
- **NYUCD Clinical Knowledge Base** — expanded AI system prompt with full CDT code reference (D0150–D9930), pre-auth rules, lab coordination workflow, NYUCD requirements tracking; 📚 button in chat header pre-fills "Show me the NYUCD clinical quick reference guide"

## Theme System
- `THEMES` constant — 6 presets, each overrides: purple, purpleDark, purpleDeep, purpleLight, purpleMid, accent, lavender
- `T` object computed inside App from `{ ...NYU, ...THEMES[themePreset] }` — used in all inline styles
- CSS custom properties (`--t-purple`, `--t-mid`, `--t-dark`, `--t-deep`, `--t-light`, `--t-lav`) injected via `themeVars` style tag for CSS-class-based rules (e.g. `.nlp-box`, `input:focus`)
- `STAT_DEFS` / `TAB_DEFS` — define the canonical ids and labels for stats/tabs
- `DEFAULT_TAB_ORDER` — default tab sequence; overrideable per user via settings
