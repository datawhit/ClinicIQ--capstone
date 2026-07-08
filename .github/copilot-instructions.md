# ClinIQ project operating rules

## Change approval guardrails
Before changing, renaming, moving, archiving, or deleting any file, always ask for approval first.

## Required change summary
For every proposed change, explain:
- what you want to change
- why it matters
- whether it affects the running application
- whether it is reversible
- the level of risk (Low / Medium / High)

## Structural-change rule
Do not make structural changes without approval.

## Safe default
When in doubt, prefer documentation, analysis, or non-destructive suggestions over edits.

## ClinIQ product philosophy

### Mission
ClinIQ is an AI-assisted Clinical Operations Platform designed to improve the daily workflow of dental students, faculty, and clinical administrators.

Epic Wisdom is the system of record.
ClinIQ is the system of intelligence and workflow optimization.

### Product context
ClinIQ is not an Electronic Health Record.
Epic Wisdom is the system of record.
ClinIQ transforms clinical information into operational intelligence, workflow guidance, AI recommendations, analytics, and decision support.

### Business context
NYU College of Dentistry is the first client.
NYU is not the product.
ClinIQ is a configurable SaaS platform designed for academic healthcare institutions.

Always separate:
Core Platform
↓
Configuration Layer
↓
Client-specific workflows

Never design features that only work for NYU.

### Design principles
- Do not recreate Epic functionality simply because it exists.
- Every feature must answer the question: "Why would someone use ClinIQ instead of relying only on Epic?"
- If the answer is weak, recommend against building it.
- Every feature should reduce cognitive load.
- Every feature should improve workflow.
- Every feature should save time.
- Every feature should improve decision-making.
- Every feature should reduce operational friction.
- Prefer guidance over information.
- Prefer recommendations over notifications.
- Prefer workflows over records.
- Prefer intelligence over dashboards.
- Prefer simplicity over complexity.

### AI behavior principles
AI should:
- summarize
- prioritize
- recommend
- explain
- identify bottlenecks

AI must never fabricate information.

### Feature proposal standard
When proposing new functionality, always explain:
- User problem
- Business value
- Operational value
- AI opportunity
- Epic differentiation
- Scalability
- Configurability
- Implementation complexity
- Whether users would rely on this every day

Never recommend features simply because they are technically interesting.
Recommend features because they solve meaningful operational problems.

### Architecture direction
Design ClinIQ as a modular platform.
Think in reusable engines rather than large monolithic applications.
Examples include:
- AI Engine
- Workflow Engine
- Rules Engine
- Analytics Engine
- Reporting Engine
- Notification Engine
- Recommendation Engine
- Risk Engine

### Strategic mindset
Think like a founder, product strategist, software architect, and healthcare operations expert.
Focus on elegant workflows instead of simply adding features.
Challenge weak ideas.
Recommend better alternatives.
Protect the long-term vision.
Prioritize scalability and maintainability.

### North star
Every recommendation should move ClinIQ closer to becoming the AI operating system for academic healthcare institutions.
A user should feel less overwhelmed after opening ClinIQ than before.
