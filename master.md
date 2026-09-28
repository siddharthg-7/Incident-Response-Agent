You are the lead software architect and repository setup engineer for our project.

PROJECT NAME:
Sentinel Memory

PROJECT:
A Hindsight-powered Cybersecurity Incident Response Agent.

HACKATHON THEME:
AI Agents That Learn Using Hindsight

DOMAIN:
Engineering & DevOps

OFFICIAL PROBLEM:
Incident Response Agent

IMPORTANT:
This is NOT a generic cybersecurity chatbot and NOT a generic RAG application.

The central product concept is:

    Detect → Analyze → Recall → Recommend → Resolve → Retain → Improve

The agent must use Hindsight as a core memory system.

The agent should:
- remember previous security incidents
- remember root causes
- remember investigation findings
- remember response actions
- remember runbooks/actions that were used
- remember outcomes
- remember post-mortem lessons
- recall relevant previous experiences when a similar incident occurs
- use recalled experience together with current incident evidence
- generate a context-aware response recommendation
- retain the outcome of the new incident
- improve its future recommendations

The primary persona is:

SOC Analyst / Security Operations Analyst

The MVP workflow is:

Security Alert
    ↓
Incident Analysis
    ↓
Hindsight Recall
    ↓
Similar Past Incidents
    ↓
Response Recommendation
    ↓
SOC Analyst Review
    ↓
Incident Resolution
    ↓
Post-Mortem
    ↓
Hindsight Retain
    ↓
Future Improvement


==================================================
1. YOUR ROLE
==================================================

You are performing the INITIAL REPOSITORY SETUP ONLY.

Do NOT attempt to build the entire product now.

Your job is to establish a production-quality foundation so that four developers can clone the repository and work independently in parallel without architectural conflicts.

The repository must be:

- clean
- understandable
- modular
- cloneable
- environment-safe
- documented
- Git-friendly
- easy for AI coding agents to understand
- ready for parallel development
- ready for Hindsight integration
- ready for frontend/backend/AI/data workstreams

Do not over-engineer.

Do not build unnecessary microservices.

Do not add Kubernetes.

Do not add complex authentication unless required for the foundation.

Do not add autonomous production remediation.

Do not build a complete SIEM.

Do not build malware analysis.

Do not build vulnerability scanning.

Do not build unrelated cybersecurity features.

The MVP must remain focused on incident response and memory.


==================================================
2. FIRST: INSPECT THE CURRENT REPOSITORY
==================================================

Before modifying anything:

1. Inspect every existing file and directory.
2. Determine whether this repository is empty, partially initialized, or already contains code.
3. Inspect:
   - package files
   - requirements/configuration
   - README
   - environment files
   - Git configuration
   - frontend/backend files
   - existing scripts
   - tests
   - Docker configuration if present
4. Do NOT delete existing useful work.
5. Do NOT blindly overwrite existing files.
6. Reuse existing working infrastructure when appropriate.
7. If the repository is already partially implemented, preserve working functionality and adapt the structure rather than rebuilding unnecessarily.

After inspection, explain briefly what you found internally before making changes.


==================================================
3. TARGET ARCHITECTURE
==================================================

Use a modular monorepo structure unless the existing repository already has a better working structure.

Preferred structure:

sentinel-memory/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── public/
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── api/
│       ├── app/
│       │   ├── api/
│       │   ├── agents/
│       │   ├── core/
│       │   ├── db/
│       │   ├── models/
│       │   ├── schemas/
│       │   ├── services/
│       │   ├── hindsight/
│       │   └── main.py
│       ├── tests/
│       ├── requirements.txt
│       └── README.md
│
├── data/
│   ├── seed/
│   ├── scenarios/
│   └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── HINDSIGHT.md
│   ├── DEVELOPMENT.md
│   ├── DEMO.md
│   └── CONTRIBUTING.md
│
├── scripts/
│
├── .env.example
├── .gitignore
├── README.md
├── CONTRIBUTING.md
└── LICENSE


IMPORTANT:

Do not create every file just for the sake of creating files.

Create the directories and foundational files that are genuinely needed.

If the current repository has a different but better structure, preserve it and document the structure.


==================================================
4. TECHNOLOGY DIRECTION
==================================================

Preferred stack:

FRONTEND:
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui where useful

BACKEND:
- Python
- FastAPI

AI:
- LLM provider abstraction
- Groq-compatible implementation initially
- Keep the architecture provider-independent

MEMORY:
- Hindsight

