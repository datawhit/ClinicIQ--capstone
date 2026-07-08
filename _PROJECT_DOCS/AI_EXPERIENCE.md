# AI Experience

This document defines how AI should behave within ClinIQ from a user experience perspective. The goal is to make AI feel helpful, trustworthy, calm, and specific to the decision at hand.

## Core Experience Principles

AI should appear when it reduces effort, clarifies uncertainty, or speeds up a decision.

AI should remain silent when the user is already clear, when no useful assistance exists, or when the system would add noise.

AI should always help the user answer one of four questions:
- What matters most right now?
- Why does it matter?
- What should I do next?
- What should I pay attention to?

---

## Where AI Appears

### 1. Daily command center
AI should provide a concise summary of what matters most today.

### 2. Case and patient views
AI should summarize the case context and recommend the next best action.

### 3. Visit documentation
AI should assist with note parsing and structuring without taking over the workflow.

### 4. Workflow tasks
AI should explain blockers, clarify dependencies, and suggest what should happen next.

### 5. Operations and leadership views
AI should translate operational complexity into clear summaries and priorities.

---

## When AI Should Assist

AI should assist when:
- The user is facing too much information
- The user needs help understanding priority or urgency
- The user is deciding what to do next
- The user needs a clear explanation of risk, progress, or status
- The user is trying to reduce cognitive load

---

## When AI Should Remain Silent

AI should remain silent when:
- The user is already acting clearly and does not need support
- The information is simple and obvious
- The interaction is routine and does not benefit from explanation
- The AI would create noise or unnecessary interruption

The system should respect attention and avoid forcing AI into every interaction.

---

## Types of Recommendations

### Priority recommendations
Help the user know what should be addressed first.

### Workflow recommendations
Suggest the next action in a workflow or task sequence.

### Risk explanations
Explain why something may need attention or intervention.

### Summarization
Condense complex information into a user-ready summary.

### Clarification prompts
Ask short, useful questions when the system needs more context.

---

## How AI Explains Itself

AI explanations should be:
- Plain language
- Short and direct
- Specific to the task at hand
- Grounded in visible data or context

The system should explain why a recommendation exists and what evidence supports it.

Examples of good AI explanations:
- “This patient has been pending follow-up for several days and is now at higher risk.”
- “This task is blocked because the required documentation is incomplete.”
- “This student’s progress appears inconsistent with the expected pace for this stage.”

---

## How Uncertainty Is Communicated

AI should not pretend to know more than it does.

When uncertainty exists, the experience should communicate it clearly:
- Show confidence or uncertainty indicators where appropriate
- Explain what information is missing
- Avoid presenting speculative advice as fact
- Offer the user a simple next step to verify or confirm

The product should feel honest, not overconfident.

---

## Trust-Building Behaviors

### Be specific
Recommendations should be tied to observable context.

### Be transparent
Users should understand why the AI is suggesting something.

### Be restrained
AI should not overwhelm the user with frequent or repetitive guidance.

### Be actionable
The system should suggest next steps, not just observations.

### Be reversible
Users should be able to review, edit, or reject AI-generated suggestions.

### Be consistent
AI guidance should reflect the same values and logic across screens.

---

## AI Interaction Patterns

### Inline assistance
Helpful within a workflow without interrupting the task.

### Contextual summary
A short explanation of what matters in the current view.

### Recommendation card
A clear, concise suggestion shown when the system has a high-confidence action to offer.

### Quiet alert
A subtle signal that something needs attention, without creating panic.

### Explainable insight
A short phrase or note that connects the recommendation to the relevant context.

---

## Experience Guidelines

AI should feel like a calm, intelligent assistant that helps users make sense of complexity.

It should not feel like:
- A chatbot that dominates the experience
- A generic assistant with no connection to the work
- A system that creates unnecessary notifications
- A black box that makes recommendations without explanation

The most trusted AI experiences are the ones that reduce effort while preserving user judgment.
