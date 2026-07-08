# Technical Debt

## Observed areas of risk
- The frontend logic is concentrated in a very large file, src/App.jsx, which makes the codebase difficult to navigate and maintain.
- The backend routes are concentrated in a monolithic server.js file rather than being split into modules.
- The database schema is created inline in db.js, which is workable for a capstone but less robust for long-term evolution.
- The app does not appear to have a visible automated test suite or CI pipeline in the repository snapshot.
- The build environment in this workspace was not fully operational, which complicates verification.

## Product risk notes
- Some features are implemented with UI state and business logic in the same place, which may make future changes more error-prone.
- AI integration is tightly coupled to the runtime and will fail if credentials are unavailable.

## Recommendations based on code inspection only
- Introduce a component-based frontend structure over time.
- Split the backend into route modules and service modules.
- Add migrations and database versioning.
- Add automated tests for auth, patient CRUD, and AI parsing.

## Needs Verification
- The current technical debt is inferred from repository structure and observed implementation patterns, not from a formal refactoring audit.