DATABASE:
- PostgreSQL preferred
- SQLite may be used for local development if necessary
- Do not make the application tightly coupled to SQLite

REAL-TIME:
- Do NOT add WebSockets unless actually required.
- Keep the initial architecture simple.

DEPLOYMENT:
- Keep the project deployable to common free/low-cost platforms.
- Do not introduce infrastructure complexity unnecessarily.


==================================================
5. CRITICAL ARCHITECTURAL PRINCIPLE
==================================================

HINDSIGHT MUST BE A FIRST-CLASS SERVICE.

Do NOT scatter Hindsight API calls throughout the codebase.

Create a clean abstraction such as:

HindsightService

with conceptual operations such as:

- retain(...)
- recall(...)
- get_similar_incidents(...)
- record_outcome(...)
- health_check(...)

The exact implementation should follow the current official Hindsight SDK/API once verified.

Do NOT invent Hindsight API syntax.

If the official SDK/API documentation is available in the environment, inspect it.

If exact API behavior is not available, create a clearly marked adapter/interface rather than fabricating API calls.

The rest of the application should interact with Hindsight through this abstraction.


==================================================
6. CORE DOMAIN MODEL
==================================================

Establish the initial domain concepts.

At minimum:

Incident

Fields should conceptually support:

- id
- title
- description
- incident_type
- severity
- status
- detected_at
- source
- target
- indicators
- evidence
- analysis
- root_cause
- response_actions
- runbook
- outcome
- recurrence
- lessons_learned
- created_at
- updated_at

Do NOT unnecessarily over-normalize the schema during initial setup.

The important concept is that an incident eventually produces an experience that can be retained in Hindsight.


==================================================
7. INCIDENT LIFECYCLE
==================================================

Define the lifecycle clearly.

Suggested states:

NEW
↓
ANALYZING
↓
ANALYZED
↓
RECOMMENDATION_READY
↓
IN_PROGRESS
↓
RESOLVED
↓
POSTMORTEM_COMPLETE

Allow an appropriate failure state if necessary.

Document the lifecycle.

Do not implement complex workflow machinery yet.


==================================================
8. AGENT ARCHITECTURE
==================================================

Create conceptual boundaries for:

Incident Analyzer

Responsibilities:
- classify incident
- identify severity
- extract indicators
- summarize evidence
- identify possible root cause

Memory Retrieval / Hindsight

Responsibilities:
- recall relevant prior experiences
- return similar incidents
- provide previous response/outcome context

Response Planner

Responsibilities:
- combine current incident evidence
- combine recalled experience
- generate recommended response
- explain why the recommendation was made

Outcome / Learning

Responsibilities:
- capture analyst resolution
- capture outcome
- capture post-mortem
- create memory for future incidents

Do not create multiple autonomous agents unless there is a real architectural reason.

For the MVP, one orchestrated incident-response agent is preferable.


==================================================
9. MEMORY DESIGN
==================================================

Define what gets remembered.

A memory experience should conceptually contain:

CURRENT INCIDENT CONTEXT
+
INVESTIGATION
+
ROOT CAUSE
+
RESPONSE
+
RUNBOOK/ACTIONS
+
OUTCOME
+
POST-MORTEM
+
LESSONS LEARNED

The important distinction is:

We do NOT want:

"Incident happened."

We want:

"Incident happened → this was the cause → these actions were taken → this was the result → this is what we learned."

This outcome-oriented memory is central to Sentinel Memory.


==================================================
10. API FOUNDATION
==================================================

Create a clean initial API contract.

Suggested endpoints:

GET    /health

POST   /api/incidents

GET    /api/incidents

GET    /api/incidents/{incident_id}

POST   /api/incidents/{incident_id}/analyze

POST   /api/incidents/{incident_id}/recommend

GET    /api/incidents/{incident_id}/memory

POST   /api/incidents/{incident_id}/resolve

POST   /api/incidents/{incident_id}/postmortem

POST   /api/incidents/{incident_id}/learn

The implementation can initially contain stubs where functionality belongs to later development phases.

Do NOT fake successful AI/Hindsight behavior.

If an endpoint is not implemented yet, return a clear appropriate response.


==================================================
11. FRONTEND FOUNDATION
==================================================

Create the basic application shell.

The UI should eventually become a professional SOC-style dashboard.

Initial routes/pages:

/
 /dashboard
 /incidents
 /incidents/:id
 /memory
 /learning

For the initial setup:

- create routing
- create layout
- create navigation
- create placeholder pages
- establish design tokens
- establish reusable components
- establish API client abstraction

Do NOT spend time creating a beautiful final UI yet.

