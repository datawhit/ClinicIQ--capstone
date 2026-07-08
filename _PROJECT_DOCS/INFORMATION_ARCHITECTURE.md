# Information Architecture

This document proposes an ideal information architecture for ClinIQ based on user goals rather than the current implementation structure. It is designed to make the product easier to understand, easier to use, and more aligned with the daily needs of different personas.

## Design Principles

The structure below is organized around the core questions users bring to the platform:
- What needs attention today?
- What is the current state of this patient or case?
- What decision should happen next?
- What is the best action for this workflow?
- Where is the system creating friction or risk?

ClinIQ should feel like a decision-support environment, not a passive record repository.

---

## Primary Navigation

### 1. Today
Purpose: help users begin the day with clarity.

Why it exists:
- Users need a fast, actionable view of what matters most now.
- This is the highest-value entry point for students, faculty, and administrators.

Includes:
- Priority work queue
- Urgent actions
- Pending follow-ups
- Daily recommendations
- Alerts and exceptions

---

### 2. Patients
Purpose: support the core work of reviewing and managing clinical cases.

Why it exists:
- Patient management is the center of the clinical workflow.
- Users need rapid access to case context and status.

Includes:
- Patient roster and search
- Patient detail views
- Visit history
- Treatment status and progression
- Notes and medical context
- Handoffs and paired-provider context

---

### 3. Workflows
Purpose: organize the operational tasks that support clinical progression.

Why it exists:
- Students and staff need a structured view of recurring clinical tasks.
- This module is where administrative support becomes visible and actionable.

Includes:
- Pre-auth tracking
- Lab work
- Specialty referrals
- Follow-up management
- Pending documentation tasks

---

### 4. Guidance
Purpose: turn information into direction.

Why it exists:
- ClinIQ should help users decide what to do next, not just show data.
- This module differentiates the product from a system of record.

Includes:
- AI recommendations
- Suggested next actions
- Risk summaries
- Workflow nudges
- Coaching prompts

---

### 5. Operations
Purpose: give admins and operations teams visibility into clinic health.

Why it exists:
- Operational efficiency is a major value proposition for ClinIQ.
- The product should help teams understand where the system is slowing down.

Includes:
- Bottleneck monitoring
- Workload visibility
- Escalation management
- Process health summaries
- Cross-team coordination views

---

### 6. Insights
Purpose: support broader planning and strategic understanding.

Why it exists:
- Leadership and operations teams need summaries that connect day-to-day work to larger outcomes.

Includes:
- Trend summaries
- Completion and progression views
- Performance indicators
- Improvement opportunities

---

## Secondary Navigation

Secondary navigation should appear within each major module and be tailored to the user’s immediate task.

### Within Patients
- Overview
- Timeline
- Visits
- Tasks
- Notes
- Providers

### Within Workflows
- Pending items
- In progress
- Blocked items
- Completed items
- Exceptions

### Within Guidance
- Recommended actions
- Risk review
- Coaching insights
- AI assistant

### Within Operations
- Bottlenecks
- Workload
- Hand-offs
- Escalations
- Exceptions

### Within Insights
- Trends
- Benchmarks
- Forecasting
- Team summaries

---

## Dashboard Widgets

The home experience should be modular and customizable, with widgets that answer the most important daily questions.

Recommended widgets:
- Today’s priority queue
- Patients needing attention soon
- Upcoming deadlines or follow-ups
- Recent activity affecting the caseload
- AI-recommended next actions
- Operational alerts
- Graduation or milestone progress
- Rotations and scheduling pressure

These widgets should be grouped by user role, but the system should preserve a common core experience.

---

## AI Interaction Points

AI should be embedded where decisions happen, not isolated in a separate feature.

Recommended interaction points:
- Daily summary at login or dashboard entry
- Patient-level next-step suggestions
- Visit documentation support
- Exception and risk explanation
- Operational bottleneck summaries
- Leadership-ready summaries and trends

The AI experience should always support one of the following goals:
- Clarify what matters most
- Explain why something needs attention
- Recommend the next action
- Reduce the amount of manual review required

---

## Cross-Feature Relationships

The navigation should reinforce how features relate to one another.

### Patient context links to:
- Visits and documentation
- Workflow tasks
- Guidance and AI suggestions
- Providers and handoffs

### Workflow tasks link to:
- Patients
- Operations
- Guidance
- Insights

### Operations links to:
- Patients
- Workflows
- Insights
- Guidance

### Insights link back to:
- Operations
- Workflows
- Patients
- Guidance

This creates a connected experience where users can move from a high-level alert to the specific case and then to the operational context behind it.

---

## Recommended Information Hierarchy

1. Today
2. Patients
3. Workflows
4. Guidance
5. Operations
6. Insights
7. Settings

Settings should remain available but not be a primary destination for everyday users.

---

## Why This Structure Works

This architecture is designed to make the platform feel helpful in three ways:
- It reduces the amount of navigation needed to answer common questions
- It puts AI and recommendations near the decisions that matter
- It separates operational visibility from case detail without disconnecting the two

The structure reflects the product’s role as a system of intelligence and workflow optimization rather than a passive record system.
