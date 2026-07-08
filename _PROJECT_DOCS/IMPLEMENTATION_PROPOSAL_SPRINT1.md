# Sprint 1 Implementation Proposal

This proposal updates the approved Sprint 1 plan to reflect the refined architecture: a narrow, reusable Workflow Intelligence Service, a deterministic Priority Service, and a future Recommendation Service that will consume the priority output.

## 1. Feature Name

Workflow Intelligence Service with Daily Priority Summary

## 2. Goal

Introduce a reusable backend service layer that can produce deterministic workflow priority signals for the initial Daily Priority Summary experience, while keeping the architecture clean enough to support future dashboards, risk scoring, notifications, and AI recommendations.

## 3. Why this task comes first

This is the smallest slice that still creates visible user value and establishes the correct platform foundation.

It comes first because:
- it delivers a useful daily experience immediately
- it moves business logic out of the main app and server entry points
- it creates a reusable foundation for future features
- it keeps Sprint 1 narrowly focused and technically coherent

## 4. User value

The user gains a clearer daily experience that answers:
- What matters most today?
- Why does it matter?
- What should happen next?

This gives students, faculty, and administrators a simple, trustworthy way to enter the day with clarity.

## 5. Engineering value

This architecture creates a durable foundation for future work:
- deterministic prioritization is separated from later recommendation logic
- priority data is reusable for dashboards, reporting, risk scoring, and notifications
- the main application files remain lean and focused on presentation

## 6. Revised architecture

### Service model

Sprint 1 should introduce two distinct services:

1. Priority Service
   - deterministic
   - produces a numeric priority score and derived priority level
   - provides explainable reasons and recommended actions

2. Recommendation Service
   - introduced later
   - consumes the Priority Service output
   - adds richer, context-aware guidance without mixing concerns

### Recommended service boundaries

- Priority Service: scoring, ranking, and explainability
- Recommendation Service: later-stage guidance and AI-oriented suggestions
- Dashboard Service: shaping summary payloads for UI consumption

## 7. Workflow Intelligence Service introduction

The Workflow Intelligence Service should be introduced as a backend service layer that normalizes workflow and case signals into reusable outputs.

Its responsibilities in Sprint 1 are narrow:
- read current domain data
- apply deterministic priority rules
- produce a summary payload for the Daily Priority Summary experience

It should not become a large multi-purpose intelligence platform in Sprint 1. Instead, it should be the first reusable service that future modules can build on.

## 8. Priority Service role within the architecture

The Priority Service should be the first consumer-facing module inside the Workflow Intelligence Service.

It should be responsible for:
- calculating a numeric priority score from 0 to 100
- deriving a priority level from the score
- generating an explanation for why an item is prioritized
- producing a recommended action
- returning metadata for the UI

The Priority Service is deterministic and should remain explainable.

## 9. Canonical internal representation

The canonical internal representation for every priority item should be:
- priorityScore
- priorityLevel
- reason
- recommendedAction
- relatedEntity
- timestamp

### Score semantics
- 0–29: Low
- 30–69: Medium
- 70–100: High

This numeric representation supports future analytics, AI scoring, reporting, and risk models.

## 10. Priority rules for Sprint 1

The initial priority rules should be explainable and deterministic.

### High Priority
An item becomes High Priority when it is:
- urgent now
- likely to block progress
- tied to a near-term deadline or milestone
- associated with a significant workflow or operational risk

Examples:
- appointment today
- graduation requirement at risk
- missing documentation blocking the next step
- insurance issue delaying progression
- lab delay impacting treatment flow
- faculty follow-up needed immediately
- financial hold affecting next action

### Medium Priority
An item becomes Medium Priority when it is:
- important but not urgent
- pending and should be dealt with soon
- part of normal progression but not time-critical

Examples:
- follow-up expected within a few days
- patient inactivity that suggests re-engagement is needed
- pending step that matters soon but is not blocking

### Low Priority
An item becomes Low Priority when it is:
- routine
- informational
- non-blocking
- unlikely to affect immediate workflow outcomes

Examples:
- routine check-ins
- completed but not requiring immediate action
- low-risk or low-impact items

## 11. Recommended folder structure

### Frontend

- src/components/dashboard
  - DailyPrioritySummary
  - PriorityItemCard
  - PriorityReasonText
- src/components/workflow
  - WorkflowSummaryPanel
- src/shared/ui
  - EmptyState
  - LoadingState
  - ErrorState
  - PriorityBadge
- src/services
  - workflowIntelligenceClient

### Backend

- server/services/workflow
  - priorityService
  - dashboardService
  - recommendationService
- server/api/routes
  - dashboardRoutes
  - workflowRoutes

### Service boundary note

The main app and server entry points should remain thin integration points.
They should not contain the core scoring or workflow logic.

## 12. Proposed output contract for priority items

Each priority item returned by the service should include:
- priorityScore
- priorityLevel
- reason
- recommendedAction
- relatedEntity
- timestamp

This output contract is intentionally structured so it can be reused by:
- the Daily Priority Summary UI
- future dashboards
- future AI recommendation services
- reporting and analytics modules

## 13. Files that will be modified

Existing files expected to be involved:
- src/App.jsx
- server.js

These should remain integration points rather than the location of core business logic.

## 14. New files that will be created

Planned new files include:
- a workflow intelligence service module
- a priority service module
- a dashboard service module
- a dashboard API route module
- a reusable UI summary component set

## 15. Components that will be added

- DailyPrioritySummary
- PriorityItemCard
- PriorityReasonText
- WorkflowSummaryPanel
- EmptyStateSummary
- SummaryLoadingState

## 16. Backend changes

The backend should introduce:
- a Workflow Intelligence Service
- a Priority Service
- a summary endpoint for daily priority data
- a structured response contract for future consumers

## 17. Frontend changes

The frontend should:
- call the summary endpoint
- render the priority list with clear reasons and actions
- display deterministic scores and derived levels
- keep the experience simple and calm

## 18. API changes

A new API module should be introduced, for example:
- GET /api/v2/dashboard/summary

The response should include:
- summary title
- priority items
- priorityScore
- priorityLevel
- reason
- recommendedAction
- relatedEntity
- timestamp

## 19. Database changes

No schema change is required for Sprint 1.
The service should use the existing data model and avoid premature persistence changes.

## 20. Dependencies

- existing patient, visit, and task data
- existing authentication and user context
- existing app shell and routing structure

## 21. Risks

- The initial scoring rules may need refinement once real usage data is available
- The service must remain explainable and not become overly abstract too early
- The architecture should stay narrow to avoid turning Sprint 1 into a platform rewrite

## 22. Definition of Done

Sprint 1 is complete when:
- a reusable Workflow Intelligence Service exists
- the Priority Service is implemented as a deterministic scoring module
- the Daily Priority Summary is delivered through that service
- the logic is no longer embedded in the main app and server files
- the service contract is structured for future dashboard and recommendation use

## 23. Acceptance Criteria

- A user can see a daily priority summary in the app
- Each priority item includes a numeric priorityScore and derived priorityLevel
- Each item includes a reason and recommendedAction
- The logic is implemented in reusable services rather than directly in the app shell
- The foundation can support future dashboard and recommendation features

## 24. Estimated implementation time

Approximately 3 to 4 engineering days

## 25. Suggested Git commit message

feat: introduce workflow intelligence service and priority scoring foundation
