# ClinIQ — Codebase Audit

**Date:** 2026-07-07
**Auditor:** Claude (read-only analysis — no code was modified)
**Scope:** Full repository, excluding `node_modules/` and build output in `dist/`.

> This is an inherited, AI-assisted project (originally built on Replit). This document
> captures what exists today, what works, what is unfinished, how to run it, and the
> risks worth addressing first.

---

## 1. Project Overview

**ClinIQ** (branded "ClinicIQ" in a few places) is an **AI-assisted clinical caseload
and graduation-tracking platform for dental students** at NYU College of Dentistry.
It is explicitly *not* an EHR — the product philosophy (see
[.github/copilot-instructions.md](../.github/copilot-instructions.md)) positions Epic/AxiUm
as the "system of record" and ClinIQ as the "system of intelligence and workflow
optimization." Students use it to track their patient panel, visit history, lab and
pre-authorization status, provider handoffs, rotations, personal notes, and progress
toward CODA graduation requirements across 12 dental disciplines.

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7, single-page app (one big `src/App.jsx`) |
| Backend | Node.js + Express **5**, single `server.js` (ES modules) |
| Database | PostgreSQL via `pg` Pool; sessions stored in PG via `connect-pg-simple` |
| Auth | Session cookies + `bcryptjs` password hashing; `requireAuth` middleware |
| AI | Anthropic Claude (`@anthropic-ai/sdk`), server-proxied so the key never reaches the browser |
| Python | **None functionally** — `main.py`/`pyproject.toml` are empty Replit scaffolding leftovers |
| Deploy | Replit autoscale (`.replit`) |

### How the pieces talk to each other

```
Browser (React SPA, src/App.jsx)
      │  fetch('/api/...')  — same-origin, cookie session
      ▼
Express (server.js)  ── requireAuth ──►  PostgreSQL (db.js Pool)
      │                                      ▲
      │  /api/parse, /api/parse-note         │ connect-pg-simple session store
      ▼                                      │
Anthropic Claude API  ◄──────────────────────┘
```

- **One-port model.** In development, `server.js` mounts Vite as middleware
  (`createViteServer({ middlewareMode: true })`), so the API and the React dev server
  both run on **port 5000**. In production it serves the pre-built `dist/` folder and
  falls back to `dist/index.html` for client-side routing.
- The frontend never holds the Anthropic key — all AI calls go through the Express
  proxy endpoints `/api/parse` (generic chat/JSON) and `/api/parse-note` (visit-note
  extraction).
- A newer **workflow-intelligence** layer lives under `server/` (routes + services) and
  is consumed by the `src/components/DailyPrioritySummary.jsx` card on the Overview tab
  via `GET /api/v2/dashboard/summary`. **This entire layer is currently uncommitted** —
  see §4.

---

## 2. File Map

```
ClinicIQ--capstone/
├── .replit                      # Replit run/build config (nodejs-20 only, ports, dev-server workflow)
├── replit.md                    # STALE Replit "dev guide" — describes an empty scaffold; no longer accurate
├── README.md                    # Accurate, polished project README (capstone-facing)
├── package.json                 # Node deps + scripts (dev/build/start/preview); "test" is a stub
├── package-lock.json            # Lockfile (has uncommitted @babel version bumps — see §4)
├── pyproject.toml               # LEFTOVER Replit Python scaffold — no dependencies, unused
├── main.py                      # LEFTOVER "Hello from repl-nix-workspace" stub — unused
├── vite.config.js               # Vite config: React plugin, host 0.0.0.0:5000, no-store cache header
├── index.html                   # Vite HTML entry — mounts /src/main.jsx into #root
├── db.js                        # PG Pool + initDb(): creates all 8 tables + session-store, runs idempotent migrations
├── server.js                    # THE backend — all Express routes, auth, CRUD, demo seed, AI proxy, server bootstrap
│
├── src/
│   ├── main.jsx                 # React entry — renders <App/> in StrictMode
│   ├── App.jsx                  # 4,421-line monolith: entire SPA (all views, modals, state, AI, heuristics)
│   └── components/              # (UNTRACKED in git)
│       ├── DailyPrioritySummary.jsx   # Overview card: fetches /api/v2/dashboard/summary, renders priority list
│       └── PriorityItemCard.jsx       # Single priority row (used by DailyPrioritySummary)
│
├── server/                      # (UNTRACKED in git) — newer modular "workflow intelligence" backend
│   ├── routes/
│   │   └── workflowRoutes.js           # POST /api/workflow/priority and /priority/bulk (NOT called by the frontend yet)
│   └── services/workflow/
│       ├── priorityService.js          # Pure scoring: calculatePriorityScore / derivePriorityLevel / buildPriorityItem
│       ├── priorityService.test.js     # node:test unit tests for scoring
│       ├── workflowIntelligenceService.js  # Thin class wrapper around priorityService (singleton default export)
│       ├── workflowSummaryService.js   # buildWorkflowDashboardSummary(): derives per-patient signals → summary
│       └── workflowSummaryService.test.js  # node:test unit tests for the summary builder
│
├── dist/                        # COMMITTED build output (stale — see §4)
│   ├── index.html
│   └── assets/index-*.js
│
├── attached_assets/             # Replit paste/screenshot history (prompts + images) — reference only, not code
├── _PROJECT_DOCS/               # ~35 planning/spec markdown docs (roadmaps, personas, schema, this audit)
└── .github/
    └── copilot-instructions.md  # Product philosophy + change-approval guardrails for AI assistants
```

