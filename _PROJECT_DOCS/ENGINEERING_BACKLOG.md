# Engineering Backlog

This backlog translates the ClinIQ 2.0 product strategy into an implementation-oriented plan. It is intentionally incremental and designed to preserve the current system while enabling the next product phase.

## Epic 1: Daily Priority and Case Intelligence

### Feature 1.1: Daily Priority Experience

#### Task 1.1.1: Define priority scoring model
- Description: Establish the rules for identifying what matters most for each user on a given day.
- Priority: P0
- Dependencies: Existing patient, visit, and task data
- Estimated complexity: M
- Suggested implementation order: 1
- Definition of Done: A documented priority model exists and is usable by the product and engineering teams.

#### Subtasks
- Review current urgency and status indicators already present in the app
- Define a simple scoring framework for priority and urgency
- Document the rules and edge cases

#### Task 1.1.2: Create daily summary service
- Description: Produce a daily summary of the most important work for the current user.
- Priority: P0
- Dependencies: Task 1.1.1
- Estimated complexity: M
- Suggested implementation order: 2
- Definition of Done: A service produces a consistent daily summary payload for the UI.

#### Subtasks
- Define the data inputs for summary generation
- Create the backend aggregation logic
- Expose the results through an API endpoint

#### Task 1.1.3: Build daily command center UI shell
- Description: Provide the main daily view for students and other core users.
- Priority: P0
- Dependencies: Task 1.1.2
- Estimated complexity: M
- Suggested implementation order: 3
- Definition of Done: The view renders the priority summary and related actions.

#### Subtasks
- Define the layout for the screen
- Connect the UI to the summary service
- Add empty, loading, and error states

---

### Feature 1.2: Case Intelligence View

#### Task 1.2.1: Define case intelligence payload
- Description: Establish the fields and summaries needed to explain the current state of a case.
- Priority: P0
- Dependencies: Existing patient and visit data
- Estimated complexity: M
- Suggested implementation order: 4
- Definition of Done: A structured case intelligence payload can be generated for a patient or case.

#### Subtasks
- Identify fields already available in the schema
- Define narrative and structured summary fields
- Document the output shape

#### Task 1.2.2: Add case summary endpoint
- Description: Provide backend support for retrieving a case summary for a selected patient.
- Priority: P0
- Dependencies: Task 1.2.1
- Estimated complexity: M
- Suggested implementation order: 5
- Definition of Done: The endpoint returns a summary with key status, risk, and next-step indicators.

#### Subtasks
- Expose the new backend route
- Ensure role-based access control is enforced
- Validate output with existing data

#### Task 1.2.3: Build case overview experience
- Description: Present the case summary and actions in a clear, distilled experience.
- Priority: P0
- Dependencies: Task 1.2.2
- Estimated complexity: M
- Suggested implementation order: 6
- Definition of Done: The case overview shows the summary and supports action entry points.

#### Subtasks
- Create the screen layout
- Connect it to the summary endpoint
- Add state handling for empty and error conditions

---

## Epic 2: AI Guidance and Recommendation Layer

### Feature 2.1: AI-Guided Next-Step Support

#### Task 2.1.1: Define recommendation engine inputs
- Description: Determine what information should drive next-step suggestions.
- Priority: P0
- Dependencies: Existing workflow and patient data
- Estimated complexity: M
- Suggested implementation order: 7
- Definition of Done: Recommendation inputs are documented and accessible for use in the experience layer.

#### Subtasks
- Identify the fields needed for meaningful recommendations
- Define recommendation categories
- Document the fallback behavior when inputs are missing

#### Task 2.1.2: Create recommendation service
- Description: Generate actionable recommendations for users based on current context.
- Priority: P0
- Dependencies: Task 2.1.1
- Estimated complexity: L
- Suggested implementation order: 8
- Definition of Done: The service produces recommendations that can be displayed in the UI.

#### Subtasks
- Build the backend logic for generating recommendations
- Ensure recommendations remain explainable and bounded
- Add guardrails for unsupported or uncertain cases

#### Task 2.1.3: Surface recommendations in the UI
- Description: Present recommendations in the daily and case views without overwhelming the user.
- Priority: P0
- Dependencies: Task 2.1.2
- Estimated complexity: M
- Suggested implementation order: 9
- Definition of Done: Recommendations appear in the correct user contexts with clear explanation.

#### Subtasks
- Design the recommendation card experience
- Connect the UI to the recommendation service
- Add user controls to dismiss or accept guidance

---

## Epic 3: Workflow Visibility and Exceptions

### Feature 3.1: Operational Exception View

#### Task 3.1.1: Define exception model
- Description: Establish how exceptions, bottlenecks, and operational issues are represented.
- Priority: P1
- Dependencies: Existing workflow and task models
- Estimated complexity: M
- Suggested implementation order: 10
- Definition of Done: Exceptions can be represented consistently in the system.

#### Subtasks
- Identify the data needed to describe an exception
- Define severity, type, and ownership fields
- Document how an exception resolves

