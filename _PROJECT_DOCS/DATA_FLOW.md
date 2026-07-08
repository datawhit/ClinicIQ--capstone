# Data Flow

## Request flow overview
1. The React frontend loads the app shell from the Vite server in development or from built assets in production.
2. User actions trigger fetch calls to the Express backend at /api/* endpoints.
3. The backend authenticates requests through session middleware and authorizes them with requireAuth for protected routes.
4. The server reads or writes data in PostgreSQL.
5. Responses return JSON back to the frontend, which updates local React state and UI.

## Authentication flow
- The login and register endpoints create or validate a user in the users table.
- Successful authentication stores user ID and user metadata in the session.
- Subsequent requests use the session to identify the active user.

## Patient workflow
- Patient data is loaded from the patients table.
- Visit history is loaded from the visit_logs table.
- The frontend displays patient panels, detail views, urgency indicators, and treatment-state controls.
- Updates to patient fields are sent to the patient update endpoint and persisted in the patients table.

## Visit logging workflow
- The frontend collects free-text visit input and optionally calls the AI parse endpoint.
- Parsed data is inserted into the visit_logs table and can update the parent patient record.

## Settings and personalization flow
- User settings, rotation data, custom goals, and clinic schedule are stored in user_settings and rotations.
- Settings are loaded when the app initializes and saved when the user changes them.

## AI flow
- The frontend can call /api/parse-note for structured parsing of natural-language visit notes.
- The frontend can also call /api/parse as a generic proxy to the Anthropic API.
- The server keeps the Anthropic API key on the backend.

## Demo data flow
- The /api/demo/seed endpoint clears and repopulates a user’s data with demo patients, rotations, notes, and providers.
- This is used for onboarding or demonstration contexts.

## Needs Verification
- There is no visible event bus, queue, or background job system in the repository.
- The exact data lifecycle for client-side optimistic updates versus server confirmation is not fully separated in the code.