### Database schema (from `db.js`)

Eight application tables plus the auto-created session table:
`users`, `patients`, `visit_logs`, `student_notes`, `rotations`, `user_settings`
(JSONB `custom_goals`/`clinic_schedule`), `changelog`, `providers`. Foreign keys
cascade on user delete. Two `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` migrations
(`is_primary_provider`, `shared_with_d3`) run on every boot — safe/idempotent. Note
that most date fields are stored as `TEXT`, not `DATE`.

---

## 3. What's Been Done (complete & working)

**Authentication & sessions**
- Register, login (with auto-register-on-first-login), password reset, logout, `me`.
- bcrypt hashing (10 rounds), PG-backed sessions, 7-day cookie, `requireAuth` gate on all data routes.
- Auto-seeded demo user (`demo@cliniq.app` / `demo`, "Jordan Rivera", D4) created on boot.

**Patient management (full CRUD)**
- List/create/update/delete patients, all scoped to `user_id`.
- Structured visit logging (`/api/patients/:id/visits`), with last-visit/next-appt roll-up.
- **CSV roster import** (`/api/patients/import`) with collision-safe IDs and sequential alias generation.
- Debounced optimistic saves from the client (800ms) via `PUT /api/patients/:id`.

**Supporting domains (full CRUD each)**
- Student notes (pin/category), rotations (single + batch replace), provider directory, user settings, changelog audit trail.
- Rich **demo seed** endpoint (`/api/demo/seed`) that resets and populates 12 discipline-spanning demo patients, rotations, notes, and providers.

**Frontend (single-file SPA — `src/App.jsx`)**
- Views: Overview/dashboard, Patient Roster, Calendar (week/month + rotations overlay + conflict flags), Notebook, Goals/Requirements, Provider Directory, AI Assistant chat.
- Modals/flows: add patient, log visit, patient detail, transfer/handoff, rotations, appointments, CSV import wizard, provider add/edit, settings (5 sub-tabs), onboarding, guided tour, forgot-password.
- 6 selectable color themes (CSS custom properties), mobile-responsive layout with bottom nav and a responsive desktop sidebar (most recent commit).
- Client-side "predictive/behavioral" heuristics (not LLM): completion prediction, next-appt prediction, phase/specialty nudges, inactivity/neglected-discipline analysis, graduation velocity.

**AI integrations (working, server-proxied)**
- `POST /api/parse-note` — extracts structured visit JSON from free-text via Claude.
- `POST /api/parse` — generic Claude proxy used by both the Log-Visit NLP parse and the caseload chat assistant (which parses `[ACTION:...]` tags to drive navigation).
- Voice input via the Web Speech API feeds the NLP field.

**Workflow-intelligence layer (built, tested, but uncommitted — see §4)**
- Deterministic priority scoring + daily-summary derivation with **passing `node:test` unit tests**.
- Wired end-to-end for the Overview `DailyPrioritySummary` card via `GET /api/v2/dashboard/summary`.

---

## 4. What's Incomplete, Broken, or Abandoned

### Uncommitted working-tree changes (the important part)

`git status` shows the repo is **mid-feature**: the entire workflow-intelligence
feature has been written but never committed.