The UI's eventual primary screen will be:

Incident Investigation

It must eventually show:

- current incident
- severity
- analysis
- Hindsight memory matches
- previous incidents
- recommendation
- reasoning/evidence
- analyst actions
- resolution
- learning outcome


==================================================
12. ENVIRONMENT VARIABLES
==================================================

Create:

.env.example

Include only variables genuinely required.

Conceptually:

HINDSIGHT_API_URL=
HINDSIGHT_API_KEY=

LLM_API_KEY=
LLM_MODEL=

DATABASE_URL=

API_BASE_URL=

Never commit:

- API keys
- secrets
- tokens
- passwords
- real credentials

Ensure .gitignore covers:

.env
.env.*
!.env.example


==================================================
13. DATA / DEMO FOUNDATION
==================================================

Create a small synthetic incident dataset structure.

Do NOT create hundreds of fake records.

Create a few realistic scenarios for development.

Primary scenario:

SSH Brute Force

Example concept:

- multiple failed SSH attempts
- source IP
- target server
- time window
- authentication logs
- severity
- investigation
- root cause
- response actions
- outcome
- post-mortem

Additional future scenarios may include:

- suspicious authentication
- port scanning
- credential stuffing
- malware alert

But the primary end-to-end demo should remain SSH brute force.

The data should look realistic enough for a professional SOC workflow.

Do not use real people's personal information.


==================================================
14. TESTING FOUNDATION
==================================================

Set up testing infrastructure.

Backend:
- pytest

Frontend:
- appropriate React testing setup if already supported by the chosen stack

At minimum create tests for:

- health endpoint
- incident model/schema validation
- incident lifecycle validation
- API contract
- Hindsight service interface
- basic service behavior

Do not write meaningless tests just to increase coverage.

The tests should establish the foundation for later development.


==================================================
15. CODE QUALITY
==================================================

Configure appropriate formatting/linting.

Python:
- Ruff if appropriate
- Black only if necessary
- type checking if practical

Frontend:
- ESLint
- Prettier

Do not add unnecessary tooling.

Add basic scripts so developers can easily run:

- frontend
- backend
- tests
- lint
- format
- build

Document these commands.


==================================================
16. DOCKER / LOCAL DEVELOPMENT
==================================================

If appropriate, provide a simple local development setup.

Potential services:

- PostgreSQL
- backend
- frontend

Hindsight should NOT be duplicated or mocked as a fake production service.

If Hindsight Cloud is used, document the required environment variables.

If local Hindsight is practical and officially supported, document that option separately.

Keep the initial setup simple enough that a new team member can clone the repository and start development quickly.


==================================================
17. GIT WORKFLOW FOR FOUR DEVELOPERS
==================================================

Prepare the repository for four parallel developers.

Recommended branches:

main

feature/hindsight-agent
feature/backend-api
feature/soc-dashboard
feature/data-evaluation

Document that developers should:

1. clone repository
2. create/update their feature branch
3. make focused commits
4. run tests
5. push branch
6. create PR
7. review
8. merge into main

Do NOT create four actual remote branches unless the current Git environment supports it safely.

Document the branch naming convention instead.

Use clear commit conventions.

Example:

feat:
fix:
refactor:
test:
docs:
chore:


==================================================
18. TEAM OWNERSHIP DOCUMENT
==================================================

Create:

docs/TEAM_OWNERSHIP.md

Define these four workstreams:

MEMBER 1
AI + Hindsight
- Hindsight integration
- LLM
- agent orchestration
- recall/retain
- recommendation logic

MEMBER 2
Backend
- FastAPI
- database
- API
- services
- validation

MEMBER 3
Frontend
- React
- SOC dashboard
- incident investigation UI
- memory visualization
- analyst workflow

MEMBER 4
Data + Evaluation + Integration
- realistic incident scenarios
- testing
- evaluation
- integration
- deployment support
- demo scenario

Everyone should understand that all four are responsible for integration and code quality.


==================================================
19. DOCUMENTATION
==================================================

Create concise but useful documentation.

README.md must contain:

1. Project name
2. One-line description
3. Problem
4. Solution
5. Core workflow
6. Architecture
7. Tech stack
8. Repository structure
9. Local setup
10. Environment variables
11. Development commands
12. Team workflow
13. Hindsight's role
14. Current implementation status
15. Roadmap

Create:

docs/ARCHITECTURE.md

Explain:

Frontend
↓
FastAPI
↓
Agent Orchestrator
↓
LLM + Hindsight
↓
Database

Create:

