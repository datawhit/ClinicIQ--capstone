# Security Review

## What is present
- Passwords are hashed with bcryptjs before storage.
- Session-based authentication is used for protected routes.
- The Anthropic API key is kept server-side and not exposed in the client code.
- Protected endpoints require authentication middleware.

## What should be reviewed further
- The session secret falls back to a default value if SESSION_SECRET is not set.
- The server exits if the Anthropic API key is missing, which may be acceptable for a private deployment but should be considered in deployment planning.
- There is no indication in the checked-in code of a formal input-validation layer beyond the route-level checks used in the current handlers.
- The app appears to store sensitive clinical information, so data handling and access controls should be reviewed carefully before broad deployment.

## Needs Verification
- No explicit security policy, dependency audit, or penetration-testing notes were included in the repository snapshot.
- The app should be reviewed against institutional privacy requirements before any live patient-data use.