- **Modified `server.js`** (staged as unstaged): adds `import workflowRoutes` and
  `buildWorkflowDashboardSummary`, mounts `app.use('/api/workflow', workflowRoutes)`,
  and adds the `GET /api/v2/dashboard/summary` endpoint (lines 847–910). These imports
  reference **untracked files** — if `server.js` were committed alone, the app would
  crash on boot with a module-not-found error.
- **Modified `src/App.jsx`**: imports and renders `<DailyPrioritySummary theme={T} />`
  on the Overview tab (one line + one import). Also references an untracked file.
- **Untracked, never committed:** `server/` (routes + services + tests),
  `src/components/` (both card components), `_PROJECT_DOCS/`, `.github/`, and
  `node_modules/`.
- **Modified `package-lock.json`**: only `@babel/*` transitive version bumps
  (7.29.0 → 7.29.7). Cosmetic churn from an `npm install`; `package.json` itself is unchanged.
- **`dist/` is committed and now stale.** `git status` shows the old bundle
  (`index-DgPNI2rb.js`) deleted and a new one (`index-C6Ffg88K.js`) untracked, with
  `dist/index.html` re-pointed to the new hash. Committing build artifacts is fragile;
  the checked-in build no longer matches source.

> **Net effect:** the app runs correctly *in the working tree*, but the git history does
> not reflect the current feature. A commit is needed, and it must include `server/` and
> `src/components/` or the build breaks.

### Half-wired / unused code

- **`/api/workflow/priority` and `/api/workflow/priority/bulk`** ([workflowRoutes.js](../server/routes/workflowRoutes.js))
  are mounted but **never called by the frontend** — only `/api/v2/dashboard/summary` is
  used. These routes (and `workflowIntelligenceService`) are scaffolding for a broader
  feature not yet surfaced in the UI.
- **Duplicate priority logic.** `priorityService.js` (flag-based scoring) and
  `workflowSummaryService.js` (date/signal-based scoring) implement two *different*
  scoring schemes. The dashboard uses only the latter; the former is exercised only by
  `workflowRoutes` + its tests.

### Config / tooling gaps

- **No `.gitignore`.** `node_modules/` currently shows as untracked; one `git add .`
  would commit the whole dependency tree. `dist/` and `node_modules/` should be ignored.
- **Tests aren't wired to npm.** `package.json` `"test"` is still the default
  `echo "Error: no test specified" && exit 1`. The real tests run only via
  `node --test server/services/workflow/`.
- **Unused dependencies.** `cors` and `concurrently` are in `package.json` but `cors` is
  never imported in `server.js` and `concurrently` has no script using it.
- **Stale docs.** `replit.md` describes an "early-stage project with only Vite
  configured … backend not implemented" — completely obsolete. `README.md` is the
  accurate source of truth.

### Leftover Replit / Python scaffolding

- `main.py` (prints "Hello from repl-nix-workspace!") and `pyproject.toml` (no
  dependencies) are **unused**. `.replit` declares only `nodejs-20`. **There is no
  Python runtime requirement** — these are safe to delete.

### Not found

- **No `TODO`/`FIXME`/`HACK` comments** anywhere, and no large commented-out dead
  blocks. The main structural debt is the **4,421-line `App.jsx` monolith** and the
  **1,012-line `server.js` monolith** (both flagged in
  [_PROJECT_DOCS/TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)).

---

## 5. How to Run It

Only a **Node.js** setup is required. Python is leftover Replit scaffolding and can be ignored.

### Prerequisites
- Node.js 20+ and npm
- A reachable PostgreSQL database
- An Anthropic API key

### Environment variables
```bash
DATABASE_URL=postgres://user:pass@host:5432/dbname   # required — server won't function without it
ANTHROPIC_API_KEY=sk-ant-...                          # required — process.exit(1) on boot if missing
SESSION_SECRET=<long random string>                  # optional but should be set (insecure default otherwise)
PORT=5000                                             # optional (defaults to 5000)
```

### Install & run (development)
```bash
npm install
npm run dev        # NODE_ENV=development node server.js — Express + Vite middleware on :5000
```
Open http://localhost:5000. On first boot the schema is created and the demo user is seeded.
Log in with `demo@cliniq.app` / `demo`, or use the in-app "Try Demo" button.

### Production build
```bash
npm run build      # vite build → dist/
npm start          # node server.js — serves dist/ + API on :5000
```

### Run the unit tests (not wired to `npm test`)
```bash
node --test server/services/workflow/
```

