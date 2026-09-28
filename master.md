You are working on Sentinel Memory, a cybersecurity Incident Response Agent built for SOC analysts.

IMPORTANT:
This is PHASE 1 ONLY.

Your responsibility in this phase is the FRONTEND FOUNDATION.
Do not build the complete application yet.
Do not implement the real AI agent, Hindsight integration, incident analysis, recommendation engine, or production backend.

PROJECT DIRECTION:
Sentinel Memory follows this core workflow:

Detect → Analyze → Recall → Recommend → Resolve → Retain → Improve

The product is a Hindsight-powered cybersecurity incident response assistant for SOC analysts.

The frontend must eventually support:

1. Dashboard
2. Incident list
3. Incident investigation
4. Hindsight memory visualization
5. Recommendations
6. Resolution workflow
7. Post-mortem / learning
8. Final demo flow

TECH STACK:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Modern component architecture
- REST API integration through a centralized API client

PHASE 1 GOAL:
Create a clean, scalable frontend foundation that can run independently from the backend.

==================================================
1. INSPECT THE EXISTING REPOSITORY FIRST
==================================================

Before modifying anything:

- Inspect the current repository.
- Determine whether frontend/backend folders already exist.
- Inspect existing package.json, configuration, README, git status, and source files.
- Do NOT blindly overwrite existing working code.
- Preserve anything that is already useful and compatible.
- If the repository is empty, initialize the structure described below.

Do not create unnecessary files or abstractions.

==================================================
2. FRONTEND STRUCTURE
==================================================

Create/maintain:

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── features/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── lib/
│   ├── assets/
│   ├── config/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tests/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── README.md

Keep the architecture simple.

Do not create dozens of placeholder files just to fill directories.

==================================================
3. FRONTEND SETUP
==================================================

Set up:

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- ESLint if appropriate
- basic formatting configuration if appropriate

The frontend must run with:

cd frontend
npm install
npm run dev

Do not introduce unnecessary dependencies.

==================================================
4. ROUTING
==================================================

Create these routes:

/dashboard
/incidents
/incidents/:id
/memory
/learning

Create a basic application layout with:

- Sidebar/navigation
- Main content area
- Application branding: Sentinel Memory
- Responsive structure

The pages can initially contain minimal structured placeholder content.

Do NOT build the polished final UI yet.

==================================================
5. API ARCHITECTURE
==================================================

Create a centralized API client.

Use:

VITE_API_URL

Example:

VITE_API_URL=http://localhost:8000

Create an abstraction so components do NOT directly call fetch() everywhere.

For example, conceptually:

services/
  api.ts

You may split it further only if genuinely useful.

The frontend should eventually communicate with:

GET /health
POST /api/incidents
GET /api/incidents
GET /api/incidents/{incident_id}
POST /api/incidents/{incident_id}/analyze
GET /api/incidents/{incident_id}/memory
POST /api/incidents/{incident_id}/recommend
POST /api/incidents/{incident_id}/resolve
POST /api/incidents/{incident_id}/postmortem
POST /api/incidents/{incident_id}/learn

For Phase 1, do NOT assume these endpoints are already implemented.

==================================================
6. MOCK API MODE
==================================================

The frontend must be independently runnable even if the backend does not exist.

Implement a simple mock mode.

Use an environment variable such as:

VITE_USE_MOCK_API=true

When mock mode is enabled:

- API calls should return realistic typed mock data.
- Pages should be able to render without the backend.
- Keep mock data centralized.
- Clearly separate mock behavior from the real API client.

Do NOT create fake Hindsight behavior that pretends to be real Hindsight.

Mock data is only for frontend development.

==================================================
7. TYPES
==================================================

Create shared frontend TypeScript types for the eventual API contract.

At minimum define conceptual types for:

- Incident
- IncidentSeverity
- IncidentStatus
- IncidentAnalysis
- MemoryMatch
- Recommendation
- ResponseAction
- Resolution
- Postmortem
- LearningEvent

Keep the types aligned with the Sentinel Memory workflow.

Do not over-engineer the data model yet.

==================================================
8. INITIAL PAGES
==================================================

Create basic versions of:

Dashboard:
- Active incidents
- Recent incidents
- Severity summary
- Memory/learning summary

