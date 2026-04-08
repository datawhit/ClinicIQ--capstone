# ClinicIQ--capstone
# ClinIQ

**AI-powered clinical caseload management for dental students at NYU College of Dentistry.**

ClinIQ gives D3 and D4 dental students a centralized, intelligent interface to manage their patient panel, track graduation requirement progress, coordinate with paired providers, and access an AI assistant trained on NYUCD-specific terminology — all outside of AxiUm.

---

## What It Does

Managing a clinical caseload at NYU Dentistry means tracking dozens of patients across 12 disciplines, monitoring pre-authorization timelines, coordinating lab cases, logging visits, and staying on top of graduation requirements — all while delivering patient care. Currently students do this manually across spreadsheets, phone notes, and memory.

ClinIQ replaces that with a single intelligent tool built around how dental students actually work.

**Core features:**

- **Patient roster** — full caseload management with HIPAA-safe aliases, discipline tracking, visit history, and status flags
- **Graduation velocity** — real-time progress tracking across all 12 NYUCD disciplines with pace analysis and at-risk identification
- **AI assistant** — caseload-aware assistant built on Claude (Anthropic) with NYUCD terminology, protocol knowledge, and escalation rules
- **Lab and pre-auth tracking** — day-based nudge engine for lab turnaround and insurance pre-authorization timelines
- **Paired provider coordination** — D3/D4 shared patient views with field-level sharing controls and quick notes
- **Provider directory** — contact list for attendings, partners, specialists, and residents
- **Predictive completion engine** — per-patient completion estimates based on visit frequency, discipline benchmarks, and delay factors
- **Behavioral analytics** — visit pace trends, neglected discipline detection, and inactivity risk
- **CSV roster import** — one-click import from AxiUm exports
- **Calendar** — week and month views with confirmed appointments, suggested slots, conflict detection, and rotation tracking
- **Notebook** — clinical notes with categories, pinning, and search
- **Multi-language support** — AI can translate patient instructions into 13 languages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (single-page application) |
| Backend | Node.js / Express |
| Database | PostgreSQL via Supabase |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Hosting | Vercel |
| Dev environment | Replit |

---

## Project Context

ClinIQ was built as an applied capstone project for the Master of Science in Management and Systems program at NYU School of Professional Studies, Spring 2026.

**Student:** Whitney Alleng, MASY Candidate
**Sponsor:** John D. McIntosh, Associate Dean of Clinical Administration, NYU College of Dentistry
**Program:** MASY GC-4100 Applied Project Capstone

This is a prototype built with synthetic patient data. It does not connect to or replace AxiUm. No PHI is stored or transmitted at any stage. All patient identifiers are system-generated aliases in the format P-YYYY-NNN.

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/datawhit/ClinicIQ--capstone.git
cd ClinicIQ--capstone

# Install dependencies
npm install

# Add environment variables
# Create a .env file with the following:
# ANTHROPIC_API_KEY=your_key_here
# DATABASE_URL=your_supabase_connection_string
# SESSION_SECRET=any_random_string

# Start the development server
npm run dev
```

The app runs on `http://localhost:3000` by default.

---

## Demo

A live demo is available at: **[cliniq.vercel.app](https://cliniq.vercel.app)**

To explore the full feature set without creating an account, use Demo Mode on the login screen. This loads a pre-populated caseload of 8 realistic patients across all disciplines with full visit history, lab tracking, and paired provider data.

---

## Roadmap

The following features are documented for post-graduation development:

- AxiUm EHR integration via HL7 FHIR
- Institutional admin dashboard for faculty and deans
- D1/D2 pre-clinical companion mode
- Post-graduate residency requirement tracking
- Multi-institution deployment across CODA-accredited dental schools
- Native iOS and Android apps

Full roadmap: see `ClinIQ_LongTerm_Vision.md`

---

## License

This project was developed as an academic capstone. All rights reserved. Not licensed for commercial use or redistribution without permission.

---

*Built with care for the students of NYU College of Dentistry.*