> **Do NOT run any `python`/`main.py` step** — it does nothing. The `.replit` "build"
> is `npm run build` and "run" is `node server.js`; there is no Python in the runtime.

---

## 6. Risks & Recommendations

### Security issues (most severe first)

1. **🔴 Password reset has no verification — account takeover.**
   `POST /api/auth/reset-password` ([server.js:98](../server.js#L98)) resets any account's
   password given only an `email` + `newPassword`, with no token, no email challenge, and
   no auth. Anyone who knows a user's email can seize their account (and their clinical
   data). **Fix first.**
2. **🔴 AI proxy endpoints are unauthenticated & unbounded.**
   `POST /api/parse` and `POST /api/parse-note` ([server.js:929](../server.js#L929),
   [server.js:956](../server.js#L956)) have **no `requireAuth`** and no rate limiting.
   `/api/parse` forwards arbitrary `model`/`messages`/`system` straight to Anthropic —
   i.e. it is an **open relay to your paid Claude account**. Anyone can run up the bill or
   abuse it. Gate with `requireAuth` and add rate limiting/allow-listing of models.
3. **🟠 Weak session-secret default.** `SESSION_SECRET` falls back to the hardcoded
   `'cliniq-secret-change-me'` ([server.js:26](../server.js#L26)). If unset in prod,
   session cookies are forgeable. Fail fast if it's missing in production.
4. **🟠 Login silently auto-registers.** `POST /api/auth/login` creates a new account for
   any unknown email ([server.js:73](../server.js#L73)). Convenient for a demo, but means
   there is no real gate on account creation and typos become new accounts.
5. **🟠 Session cookie flags not hardened.** No `secure`, `httpOnly` (default is on for
   express-session, but not explicit), or `sameSite` set. Set these explicitly for prod.
6. **🟡 Sensitive-data posture.** This stores clinical-adjacent data. Even with aliases,
   review logging (error messages log `err.message` only — good) and confirm no PII lands
   in the `changelog` free-text or client `localStorage` (currently only UI flags — good).

### Reliability / correctness

- **Committing `server.js`/`App.jsx` without `server/` + `src/components/` will break the
  build** (unresolved imports). Commit them together, or not at all.
- **Date fields are `TEXT`.** All date logic (priority scoring, calendar, predictions)
  parses strings with `new Date(...)`. Works for ISO `YYYY-MM-DD`, but is fragile to
  malformed/empty values. Consider `DATE`/`TIMESTAMPTZ` columns long-term.
- **Error handling is present but shallow.** Most routes `try/catch` and return 500s, but
  there is no input-validation layer (e.g. Zod) — bodies are trusted and coalesced with
  `|| ''`. AI JSON parsing is defensively wrapped (good).

### Hardcoded values to extract

- Claude model id `claude-sonnet-4-20250514` is hardcoded in `server.js` (×2) and passed
  from `App.jsx` (×2) — centralize in one config constant. **Note:** this is a dated model
  string; verify it against the current Claude model line before relying on it.
- Demo credentials (`demo@cliniq.app`/`demo`) and default graduation date (`2026-05-15`)
  are hardcoded — fine for a capstone demo, but flag for any real deployment.

### Prioritized fix list

| # | Priority | Fix |
|---|---|---|
| 1 | 🔴 Now | Add token/email verification to `reset-password` (or disable the route). |
| 2 | 🔴 Now | Add `requireAuth` + rate limiting to `/api/parse` and `/api/parse-note`; restrict allowed models. |
| 3 | 🟠 High | Add a `.gitignore` (`node_modules/`, `dist/`), then commit the workflow-intelligence feature (`server/` + `src/components/` + the `server.js`/`App.jsx` edits) as one coherent commit. |
| 4 | 🟠 High | Require `SESSION_SECRET` in production; set `cookie: { secure, httpOnly, sameSite }`. |
| 5 | 🟡 Med | Wire `npm test` to `node --test`; add tests for auth + patient CRUD. |
| 6 | 🟡 Med | Decide login policy (keep or remove silent auto-register). |
| 7 | 🟢 Low | Delete leftovers: `main.py`, `pyproject.toml`, stale `replit.md`; drop unused `cors`/`concurrently` deps; centralize the model id. |
| 8 | 🟢 Low | Begin decomposing `App.jsx`/`server.js` per [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md). |

---

*End of audit. No files were modified during this analysis.*
