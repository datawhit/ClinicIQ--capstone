# Workflow Engine

This document defines the major workflows that should shape the ClinIQ experience. It focuses on the way work moves through the product and where users, decisions, and AI support intersect.

## 1. Patient Intake

### Purpose
Capture the initial state of a patient or case so that the workflow can continue with clarity.

### Decision points
- Is the patient new or existing?
- What is the current stage of care or workflow?
- What information is essential to begin?

### Bottlenecks
- Missing or incomplete information
- Unclear ownership of the next step
- Too much manual entry for a simple intake step

### Automation opportunities
- Suggested field completion
- Auto-fill from known records or prior context
- Guided intake path based on role or case type

### AI opportunities
- Suggest missing information
- Summarize context for the next step
- Highlight likely follow-up requirements

### Responsible user
Student or administrator

### Success criteria
- The case is entered with enough clarity to proceed without confusion
- The next step is obvious

---

## 2. Treatment Planning

### Purpose
Translate the intake information into a clear treatment pathway and next actions.

### Decision points
- What is the current treatment stage?
- What is most urgent or blocking?
- What should happen next in the plan?

### Bottlenecks
- Lack of clarity around next steps
- Complex or inconsistent treatment progression
- Too much context switching to understand the plan

### Automation opportunities
- Suggested next steps based on workflow state
- Dynamic planning prompts
- Conditional guidance based on stage and context

### AI opportunities
- Summarize the plan in simple terms
- Highlight risk or missing requirements
- Recommend the next best action

### Responsible user
Student, faculty, or administrator depending on the stage

### Success criteria
- The plan is understandable and actionable
- The user can move forward without re-evaluating the whole case

---

## 3. Insurance Review

### Purpose
Ensure that insurance-related requirements are visible early enough to prevent delays.

### Decision points
- Is insurance review required?
- What information is missing?
- Is there a likely issue or blocker?

### Bottlenecks
- Delayed visibility into insurance readiness
- Incomplete information or unclear requirements
- Manual tracking across systems

### Automation opportunities
- Prompt for missing insurance information
- Flag incomplete or risky cases early

### AI opportunities
- Surface likely blockers
- Summarize the state of readiness
- Recommend follow-up actions

### Responsible user
Administrator or student depending on workflow ownership

### Success criteria
- Insurance-related risks are visible before they become major blockers

---

## 4. Pre-Authorization

### Purpose
Move pre-authorization tasks forward with clear ownership and status.

### Decision points
- Is pre-authorization required?
- Is the case ready for review?
- What information is outstanding?

### Bottlenecks
- Unclear ownership
- Missing documentation
- Delayed follow-up

### Automation opportunities
- Workflow state updates
- Reminders for incomplete requirements
- Escalation when a case remains blocked

### AI opportunities
- Explain what is missing
- Prioritize cases needing attention
- Recommend the next step

### Responsible user
Administrator or student

### Success criteria
- The workflow is easy to track and no critical step is overlooked

---

## 5. Scheduling

### Purpose
Coordinate the next appointment or operational touchpoint with minimal friction.

### Decision points
- What is the next required event?
- Is the patient or workflow ready?
- Who needs to be involved?

### Bottlenecks
- Scheduling conflicts
- Missing context
- Unclear next step ownership

### Automation opportunities
- Suggest the next logical scheduling action
- Surface readiness for next steps
- Keep users informed of upcoming commitments

### AI opportunities
- Recommend next scheduling actions based on current workflow state
- Summarize why a follow-up is needed

### Responsible user
Student or administrator

### Success criteria
- The user understands what should happen next and why

---

## 6. Treatment

### Purpose
Support the execution of ongoing treatment work and keep it moving productively.

### Decision points
- Is the current step complete?
- What needs follow-up now?
- Is anything blocking progress?

### Bottlenecks
- Too much manual review to understand the current state
- Inconsistent documentation quality
- Unclear next action after a visit or update

### Automation opportunities
- Structured follow-up prompts
- Auto-generated summaries of recent activity
- Suggested next interventions

### AI opportunities
- Summarize recent treatment progress
- Suggest likely follow-up or documentation needs
- Highlight risks or incomplete tasks

### Responsible user
Student

### Success criteria
- The user can move from visit to next action with less effort

---

## 7. Follow-Up

### Purpose
Ensure that outstanding follow-up work is visible and prioritized.

### Decision points
- What follows up from the current visit or workflow stage?
- Is follow-up urgent or routine?
- Who is responsible for the next action?

### Bottlenecks
- Follow-up gets lost in the daily load
- The urgency is not clear
- There is no single place for action-oriented follow-up

### Automation opportunities
- Automatic reminder generation
- Suggested follow-up urgency
- Workflow-based follow-up prompts

### AI opportunities
- Determine urgency and likely impact
- Explain why follow-up matters now
- Suggest the best next action

### Responsible user
Student, faculty, or administrator

### Success criteria
- Follow-up items are visible, actionable, and not overlooked

---

## 8. Graduation Tracking

### Purpose
Help users understand progress toward graduation or program milestones.

### Decision points
- How close is the user or student to completion?
- What is missing or at risk?
- What should be prioritized to stay on track?

### Bottlenecks
- Progress information is fragmented or difficult to interpret
- Large milestone information is not translated into practical next steps

### Automation opportunities
- Progress summaries
- Preview of milestone readiness
- Action recommendations for remaining gaps

### AI opportunities
- Summarize progress clearly
- Explain risk or gap areas
- Recommend the next step toward milestone completion

### Responsible user
Student and faculty

### Success criteria
- Users can clearly understand progress and what to do next
