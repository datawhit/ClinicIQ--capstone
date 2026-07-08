# User Workflows

## New user onboarding
1. User lands on the app and sees welcome/onboarding screens.
2. The user can add a patient, explore settings, or start the guided tour.
3. Demo data can be seeded to experience a populated caseload quickly.

## Add and manage a patient
1. User opens the add patient modal.
2. User enters chart number, discipline, procedure, dates, and provider-sharing info.
3. The backend stores the patient and optionally creates an initial visit record.
4. The patient appears in the roster and detail views.

## Log a visit
1. User opens a patient detail view.
2. User either types or speaks a visit description.
3. The AI parses the note into structured fields.
4. The user reviews and saves the visit.

## Review urgent and pending items
1. The app calculates urgency from treatment status, follow-up gaps, lab status, and pre-auth state.
2. Alerts appear in notifications and in urgent/pending views.
3. User can open a patient detail view from those alerts.

## Track graduation requirements
1. User views the graduation goals panel.
2. The app aggregates progress by discipline from patient visit history and treatment state.
3. The interface shows remaining requirements and pace.

## Manage rotations and schedule
1. User opens settings and the rotations/schedule area.
2. User adds rotation sites and recurring schedules.
3. The calendar-related UI uses these data objects for display and planning.

## Use provider directory and handoff features
1. User adds providers in the directory.
2. User can assign handoff partners to patients.
3. The paired provider panel simulates sharing patient details with a partner.

## Needs Verification
- The exact user journey for some modal flows may need manual validation in a running environment.
- Workflow behavior for voice capture and AI parsing depends on runtime access to the Anthropic API.
