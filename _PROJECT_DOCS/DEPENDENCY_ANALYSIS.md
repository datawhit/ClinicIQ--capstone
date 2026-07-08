# Dependency Analysis

## Runtime dependencies
The application depends on:
- express for the HTTP server
- express-session and connect-pg-simple for session storage
- bcryptjs for password hashing
- pg for PostgreSQL access
- react and react-dom for the frontend
- vite and @vitejs/plugin-react for development/build pipeline
- @anthropic-ai/sdk for AI integration

## Notable dependency implications
- The app expects a live PostgreSQL connection through DATABASE_URL.
- The app expects Anthropic credentials through ANTHROPIC_API_KEY or VITE_ANTHROPIC_API_KEY.
- The app expects a session secret through SESSION_SECRET, although it has a fallback.

## Observed environment issue
A build check in this workspace reported that vite was not available in the environment, which suggests local dependencies may not be installed or the environment is incomplete.

## Needs Verification
- No lockfile was visible in the initial workspace snapshot, so dependency reproducibility should be confirmed.
- The runtime may need a package manager install step before local development can be validated.
