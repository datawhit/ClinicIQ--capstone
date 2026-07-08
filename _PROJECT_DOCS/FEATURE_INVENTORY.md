# Feature Inventory

## Core features implemented in the current codebase

### Authentication and onboarding
- registration, login, password reset, logout
- session-based authentication
- onboarding modal and guided tour flow
- demo user support

### Patient management
- add patient
- edit patient details
- view patient detail screen
- delete patient
- patient urgency and status logic
- treatment completion state
- handoff / paired-provider features
- patient language support

### Visit logging
- log visits
- AI-assisted parsing from free-text notes
- voice-input support for NLP input
- CDT code support
- visit history timeline in patient detail

### Clinical workflow support
- pre-auth status tracking
- lab tracking
- specialty referral tracking
- treatment-phase display and nudges
- expected completion prediction and follow-up reminders

### Graduation and planning
- graduation goals panel
- goal progress by discipline
- graduation date and pace tracking
- pending items and alert logic

### Scheduling and calendar
- appointment scheduling
- rotation tracking
- calendar-like UI surfaces for appointments and rotations

### Notes and knowledge management
- student notes with pinning and categories
- notebook-style note editing

### Provider directory
- add/edit/delete provider entries
- provider roles and disciplines

### AI assistant
- floating AI chat panel
- caseload-aware prompt suggestions
- backend proxy to Anthropic

### Activity and settings
- changelog / activity log
- settings modal for profile, schedule, rotations, appearance, and activity
- CSV import and CSV export of roster data

## Feature areas that appear present but may need deeper verification
- exact behavior of all urgency heuristics
- precise calculation formulas for graduation progress
- whether all UI tabs are wired to backend-backed state in every context

## Needs Verification
- Some feature labels and visuals indicate a richer experience than the code path currently documented here.
- The build and runtime behavior should be tested once dependencies are available.