#### Task 3.1.2: Build exception aggregation service
- Description: Aggregate workflow issues into a concise operational view.
- Priority: P1
- Dependencies: Task 3.1.1
- Estimated complexity: L
- Suggested implementation order: 11
- Definition of Done: The service returns prioritized exceptions for operations views.

#### Subtasks
- Aggregate data from workflow tasks and case states
- Define ranking and grouping rules
- Expose the results through the API

#### Task 3.1.3: Create operations monitor experience
- Description: Provide an experience for administrators and operations teams to review operational issues.
- Priority: P1
- Dependencies: Task 3.1.2
- Estimated complexity: M
- Suggested implementation order: 12
- Definition of Done: The operations view shows active issues and supports drill-down.

#### Subtasks
- Design the monitor layout
- Connect the view to the exception service
- Add empty and error handling

---

## Epic 4: Role-Aware Experience

### Feature 4.1: Role-Based Dashboards

#### Task 4.1.1: Define role-based experience contract
- Description: Clarify what each core role should see first and how dashboards differ.
- Priority: P1
- Dependencies: Existing auth and role model
- Estimated complexity: M
- Suggested implementation order: 13
- Definition of Done: A role-based experience contract exists for students, faculty, operations, and leadership.

#### Subtasks
- Review personas and required user goals
- Define the dashboard modules for each role
- Document navigation differences

#### Task 4.1.2: Implement role-aware layout layer
- Description: Support different dashboard layouts and module sets based on role.
- Priority: P1
- Dependencies: Task 4.1.1
- Estimated complexity: M
- Suggested implementation order: 14
- Definition of Done: The UI can render different dashboard layouts by role.

#### Subtasks
- Add role-based component composition
- Ensure permissions are respected
- Add fallback behavior for unknown roles

#### Task 4.1.3: Add role-specific widgets and actions
- Description: Surface the right actions and widgets for each role.
- Priority: P1
- Dependencies: Task 4.1.2
- Estimated complexity: M
- Suggested implementation order: 15
- Definition of Done: Each role sees a tailored experience that supports their daily workflow.

#### Subtasks
- Implement the student dashboard module set
- Implement the faculty and operations modules
- Add support for future leadership views

---

## Epic 5: Workflow and Data Foundation

### Feature 5.1: Workflow State Model Evolution

#### Task 5.1.1: Review and extend workflow entities
- Description: Expand the existing data model to represent workflow stages, blockers, and transitions.
- Priority: P0
- Dependencies: Existing schema and workflow data
- Estimated complexity: L
- Suggested implementation order: 16
- Definition of Done: The data model supports multi-step workflows with clear state transitions.

#### Subtasks
- Review the current workflow-related schema
- Add new entities or columns where needed
- Document the state definitions

#### Task 5.1.2: Introduce configuration support for workflow rules
- Description: Allow the platform to support institution-specific workflow definitions without hard-coding every rule.
- Priority: P1
- Dependencies: Task 5.1.1
- Estimated complexity: L
- Suggested implementation order: 17
- Definition of Done: Workflow rules can be configured at the institution or program layer.

#### Subtasks
- Define configuration objects for workflow rules
- Create storage and retrieval patterns
- Document the rule evaluation approach

---

## Epic 6: Institutional Configuration Foundation

### Feature 6.1: Configuration Layer

#### Task 6.1.1: Define configuration objects
- Description: Define the reusable configuration objects needed for roles, workflows, and institution-specific behavior.
- Priority: P1
- Dependencies: Existing settings and user model
- Estimated complexity: M
- Suggested implementation order: 18
- Definition of Done: Configuration contracts are documented and can be stored and read by the application.

#### Subtasks
- Review the current settings model
- Define the configuration shape for roles and workflows
- Document defaults and overrides

#### Task 6.1.2: Add configuration service
- Description: Provide a shared service for reading institution configuration and applying it to the app.
- Priority: P1
- Dependencies: Task 6.1.1
- Estimated complexity: L
- Suggested implementation order: 19
- Definition of Done: The app can read configuration data from a central layer.

#### Subtasks
- Build the service abstraction
- Add cache and fallback behavior
- Make the service available to UI and API layers

---

## Epic 7: Notifications and Trust Signals

### Feature 7.1: Notification Model and Experience

#### Task 7.1.1: Define notification categories
- Description: Establish the types of notifications ClinIQ should surface to users.
- Priority: P2
- Dependencies: Existing activity and alert features
- Estimated complexity: M
- Suggested implementation order: 20
- Definition of Done: Notification categories are documented and mapped to user needs.

#### Subtasks
- Review existing alert and changelog concepts
- Define categories such as urgent action, workflow change, and AI insight
- Document user-facing behavior

#### Task 7.1.2: Implement notification delivery layer
- Description: Support the generation and delivery of role-relevant notifications.
- Priority: P2
- Dependencies: Task 7.1.1
- Estimated complexity: L
- Suggested implementation order: 21
- Definition of Done: Notifications can be generated and surfaced consistently.

#### Subtasks
- Design the backend delivery flow
- Add notification persistence and retrieval
- Ensure proper role filtering
