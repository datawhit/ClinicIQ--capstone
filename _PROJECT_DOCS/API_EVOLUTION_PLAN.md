# API Evolution Plan

This document recommends how the existing API should evolve to support ClinIQ 2.0. The aim is not a rewrite, but a controlled extension that preserves current functionality while enabling a richer product experience.

## Principles

- Preserve existing working endpoints where they remain useful
- Add new modules for workflow intelligence, recommendations, exceptions, and configuration
- Introduce versioning early enough to support safe evolution
- Keep the API layered so the UI can evolve without depending on fragile backend logic

---

## Endpoints to Keep

The following areas should continue to exist and remain stable where possible:
- Authentication endpoints
- Patient read and write endpoints
- Visit and note endpoints
- Provider and settings endpoints
- Existing data retrieval patterns used by the current experience

These endpoints should be retained because they support the current user workflows and are already part of the product surface.

---

## Endpoints to Redesign

### 1. Dashboard and summary endpoints
The current experience should move away from generic data retrieval toward purpose-specific summary endpoints.

Recommended redesign:
- Replace broad or overloaded query endpoints with summary-oriented endpoints for:
  - daily priorities
  - case intelligence
  - workflow exceptions
  - role-specific dashboards

### 2. AI-related endpoints
The current AI integration should be formalized as a dedicated service layer rather than being treated as ad hoc routes.

Recommended redesign:
- Separate recommendation generation from direct model invocation
- Standardize the request and response shapes
- Ensure explainability is part of the response contract

### 3. Workflow-related endpoints
The current backend should evolve to expose workflow state and task movement more explicitly.

Recommended redesign:
- Use workflow-oriented endpoints instead of only entity-level updates
- Support state transitions and task assignment clearly

---

## New API Modules

### 1. Dashboard API
Purpose: return role-aware summaries and task prioritization data.

Suggested modules:
- GET /api/v2/dashboard/summary
- GET /api/v2/dashboard/role/:role

### 2. Case Intelligence API
Purpose: return a structured understanding of a case or patient.

Suggested modules:
- GET /api/v2/cases/:id/intelligence
- GET /api/v2/cases/:id/next-actions

### 3. Workflow API
Purpose: manage and query workflows, tasks, and transitions.

Suggested modules:
- GET /api/v2/workflows
- POST /api/v2/workflows
- GET /api/v2/workflows/:id
- POST /api/v2/workflows/:id/transition
- GET /api/v2/tasks

### 4. Recommendation API
Purpose: expose the AI-driven recommendation experience.

Suggested modules:
- GET /api/v2/recommendations
- POST /api/v2/recommendations/resolve

### 5. Exception API
Purpose: expose operational issues, bottlenecks, and alerts.

Suggested modules:
- GET /api/v2/exceptions
- POST /api/v2/exceptions/:id/resolve

### 6. Configuration API
Purpose: provide institution and role configuration to the runtime experience.

Suggested modules:
- GET /api/v2/configuration
- GET /api/v2/configuration/:scope

### 7. Notification API
Purpose: manage reminders, alerts, and user-facing operational signals.

Suggested modules:
- GET /api/v2/notifications
- POST /api/v2/notifications/:id/read

---

## Versioning Strategy

A versioned API is important because the product is moving from a prototype-style experience into a more durable platform shape.

Recommended approach:
- Introduce /api/v2 for all new functionality
- Keep /api existing endpoints stable for current functionality during transition
- Move new product capabilities to v2 first
- Avoid forcing a complete backend rewrite in one step

This keeps the platform evolvable while reducing risk.

---

## Authentication Improvements

The current authentication model should be preserved but strengthened for the next phase.

Recommended improvements:
- Formalize role-based access across the new API modules
- Ensure route-level permissions are explicit for student, faculty, admin, and operations use cases
- Introduce clearer session and access handling for new workflow and operational endpoints
- Add consistent permission checks for summary, recommendation, and exception endpoints

---

## Scalability Considerations

### 1. Keep aggregation logic off the UI layer
Summary and exception views should be served by the backend rather than assembled on the client.

### 2. Use consistent response shapes
A common response contract will make it easier to evolve both backend and frontend without brittle integration.

### 3. Prepare for role-based data shaping
The API should be able to return different data based on user role and permissions without duplicating logic.

### 4. Keep AI logic service-oriented
Recommendation generation, explanation, and summarization should be centralized so the behavior stays consistent and easier to govern.

### 5. Avoid overloading general endpoints
The API should be structured around product use cases rather than low-level CRUD operations alone.
