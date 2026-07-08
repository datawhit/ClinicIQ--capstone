# Project Overview

## What ClinIQ is
ClinIQ is a full-stack web application for dental students to manage a clinical caseload, track treatment progress, monitor graduation requirements, and receive AI-assisted support. The current implementation is a single-page React application backed by an Express server and PostgreSQL.

## Primary purpose
The app appears to be designed for NYU College of Dentistry students and focuses on:
- patient roster management
- visit logging
- pre-auth and lab tracking
- graduation-goal progress tracking
- paired-provider handoff support
- AI-assisted note parsing and chat

## Current implementation summary
From the codebase, the main product surface is implemented as:
- a mobile-first React UI in src/App.jsx
- an Express API in server.js
- PostgreSQL schema and initialization in db.js

## Product positioning
The repository README and code indicate this is a capstone product intended for clinical education workflows rather than a general-purpose CRM. The UI is tailored to a dental student workflow, with disciplines, treatment phases, graduation requirements, and dental-specific nudges.

## High-level status
The repository is more developed than the older Replit notes suggest. The core application appears functional in structure, though the runtime environment in this workspace currently has an incomplete local dependency/toolchain state (for example, a build check reported that vite was not available in the environment).

## Important caveat
Some lower-level behaviors are inferred from the UI and server routes rather than from a separate test suite or external docs. Where the code is ambiguous, this documentation marks items as Needs Verification.