Incidents:
- Incident list
- Basic severity/status
- Clickable incident

Incident Investigation:
- Incident information
- Placeholder sections for:
  - Analysis
  - Hindsight memory
  - Recommendation
  - Resolution

Memory:
- Placeholder for similar incidents
- Past responses
- Outcomes
- Lessons learned

Learning:
- Placeholder learning timeline
- Retained incident experiences

Again:

These are FOUNDATION screens.

Do NOT spend time making them visually perfect.

==================================================
9. DESIGN DIRECTION
==================================================

The final product will be a professional SOC/security operations interface.

For Phase 1:

- Clean
- Dark/security-oriented but readable
- Good spacing
- Clear hierarchy
- Responsive
- Avoid excessive gradients
- Avoid unnecessary animations
- Avoid "AI slop" visual design
- Avoid excessive glassmorphism
- Avoid giant hero sections

The UI should feel like a serious security operations product.

Do not spend significant time on final visual polish yet.

==================================================
10. FRONTEND-BACKEND CONTRACT
==================================================

Create/update:

docs/API.md

Document the frontend-facing API contract.

For each endpoint document:

- Method
- Path
- Purpose
- Request body if applicable
- Expected response shape
- Error expectations

Do not invent complex backend behavior.

The purpose is to give the backend team a stable contract to implement against.

==================================================
11. ENVIRONMENT
==================================================

Create:

frontend/.env.example

with appropriate variables, including:

VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_API=true

Do NOT commit real secrets.

==================================================
12. ERROR / LOADING FOUNDATION
==================================================

Create basic reusable patterns for:

- Loading
- Error
- Empty state

Do not fully polish them.

The goal is to avoid components becoming tightly coupled to API implementation.

==================================================
13. CODE QUALITY
==================================================

Follow these rules:

- TypeScript strictness where practical.
- Avoid `any` unless absolutely necessary.
- Keep components reasonably small.
- Keep API logic outside UI components.
- Keep mock data outside UI components.
- Avoid duplicated API logic.
- Avoid premature abstraction.
- Use clear naming.
- Keep imports organized.
- Do not create unnecessary state management libraries.
- Do not introduce Redux/Zustand/etc. unless there is an actual Phase 1 requirement.

==================================================
14. IMPORTANT SCOPE RESTRICTIONS
==================================================

DO NOT implement:

- Authentication
- User roles
- Production authorization
- Real Hindsight SDK
- AI agent
- LLM calls
- Incident analysis logic
- Real recommendation engine
- Autonomous remediation
- SIEM integration
- EDR integration
- Threat intelligence integration
- Kubernetes
- Microservices
- WebSockets
- Complex state management
- Production deployment

Those belong to later phases or the backend workstream.

==================================================
15. INDEPENDENT RUNNABILITY
==================================================

The frontend must work independently.

After implementation, verify:

cd frontend
npm install
npm run dev

The application should open successfully.

Verify all routes:

/dashboard
/incidents
/incidents/test-incident
/memory
/learning

The frontend must work with:

VITE_USE_MOCK_API=true

without requiring the backend.

==================================================
16. TESTING / VERIFICATION
==================================================

Before finishing:

- Run the frontend build.
- Run TypeScript checks if configured.
- Run lint if configured.
- Fix errors.
- Verify routing.
- Verify mock mode.
- Verify there are no broken imports.
- Verify environment variables are handled safely.

Do not stop at "files created".

Actually verify that the frontend builds.

==================================================
17. DOCUMENTATION
==================================================

Update:

frontend/README.md

Include:

- What the frontend is
- Tech stack
- Installation
- Environment variables
- Running locally
- Mock mode
- Project structure

Update root README only if necessary.

==================================================
18. GIT SAFETY
==================================================

Do not modify unrelated backend code.

Do not delete existing project functionality without a strong reason.

Do not commit secrets.

At the end, report:

1. What you inspected
2. What you implemented
3. Files created/modified
4. Routes created
5. API contract created
6. Mock mode behavior
7. Commands used for verification
8. Build/typecheck/lint results
9. Any remaining issues

IMPORTANT FINAL RULE:

This is PHASE 1.

Finish the FRONTEND FOUNDATION completely and stop.

Do not automatically start Phase 2.