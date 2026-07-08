# Screen Specifications

This document defines the key screens that should shape the ClinIQ experience. It focuses on purpose, behavior, and user value so that future implementation decisions are grounded in a clear product experience.

## 1. Daily Command Center

### Purpose
Help users understand what needs attention most today.

### Primary Persona
Dental student, faculty, administrator

### User Goals
- Understand the most important tasks for the day
- Identify urgent or at-risk work quickly
- Know what should happen next

### Information Displayed
- Priority queue
- Pending follow-ups
- Urgent cases
- AI-recommended actions
- Daily summary of workflow health

### Actions Available
- Open a case or patient
- Review recommendations
- Mark an item as complete or deferred
- Escalate an issue

### AI Features
- Daily summary
- Priority explanation
- Recommended next action

### Empty State
- Show a calm message that no urgent items are present
- Offer a path to review the broader caseload or recent activity

### Error State
- Show a clear failure message if required data is unavailable
- Offer a retry or fallback summary

### Loading State
- Skeleton cards or progressive loading for priority content
- Preserve clarity and avoid blank surfaces

### Success State
- Highlight that the user has a clear next action and a manageable workload

### Navigation Entry Points
- Login landing experience
- Main navigation shortcut
- Notification or alert trigger

### Navigation Exit Points
- Open patient or case view
- Open workflow details
- Open settings or profile

### Required Data
- Current caseload or workflow state
- Priority and urgency logic
- Recent activity and open items

### Future Enhancements
- Role-personalized daily views
- Adaptive recommendations over time
- Calendar-aware daily planning

---

## 2. Patient and Case Overview

### Purpose
Provide a concise, actionable view of a patient or case.

### Primary Persona
Dental student, faculty

### User Goals
- Understand the current status of a case
- Review the key facts quickly
- Decide what should happen next

### Information Displayed
- Patient summary
- Current treatment status
- Outstanding tasks
- Recent activity
- Risk indicators
- Next recommended action

### Actions Available
- Open visit history
- Add or update notes
- Start a workflow task
- Assign or review follow-up

### AI Features
- Case summary
- Risk explanation
- Suggested next step

### Empty State
- Show a clear message if no data exists yet for the case
- Offer a path to begin intake or document the first interaction

### Error State
- Display a failure state if the case cannot be loaded
- Provide a fallback path to return to the roster or queue

### Loading State
- Show the key content skeleton before complete data is available

### Success State
- Reinforce that the case is understood and the next action is clear

### Navigation Entry Points
- Daily priority view
- Patient roster
- Search result
- Notification

### Navigation Exit Points
- Visit detail
- Workflow task
- Return to roster or command center

### Required Data
- Patient identity and treatment context
- Current tasks and status
- History and relevant notes

### Future Enhancements
- Longitudinal patient insights
- Personalized case guidance
- Deeper timeline visualization

---

## 3. Visit Capture and Documentation View

### Purpose
Make documentation feel fast, structured, and useful rather than burdensome.

### Primary Persona
Dental student

### User Goals
- Capture visit information quickly
- Reduce manual rework
- Preserve useful clinical context

### Information Displayed
- Visit entry form
- Suggested structured fields
- Free-text note area
- AI-extracted fields
- Save or review state

### Actions Available
- Enter free text
- Review AI suggestions
- Edit extracted fields
- Save and continue

### AI Features
- Note parsing
- Structured field extraction
- Draft suggestions

### Empty State
- Provide a lightweight starting prompt or example note
- Keep the surface simple and focused

### Error State
- Show validation errors in a plain-language way
- Avoid technical language where possible

### Loading State
- Show that AI processing is in progress without blocking the user

### Success State
- Confirm that the visit was saved and summarize what changed

### Navigation Entry Points
- Case overview
- Daily queue
- Patient detail

### Navigation Exit Points
- Return to case overview
- Continue to next visit or task

### Required Data
- Current case context
- Visit details and note content
- Relevant patient metadata

### Future Enhancements
- Voice-assisted capture
- Adaptive templates by procedure or workflow
- Review and approval flows

---

## 4. Workflow Task Screen

### Purpose
Guide users through a defined clinical or operational workflow step.

### Primary Persona
Student, faculty, administrator

### User Goals
- Understand the current step
- Complete the task with minimal friction
- Know what happens next

### Information Displayed
- Current task state
- Required inputs
- Dependencies or blockers
- Related patient or team context
- Recommended next action

