# CLAUDE.md — ClinIQ

Context for AI assistants working in this repo. For a full audit see
[_PROJECT_DOCS/AUDIT.md](_PROJECT_DOCS/AUDIT.md); product philosophy and change-approval
rules live in [.github/copilot-instructions.md](.github/copilot-instructions.md).

## What this is

**ClinIQ** — an AI-assisted caseload & graduation-tracking platform for NYU College of
Dentistry students. It is **not an EHR**: Epic/AxiUm is the "system of record," ClinIQ is
the "system of intelligence and workflow optimization." Capstone project by Whitney Alleng
(NYU SPS, Spring 2026), originally built on Replit with AI assistance.

## Architecture

- **Frontend:** React 19 + Vite 7 — a single-page app in one file, `src/App.jsx` (~4,400
  lines). Entry: `src/main.jsx` → `index.html`.
- **Backend:** Node.js + **Express 5**, one file `server.js` (~1,000 lines), ES modules.
- **DB:** PostgreSQL via `pg` Pool (`db.js`); sessions in PG via `connect-pg-simple`.
- **AI:** Anthropic Claude via `@anthropic-ai/sdk`, **server-proxied** — the key never
  reaches the browser. Endpoints: `/api/parse` (generic) and `/api/parse-note` (visit-note
  extraction).
- **One port:** dev mounts Vite as Express middleware; API + UI both on **:5000**. Prod
  serves the built `dist/`.
- **Newer modular layer** under `server/` (workflow-intelligence: priority scoring +
  daily-summary) feeds the `src/components/DailyPrioritySummary.jsx` card via
  `GET /api/v2/dashboard/summary`. **This layer is currently uncommitted** (untracked
  `server/` and `src/components/`).

```
React SPA (src/App.jsx) ──fetch('/api/…')──► Express (server.js) ──► PostgreSQL (db.js)
                                                   └──► Anthropic Claude
```

## Data model (8 tables, in `db.js`)

`users`, `patients`, `visit_logs`, `student_notes`, `rotations`, `user_settings` (JSONB
goals/schedule), `changelog`, `providers`. FKs cascade on user delete. **Most date fields
are `TEXT`, not `DATE`.** Schema is created inline in `initDb()` with idempotent
`ADD COLUMN IF NOT EXISTS` migrations — no migration framework.

## Running it

Node-only (any `main.py`/`pyproject.toml`/Python step is dead Replit scaffolding — ignore).

```bash
npm install
npm run dev     # dev: Express + Vite middleware on :5000
# npm run build && npm start   # production
node --test server/services/workflow/   # the unit tests (NOT wired to `npm test`)
```

Required env: `DATABASE_URL`, `ANTHROPIC_API_KEY` (boot fails without it),
`SESSION_SECRET` (set it — insecure default otherwise), optional `PORT`.
Demo login: `demo@cliniq.app` / `demo` (auto-seeded on boot).

## Conventions

- **ES modules everywhere** (`"type": "module"`). Server routes are plain Express handlers.
- **API shape:** REST under `/api/*`, JSON bodies. DB uses `snake_case`; API responses are
  mapped to **`camelCase`** by hand in each route — keep that mapping consistent when
  editing.
- **Auth:** every data route is gated by `requireAuth`; queries are always scoped by
  `req.session.userId`. **AI proxy routes are currently NOT gated** (a known risk — see
  audit; don't copy that pattern).
- **IDs:** generated app-side as prefixed base-36 timestamps (`PT-…`, `ROT-…`, `PRV-…`,
  `NOTE-…`, `CL-…`), not DB serials.
- **Frontend state:** all `useState` in the one `App()` component (no Redux/Context).
  Server is source of truth; mutations are optimistic + debounced PUT (800ms).
  `localStorage` holds only UI flags (onboarding/tour), never data or tokens.
- **Styling:** a single global CSS template string + CSS custom properties in `App.jsx`;
  6 named color themes. New UI generally follows the existing inline-IIFE-per-tab pattern.
- **AI model id** `claude-sonnet-4-20250514` is hardcoded in `server.js` and `App.jsx` —
  verify against the current Claude model line before relying on it; ideally centralize.

## Guardrails (from copilot-instructions.md)

- **Ask before changing/renaming/moving/deleting files**; no structural changes without
  approval. Prefer analysis/docs over edits when unsure.
- For every proposed change state: what, why, does it affect the running app, is it
  reversible, and risk level (Low/Med/High).
- Design as a **configurable multi-tenant platform** — never build NYU-only features.
  Every feature should reduce cognitive load and prove why it beats relying on Epic. AI
  must summarize/prioritize/recommend/explain and **never fabricate**.

## Known gotchas (see AUDIT.md §4/§6)

- The workflow-intelligence feature is **uncommitted**; `server.js`/`App.jsx` import
  untracked files — commit `server/` + `src/components/` *together* or the build breaks.
- **No `.gitignore`** — `node_modules/` and `dist/` are at risk of being committed;
  `dist/` is already committed and stale.
- Security to fix first: unauthenticated password reset (account takeover) and the
  unauthenticated, unbounded `/api/parse` Claude proxy.
- `App.jsx` and `server.js` are large monoliths — decompose incrementally, carefully.