docs/HINDSIGHT.md

Explain:

- why Hindsight exists
- what we retain
- what we recall
- when recall occurs
- when retain occurs
- how outcomes become future experience
- how we will demonstrate improvement

Do NOT claim functionality that hasn't been implemented yet.

Clearly distinguish:

Implemented
Planned
Future


==================================================
20. ARCHITECTURE DECISION RECORD
==================================================

Create:

docs/DECISIONS.md

Record initial decisions such as:

ADR-001:
Use FastAPI for backend.

ADR-002:
Use React/Vite for frontend.

ADR-003:
Use Hindsight as the persistent agent-memory layer.

ADR-004:
Keep one primary incident-response agent for MVP.

ADR-005:
Treat incident outcomes/post-mortems as memory experiences.

ADR-006:
Keep autonomous remediation out of MVP; recommendations require analyst review.

Keep these concise.


==================================================
21. SECURITY BASELINE
==================================================

Because this is a cybersecurity application:

- never execute arbitrary commands from LLM output
- never expose secrets to the frontend
- never place API keys in client-side code
- validate all external input
- treat LLM output as untrusted data
- do not allow the LLM to directly execute production remediation
- separate recommendation from execution
- sanitize logs where necessary
- do not put sensitive credentials in synthetic datasets

The MVP should be recommendation-first.


==================================================
22. DEMO CONTRACT
==================================================

Create:

docs/DEMO.md

Define the future 2–3 minute core demo.

Scenario:

INCIDENT 1
SSH brute force

Agent analyzes it.

Analyst resolves it.

Post-mortem is created.

Hindsight retains the experience.

Then:

INCIDENT 2
Similar SSH brute force with different indicators.

Agent analyzes it.

Hindsight recalls previous experience.

UI displays:

"Similar incidents found."

The agent shows:

- previous incident
- root cause
- previous response
- outcome
- lesson

Then generates a contextual recommendation.

The purpose is to visibly demonstrate:

WITHOUT MEMORY
vs
WITH MEMORY

Do not implement the entire demo now.

Document it so every developer builds toward the same target.


==================================================
23. DO NOT DO THESE THINGS
==================================================

Do NOT:

- build unnecessary features
- create fake Hindsight functionality
- fabricate API responses
- fabricate benchmark numbers
- claim machine learning accuracy without evaluation
- build autonomous destructive actions
- build a full SIEM
- add unnecessary microservices
- add Kubernetes
- create a massive dataset
- create six different workflows
- focus on animations before functionality
- write hackathon marketing content now
- create the article now
- create LinkedIn content now
- create the final video now

Development comes first.


==================================================
24. DEFINITION OF DONE FOR THIS INITIAL MOVE
==================================================

The repository setup is complete only when:

[ ] Repository structure is established
[ ] Frontend can start
[ ] Backend can start
[ ] Health endpoint works
[ ] Environment configuration exists
[ ] .env is protected
[ ] Basic database configuration exists
[ ] Hindsight abstraction exists
[ ] Domain models/schemas exist
[ ] API contract exists
[ ] Frontend routes exist
[ ] Basic test infrastructure works
[ ] Lint/format scripts work
[ ] README is complete
[ ] Architecture documentation exists
[ ] Hindsight documentation exists
[ ] Team ownership is documented
[ ] Git workflow is documented
[ ] Demo scenario is documented
[ ] No secrets are committed
[ ] No fake functionality is presented as complete


==================================================
25. IMPORTANT EXECUTION RULE
==================================================

Work incrementally.

Before making a large change:

1. inspect
2. reason
3. modify
4. test
5. verify

Do not make huge uncontrolled changes.

After each major setup step, verify that existing functionality still works.

If something already exists and works, preserve it.

If you encounter ambiguity, prefer the smallest architecture that supports the MVP.

If a technology choice conflicts with the existing working repository, explain the conflict and preserve the working system rather than rewriting everything.


==================================================
26. FINAL OUTPUT AFTER SETUP
==================================================

When finished, report:

1. What you inspected
2. What you created
3. What you changed
4. Final repository structure
5. How to run frontend
6. How to run backend
7. How to run tests
8. Environment variables required
9. Hindsight integration status
10. What is implemented
11. What remains for Member 1
12. What remains for Member 2
13. What remains for Member 3
14. What remains for Member 4
15. Any blockers
16. Exact next recommended development step

Do not claim the product is complete.

The goal of this task is:

BUILD THE FOUNDATION.

The next developers should be able to clone the repository and immediately begin their assigned work without redesigning the architecture.