### Actions Available
- Complete the task
- Skip, defer, or escalate
- View dependency details
- Ask for help or clarification

### AI Features
- Context summarization
- Recommended action guidance
- Exception explanation

### Empty State
- Explain what the workflow is for and what is needed to begin

### Error State
- Clearly communicate blockers or missing requirements

### Loading State
- Show the task state as it loads or updates

### Success State
- Confirm completion and surface the next logical step

### Navigation Entry Points
- Daily command center
- Case overview
- Queue or exception list

### Navigation Exit Points
- Return to workflow list
- Advance to next workflow step
- Return to case context

### Required Data
- Workflow definition
- User role and permissions
- Related case or operational context

### Future Enhancements
- Multi-step workflow guidance
- Conditional branching based on context
- Automation for repeatable actions

---

## 5. Operations Monitor

### Purpose
Surface workflow problems and operational pressure before they become larger issues.

### Primary Persona
Clinical administrator, operations team

### User Goals
- Detect bottlenecks quickly
- Understand impact and urgency
- Decide where intervention is needed

### Information Displayed
- Active exceptions
- Bottlenecks by team or workflow
- Workload pressure indicators
- AI-generated operational summaries

### Actions Available
- Open affected cases
- Escalate an issue
- Review trend context
- Mark a blocker as addressed

### AI Features
- Bottleneck explanation
- Summary of operational health
- Priority recommendations

### Empty State
- Show that the system is stable and no active issues are present

### Error State
- Clearly communicate when operational data is unavailable

### Loading State
- Show a lightweight loading view for live operational metrics

### Success State
- Confirm that intervention was recorded and the issue is being monitored

### Navigation Entry Points
- Operations dashboard
- Alerts and notifications
- Daily command center

### Navigation Exit Points
- Case detail
- Team or workflow detail
- Return to dashboard

### Required Data
- Workflow and task data
- Exception logic
- Current operational status

### Future Enhancements
- Predictive bottleneck warnings
- Team-level workload balancing guidance
- Trend and root-cause analysis

---

## 6. Faculty Oversight View

### Purpose
Help faculty understand student progress, risk, and intervention needs quickly.

### Primary Persona
Faculty member

### User Goals
- Review student needs efficiently
- Identify intervention opportunities
- Support coaching with less manual labor

### Information Displayed
- Student or caseload summary
- Risk signals
- Pending items
- Coaching guidance
- Recent activity

### Actions Available
- Review student details
- Open intervention workflow
- Leave guidance or recommendations
- Escalate a concern

### AI Features
- Student performance summary
- Risk explanation
- Coaching prompts

### Empty State
- Show that no active oversight items are present

### Error State
- Explain when oversight data cannot be loaded

### Loading State
- Light skeleton loading for student or caseload summaries

### Success State
- Reinforce that coaching or intervention actions are clear and actionable

### Navigation Entry Points
- Faculty dashboard
- Student search or list
- Alert notification

### Navigation Exit Points
- Student detail view
- Intervention or messaging flow
- Return to dashboard

### Required Data
- Student activity and progress data
- Role-based visibility logic
- Relevant workflow context

### Future Enhancements
- Better longitudinal coaching insights
- Integration with student learning or performance trends
- More proactive intervention suggestions

---

## 7. Leadership Summary View

### Purpose
Provide a clear, high-level picture of institutional performance and emerging concerns.

### Primary Persona
Executive leadership

### User Goals
- Understand the state of the system quickly
- Identify strategic risks or opportunities
- Decide where attention is needed

### Information Displayed
- Summary metrics
- Trend direction
- Risk areas
- Operational highlights
- AI-generated leadership summary

### Actions Available
- Drill into a specific area
- Review a trend or issue
- Navigate to detailed operations views

### AI Features
- Executive summary
- Trend explanation
- Risk framing

### Empty State
- Show a calm and confident summary when no major issues are active

### Error State
- Explain any data gap in plain language

### Loading State
- Short lightweight loading experience for summary dashboards

### Success State
- Deliver a clear sense of current health and where to focus next

### Navigation Entry Points
- Executive dashboard
- Notification or alert route
- Deep link from operations views

### Navigation Exit Points
- Operational or workflow detail view
- Drill-down into a trend
- Return to main dashboard

### Required Data
- Aggregated operational and workflow data
- Trend context
- Institutional performance signals

### Future Enhancements
- Forecasting and scenario views
- Better cross-institution comparison
- Strategic planning support
