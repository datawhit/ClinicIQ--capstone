# ClinicIQ
# ClinIQ

**An AI-powered clinical caseload management and decision intelligence platform for dental education.**

[Live application →](https://clinic-iq.replit.app)

---

ClinIQ is a purpose-built operational layer for dental student providers. It replaces fragmented systems — sticky notes, spreadsheets, and an EHR not designed for caseload management — with a centralized, intelligent interface that gives every student real-time visibility into their patient panel, graduation requirement progress, and operational risk.

Built for and validated with student providers at NYU College of Dentistry, the largest dental school in the United States.

## The Problem

Dental student providers manage complex caseloads across 12 clinical disciplines while juggling administrative responsibilities — pre-authorizations, lab cases, patient handoffs, and CODA-aligned graduation tracking. Existing institutional tools (electronic health records, twice-yearly roster reviews) were not designed to give students or coordinators day-to-day operational visibility. The result: missed patient follow-ups, undetected requirement gaps, and an administrative burden that scales linearly with caseload complexity.

## The Solution

ClinIQ provides three things existing tools don't:

- **Real-time visibility** into every patient, every active treatment, and every graduation requirement
- **Proactive intelligence** that surfaces patients at risk of being lost to follow-up before they fall through
- **AI-powered decision support** grounded in live institutional data and CODA-aligned workflows — not generic responses

## Validated Results

Structured pre/post usability trial · 8 D3 and D4 students · NYU College of Dentistry · April 2026

| Metric | Result |
|---|---|
| Would replace current system | **100%** of participants |
| Ease of use | **5.0 / 5** |
| Likelihood of daily use | **4.7 / 5** |
| Net Promoter Score | **9.3 / 10** |
| Graduation confidence | **2.7 → 4.8** (78% improvement) |

## Architecture

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL with `connect-pg-simple` session store |
| Auth | Session-based, bcrypt password hashing, all data routes gated by middleware |
| AI | Anthropic Claude API, server-proxied (no client-side keys) |
| Deployment | Replit autoscale |

The data model spans 8 tables — users, patients, visit logs, student notes, rotations, providers, user settings, and changelog — with foreign-key cascading and JSONB for flexible fields like custom goals and clinic schedules.

## Feature Surface

- Authenticated multi-user platform with registration, login, password reset, and session management
- Patient panel with full CRUD, structured visit logging, and bulk import
- CODA-aligned graduation requirement tracker across all 12 disciplines
- Pre-authorization and lab case workflow tracking
- Paired-provider handoff coordination with shared visibility for D3/D4 partners
- AI-assisted natural-language visit logging — type or speak a visit, get structured data
- AI assistant grounded in live caseload context for caseload-related questions
- Behavioral analytics flagging at-risk patients and graduation pace concerns
- Provider directory, personal notes, settings, and changelog audit trail

## Running Locally

```bash
git clone https://github.com/datawhit/ClinicIQ--capstone.git
cd ClinicIQ--capstone
npm install
```

Required environment variables:
DATABASE_URL=postgres://...
ANTHROPIC_API_KEY=sk-ant-...
SESSION_SECRET=<long random string>

Then:

```bash
npm run dev
```

The app runs on port 5000 with Vite middleware mounted in development. Production build:

```bash
npm run build
npm start
```

## Demo Access

The live application includes a pre-seeded demo account so reviewers can explore without onboarding:

- **URL:** https://clinic-iq.replit.app
- **Email:** demo@cliniq.app
- **Password:** demo

The `/api/demo/seed` endpoint resets demo data to a clean state.

## Roadmap

- **AxiUm integration** — direct, secure data flow with NYUCD's electronic health record
- **Institutional pilot** — longitudinal rollout to one full clinical group practice
- **Post-graduate expansion** — extend ClinIQ to NYUCD residency programs
- **Institutional dashboard** — aggregate operational view for academic coordinators
- **D1/D2 orientation and simulation modes** — earlier-stage student support

## Project Context

ClinIQ was developed as the Applied Project capstone for the Master of Science in Management & Systems at NYU School of Professional Studies, Spring 2026.

- **Author:** Whitney Alleng
- **Project Sponsor:** John D. McIntosh, Associate Dean of Clinical Administration & Revenue Cycle Management, NYU College of Dentistry
- **Faculty Advisor:** Joseph Ng, Adjunct Assistant Professor, NYU SPS

## License

This repository is published for capstone review and demonstration purposes. All rights reserved by the author. For inquiries about institutional pilots, partnerships, or licensing, please contact the author directly.
