# System Architecture

## Architecture at a glance
The application uses a traditional three-layer architecture:
1. Frontend: React + Vite
2. Backend: Node.js + Express
3. Data layer: PostgreSQL via pg

## Frontend
The frontend is a single-page application that renders most of the product experience from src/App.jsx. The UI includes:
- overview dashboard
- patient roster and detail views
- visit logging modal
- graduation goals panel
- calendar / appointments
- notebook / notes
- provider directory
- settings and onboarding flows
- AI chat panel

The frontend communicates with the backend through REST-style JSON endpoints under /api/*.

## Backend
The backend is centered in server.js. It provides:
- authentication and session management
- patient CRUD and import/export-style workflows
- visit-log management
- notes, rotations, providers, settings, changelog
- AI parsing and AI proxy endpoints

Authentication is session-based and is enforced by the requireAuth middleware.

## Data layer
The database is initialized in db.js. The schema creates tables for users, patients, visit_logs, student_notes, rotations, user_settings, changelog, and providers.

## Runtime model
The server initializes the database on startup, creates a demo user if needed, and then starts listening on port 5000 in development or production mode. In development mode it mounts Vite middleware so the frontend and backend run on the same port.

## Design notes
- The app is currently monolithic at the server layer, with most routes implemented inline in server.js.
- The frontend logic is also concentrated in App.jsx, which means UI behavior and business logic are tightly coupled.
- The app uses server-side AI calls to protect API keys and to keep the Anthropic integration out of the client.

## Needs Verification
- The exact production deployment topology beyond the local/dev setup is not fully documented in the repository.
- The current app does not include an obvious automated test suite or CI configuration in the checked-in files.
