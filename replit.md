# ClinIQ - Dental Patient Caseload Manager

Vite-based React application for NYU College of Dentistry patient tracking.

## Architecture
- **Frontend**: React (Vite) on port 5000
- **Backend**: Express.js API server on port 3001 (proxied via Vite dev server)
- **AI**: Anthropic Claude Sonnet 4 for natural language dental note parsing

## Key Files
- `src/App.jsx` — Main React application (patient roster, graduation requirements, visit logging)
- `server.js` — Express backend that proxies AI requests to Anthropic API
- `vite.config.js` — Vite config with proxy from `/api` to backend on port 3001

## Setup
1. Node.js 22 with Vite + React
2. Express backend proxies `/api/parse-note` to Anthropic API (avoids browser CORS issues)
3. `ANTHROPIC_API_KEY` (or `VITE_ANTHROPIC_API_KEY`) secret used by backend for Anthropic API auth
4. Dev workflow uses `concurrently` to run both backend and Vite frontend
5. In production, Express serves the built frontend from `dist/` and handles `/api` routes

## Features
- Patient roster with status tracking (Active, F/U Needed, Treatment Complete)
- AI-powered visit note parsing via Claude Sonnet 4
- Graduation requirements progress tracking by discipline
- Urgency alerts and filtering
- CSV roster export
- Lab status and pre-authorization tracking
