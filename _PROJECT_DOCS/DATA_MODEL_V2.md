# Data Model V2

This document recommends how the existing database should evolve to support ClinIQ 2.0 without requiring a disruptive rewrite. The approach is incremental: preserve the current working data where possible, then extend it to support workflow intelligence, role-aware behavior, configuration, and AI guidance.

## Guiding Principles

- Preserve current entities that already support core workflows
- Add new entities where the product needs richer workflow and configuration behavior
- Keep the model understandable and durable for future institutional expansion
- Separate operational data from configuration and AI support logic

---

## Existing Data to Preserve

The current model already contains important foundations for:
- Users
- Patients
- Visits and notes
- Rotations and provider relationships
- Settings
- Changelog and activity

These should remain the core of the system and be extended rather than replaced.

---

## New Entities

### 1. Workflows
Purpose: represent the multi-step operational process for a patient, task, or case.

Suggested fields:
- id
- workflow_type
- status
- current_step
- owner_user_id
- related_entity_type
- related_entity_id
- created_at
- updated_at

### 2. Workflow Steps
Purpose: define the steps that make up a workflow.

Suggested fields:
- id
- workflow_id
- step_key
- step_name
- step_status
- required_inputs
- assigned_role
- created_at

### 3. Workflow Events
Purpose: record transitions and changes in workflow state.

Suggested fields:
- id
- workflow_id
- event_type
- actor_user_id
- metadata
- created_at

### 4. Tasks
Purpose: represent discrete actionable items in the workflow.

Suggested fields:
- id
- task_type
- title
- description
- status
- priority
- due_at
- owner_user_id
- related_workflow_id
- related_patient_id
- created_at
- updated_at

### 5. Recommendations
Purpose: store AI-generated or system-generated recommendations for action.

Suggested fields:
- id
- recommendation_type
- entity_type
- entity_id
- user_id
- content
- reason
- confidence
- status
- created_at
- expires_at

### 6. Exceptions
Purpose: represent operational issues, delays, or blockers.

Suggested fields:
- id
- exception_type
- severity
- status
- related_entity_type
- related_entity_id
- summary
- owner_user_id
- created_at
- resolved_at

### 7. Notifications
Purpose: support role-relevant alerts and nudges.

Suggested fields:
- id
- recipient_user_id
- notification_type
- title
- message
- related_entity_type
- related_entity_id
- is_read
- created_at

---

## Relationships

### Core relationships
- Users have many tasks
- Patients have many visits and workflows
- Workflows belong to a patient or operational entity
- Tasks belong to a workflow
- Recommendations belong to a user and entity
- Exceptions relate to workflows, patients, or operations
- Notifications belong to a user and can reference a related entity

### Relationship design principles
- Keep the model relational rather than overly document-centric
- Allow workflow and task data to be reused across different experiences
- Support a single source of truth for case state while allowing summary views

---

## Configuration Objects

### 1. Institution Configuration
Purpose: store configuration that applies to an institution or deployment.

Suggested fields:
- id
- institution_id
- configuration_key
- configuration_value
- created_at
- updated_at

### 2. Role Configuration
Purpose: define role-specific behavior, views, and permissions.

Suggested fields:
- id
- role_name
- dashboard_modules
- permissions
- workflow_overrides
- created_at

### 3. Workflow Configuration
Purpose: define reusable workflow rules and step definitions.

Suggested fields:
- id
- institution_id
- workflow_type
- version
- definition_json
- is_active
- created_at

---

## AI Entities

### 1. AI Interactions
Purpose: record the AI requests and their context for transparency and future improvement.

Suggested fields:
- id
- user_id
- interaction_type
- prompt_context
- response_summary
- confidence
- created_at

### 2. AI Feedback
Purpose: capture user acceptance or rejection of AI guidance.

Suggested fields:
- id
- recommendation_id
- user_id
- feedback_type
- created_at

These entities support trust, learning, and future product refinement without overcomplicating the core model.

---

## Workflow Entities

The workflow model should support:
- Multi-step state progression
- Blockers and dependencies
- Ownership and escalation
- Task creation and closure
- Longitudinal history of workflow changes

This is essential for the product’s daily guidance and operational visibility.

---

## Notification Entities

Notifications should support:
- Urgent action reminders
- Workflow state changes
- AI insights that deserve attention
- Escalations and exceptions

The notification layer should be separate enough from the core workflow model that it can evolve without damaging the main product logic.

---

## Institution Configuration

To support future scale, the data model should clearly separate:
- Core product data
- Institution configuration
- Client-specific behavior

This division helps preserve the core platform while allowing variation across institutions.

---

## Role Management

The model should support:
- Standard roles such as student, faculty, administrator, operations, finance, and executive leadership
- Role-based access to data and workflows
- Role-specific dashboard and recommendation behavior

The role model should be lightweight but explicit so it can support both immediate product experience and future growth.
