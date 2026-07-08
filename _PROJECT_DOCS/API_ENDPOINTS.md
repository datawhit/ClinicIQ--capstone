# API Endpoints

## Authentication
- POST /api/auth/register
  - Registers a new user, hashes password, creates default settings, and starts a session.
- POST /api/auth/login
  - Authenticates a user or auto-registers on first login when credentials are supplied.
- POST /api/auth/reset-password
  - Resets a password for an existing user.
- POST /api/auth/logout
  - Destroys the session.
- GET /api/auth/me
  - Returns the current authenticated user.

## Patients
- GET /api/patients
  - Returns all patients for the current user, including visit history.
- POST /api/patients
  - Creates a new patient.
- POST /api/patients/import
  - Imports patient rows from a roster CSV payload.
- PUT /api/patients/:id
  - Updates a patient record.
- DELETE /api/patients/:id
  - Deletes a patient record.
- POST /api/patients/:id/visits
  - Adds a visit log entry.
- DELETE /api/patients/:id/visits/:visitId
  - Deletes a visit log entry.

## Notes
- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id

## Rotations
- GET /api/rotations
- POST /api/rotations
- PUT /api/rotations/:id
- DELETE /api/rotations/:id
- PUT /api/rotations
  - Batch replace all rotations for the current user.

## Demo data
- POST /api/demo/seed
  - Clears and seeds demo patients, notes, rotations, and providers for the active user.

## Providers
- GET /api/providers
- POST /api/providers
- PUT /api/providers/:id
- DELETE /api/providers/:id

## Changelog
- POST /api/changelog
- GET /api/changelog

## Settings
- GET /api/settings
- PUT /api/settings

## AI
- POST /api/parse-note
  - Parses free-text visit notes into structured fields using Anthropic.
- POST /api/parse
  - Generic Anthropic proxy endpoint.

## Notes on auth
Most data routes are protected by requireAuth, which returns 401 when no session user exists.

## Needs Verification
- The frontend may rely on additional undocumented endpoints or client-only helpers not captured here.
- The API does not currently expose a visible OpenAPI or Swagger definition.
