# Component Map

## Frontend structure
The main UI experience is concentrated in src/App.jsx rather than split into many small components.

## Primary UI areas in App.jsx
- authentication / app shell initialization
- main dashboard overview
- patient roster panel
- patient detail screen
- add patient modal
- log visit modal
- import roster modal
- confirm delete modal
- graduation transfer modal
- floating AI chat panel
- bottom navigation
- notification drawer
- provider modals
- pending items sheet
- rotation edit modal
- appointment modal
- paired provider panel
- settings modal
- guided tour overlay
- onboarding modal

## Backend modules
- server.js: API routes, auth middleware, AI routes, startup logic
- db.js: PostgreSQL connection and schema initialization

## Entry points
- src/main.jsx: React entry point
- index.html: HTML shell for the Vite app

## Needs Verification
- The frontend does not appear to be split into reusable component files yet; this is a structural observation from the current code organization.
- The exact mapping from UI sections to future refactor targets is not yet defined in the repo.
