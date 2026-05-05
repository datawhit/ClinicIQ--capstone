# ClinicIQ - Replit Development Guide

## Overview

ClinicIQ is a clinic management/intelligence application currently in its initial setup phase. The project name suggests it is intended to be a healthcare or clinical management platform. At this stage, the repository contains only foundational scaffolding with a Vite-based frontend build system configured.

**Current State:** Early-stage project with Vite configured. Core application logic, backend, and database layers are yet to be built.

**Likely Purpose:** A clinic management system (scheduling, patient records, appointments, analytics, or similar healthcare workflows based on the "IQ" branding suggesting intelligence/analytics features).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Build Tool:** Vite is configured (evidenced by `.vite/deps/_metadata.json` and ES module setup)
- **Module System:** ES Modules (`"type": "module"` in Vite deps package.json)
- **Framework:** Not yet determined — likely React or Vue given Vite usage; React is the most common pairing
- When building the frontend, use React with TypeScript as the default choice unless directed otherwise

### Backend
- No backend is implemented yet
- Recommend an Express.js server with TypeScript for consistency with the Vite/TS frontend ecosystem
- The backend should be placed in a `server/` directory with an entry point at `server/index.ts`

### Data Storage
- No database is configured yet
- Drizzle ORM is recommended for schema management given the TypeScript-first stack
- PostgreSQL is the recommended database for a production clinic application (supports complex queries, ACID compliance important for medical data)

### Security
- A Semgrep security scanning configuration is present (`.config/replit/.semgrep/semgrep_rules.json`)
- CORS regex wildcard detection is already configured as a security rule — avoid unescaped `.` characters in CORS domain regex patterns
- For a clinic app, follow HIPAA-aware patterns: avoid logging sensitive patient data, use proper authentication

### Project Structure (Recommended)
```
cliniciq/
├── client/          # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.tsx
│   └── index.html
├── server/          # Backend (Express + TypeScript)
│   ├── routes/
│   ├── db/
│   └── index.ts
├── shared/          # Shared types/schemas between client and server
│   └── schema.ts
├── drizzle.config.ts
└── package.json
```

### Authentication
- Not yet implemented
- For a clinic app, session-based auth or JWT with proper expiry is recommended
- Role-based access (admin, doctor, receptionist, patient) will likely be needed

## External Dependencies

### Currently Present
- **Vite** — Frontend build tooling and dev server
- **Semgrep** — Static analysis / security scanning (configured via Replit)

### Recommended for Development
- **React + TypeScript** — UI framework
- **Express.js** — Backend API server
- **Drizzle ORM** — Type-safe database ORM
- **PostgreSQL** — Primary relational database
- **Tailwind CSS** — Utility-first styling (common in Vite/React apps)
- **Zod** — Schema validation for API inputs (pairs well with Drizzle)

### Healthcare-Specific Considerations
- No third-party EHR or scheduling APIs are integrated yet
- If integrating with external calendar or SMS services, consider **Twilio** (SMS reminders) or **Google Calendar API**
- Avoid storing sensitive patient data in client-side storage (localStorage, cookies without httpOnly)