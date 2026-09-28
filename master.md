You are continuing development of Sentinel Memory.

This is PHASE 3 ONLY.

Your responsibility is:

FRONTEND + REAL BACKEND INTEGRATION + END-TO-END PRODUCT FLOW

Phase 1 = Frontend foundation
Phase 2 = Core Intelligence UI with coherent mock data

Phase 3 now replaces the mock workflow with the real backend wherever the backend endpoints are available.

IMPORTANT:
- Do not rebuild the frontend.
- Preserve the Phase 1 and Phase 2 architecture.
- Do not implement backend logic inside the frontend.
- Do not implement Hindsight SDK logic inside the frontend.
- Do not invent backend endpoints.
- Read docs/API.md and inspect the actual backend before integrating.
- If an endpoint differs from the documented contract, adapt through the frontend API service layer rather than scattering changes across components.

==================================================
PROJECT GOAL
==================================================

Sentinel Memory is a cybersecurity incident-response assistant for SOC analysts.

Core workflow:

Detect
→ Analyze
→ Recall
→ Recommend
→ Resolve
→ Retain
→ Improve

The central product experience is:

Incident 1
→ investigation
→ response
→ outcome
→ post-mortem
→ Hindsight retain

Then:

Incident 2
→ investigation
→ Hindsight recall
→ relevant past experience
→ previous response/outcome
→ context-aware recommendation

The frontend must make this entire learning loop visible.

==================================================
1. INSPECT BEFORE MODIFYING
==================================================

First inspect:

- frontend/
- backend/
- docs/API.md
- backend API routes
- backend schemas
- backend services
- Hindsight integration
- current mock services
- current TypeScript types
- current git status

Determine what backend functionality is actually available.

Do not assume an endpoint exists simply because it appears in an old document.

Use the actual implementation as the source of truth where it differs.

==================================================
2. REAL API MODE
==================================================

Phase 2 already created:

VITE_API_URL
VITE_USE_MOCK_API

Keep both.

Development must support:

VITE_USE_MOCK_API=true

and:

VITE_USE_MOCK_API=false

When:

VITE_USE_MOCK_API=false

the frontend must use the real FastAPI backend.

Do not remove mock mode.

Mock mode remains useful for frontend development and fallback demonstrations.

==================================================
3. API SERVICE LAYER
==================================================

Ensure all backend communication happens through centralized services.

Conceptually:

services/
├── api.ts
├── incidentService.ts
├── memoryService.ts
├── recommendationService.ts
└── learningService.ts

Do not create unnecessary files if the existing architecture already handles this cleanly.

The UI must not contain direct fetch/axios calls.

Every request should have:

- typed request data
- typed response data
- error handling
- loading handling

==================================================
4. VERIFY API CONTRACT
==================================================

Work with the backend team implementation.

Expected conceptual endpoints include:

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

BUT:

Do not blindly assume these exact paths or payloads.

Inspect docs/API.md and the actual backend.

Adapt the frontend service layer to the real contract.

==================================================
5. HEALTH CHECK
==================================================

Add a lightweight backend connectivity check.

The UI should be able to distinguish:

Backend connected

from:

Backend unavailable

Do not block the entire application if the backend is temporarily unavailable.

Show a useful status indicator or error state.

Do not expose technical stack traces to the user.

==================================================
6. INCIDENT CREATION
==================================================

Implement the real incident creation flow if the backend supports it.

Create a clean interface for entering/creating a security incident.

At minimum support the project's demo incident structure.

Possible fields:

- Incident type
- Source
- Description
- Detection time
- Affected asset
- Evidence
- Indicators

Keep the form focused.

Do not turn this into a full SIEM event ingestion system.

After successful creation:

→ receive incident ID
→ navigate to incident investigation
→ fetch the created incident

==================================================
7. REAL INCIDENT LIST
==================================================

Replace the Phase 2 mock incident list when real API mode is enabled.

The incident page must load from:

GET /api/incidents

Support:

- loading state
- error state
- empty state
- search/filtering on frontend if backend filtering is unavailable

Do not assume server-side filtering exists.

==================================================
8. INCIDENT INVESTIGATION
==================================================

The investigation page must now retrieve real data.

Flow:

Open incident
↓
GET incident
↓
Display incident evidence
↓
Analyze incident
↓
Display analysis
↓
Recall memory
↓
Display relevant experiences
↓
Generate recommendation
↓
Display recommendation
↓
Resolve
↓
Post-mortem
↓
Learn

Do not automatically fire every expensive operation on page load unless the backend contract explicitly requires it.

Prefer explicit analyst actions for:

Analyze
Recall
Recommend
Resolve
Learn

This keeps the workflow understandable and prevents accidental duplicate operations.

==================================================
9. ANALYSIS INTEGRATION
==================================================

Connect:

POST /api/incidents/{incident_id}/analyze

Display the actual backend analysis.

Support structured fields such as:

- classification
- severity
- confidence
- indicators
- evidence
- root cause
- investigation summary

Do not hard-code analysis results when real API mode is active.

If the backend returns additional structured information, display it only if it is meaningful to the analyst.

Do not dump raw JSON into the UI.

==================================================
10. HINDSIGHT MEMORY INTEGRATION
==================================================

Connect the frontend to the backend memory endpoint.

Conceptual:

GET /api/incidents/{incident_id}/memory

The backend is responsible for Hindsight.

The frontend is responsible only for displaying the returned experiences.

For every memory result, show as much structured information as the backend actually provides:

- past incident
- relevance
- incident context
- previous response
- outcome
- lesson learned

The central UI relationship should remain:

CURRENT INCIDENT
↓
RELEVANT PAST EXPERIENCE
↓
PREVIOUS RESPONSE
↓
OUTCOME
↓
LESSON

IMPORTANT:

Do not call a result "Hindsight memory" if the backend response did not actually come from Hindsight.

Use accurate terminology.

==================================================
11. MEMORY QUALITY STATES
==================================================

Handle:

A. Relevant memories found

B. No relevant memories

C. Memory service unavailable

D. Memory request failed

For no memory:

Show a useful state such as:

"No relevant past experience was found for this incident."

Do not display fake recommendations.

==================================================
12. RECOMMENDATION INTEGRATION
==================================================

Connect the recommendation UI to the real backend.

Conceptual:

POST /api/incidents/{incident_id}/recommend

The UI should display:

- recommended response
- reasoning
- memory influence
- expected objective
- risks
- response actions

Only show fields actually returned by the backend.

If the backend exposes evidence that a recommendation used recalled experience, make that relationship visually prominent.

For example:

Current evidence
+
Recalled experience
↓
Recommendation

Do not invent a "memory influence score".

==================================================
13. RESPONSE ACTIONS
==================================================

Display recommended actions returned by the backend.

Each action may contain:

- action
- reason
- risk
- status
- approval requirement

The frontend must NOT execute infrastructure actions.

This remains:

Recommendation-first
Analyst-controlled

If an action requires analyst approval, clearly communicate it.

==================================================
14. RESOLUTION
==================================================

Connect the real resolve endpoint.

The analyst should be able to:

- record response outcome
- update incident status
- add notes
- mark the incident resolved

After successful resolution:

Refresh the incident.

Do not assume the frontend can mutate backend state locally without confirmation.

The backend response is the source of truth.

==================================================
15. POST-MORTEM
==================================================

Connect the post-mortem flow.

The UI should collect:

- What happened?
- Root cause
- Actions taken
- What worked?
- What did not work?
- Final outcome
- Lesson learned

Submit this through the actual backend contract.

After successful submission:

Show clear confirmation.

Do not pretend the experience was retained if the backend has not confirmed that.

==================================================
16. LEARNING / RETAIN FLOW
==================================================

Connect the learning endpoint if implemented.

Conceptual:

POST /api/incidents/{incident_id}/learn

The frontend should show the state progression:

Post-mortem submitted
↓
Learning recorded
↓
Experience retained

If the backend separates post-mortem and Hindsight retain operations, reflect that accurately.

Do not claim Hindsight retention succeeded merely because the post-mortem request succeeded.

==================================================
17. END-TO-END DEMO FLOW
==================================================

Make the complete frontend flow work with the real backend:

STEP 1
Open dashboard.

STEP 2
Open or create Incident 1.

STEP 3
Analyze Incident 1.

STEP 4
View investigation.

STEP 5
View memory.

If no memory exists yet, continue normally.

STEP 6
Generate recommendation.

STEP 7
Record response.

STEP 8
Resolve Incident 1.

STEP 9
Create post-mortem.

STEP 10
Learn/retain the experience.

STEP 11
Open Incident 2 with a similar pattern.

STEP 12
Analyze Incident 2.

STEP 13
Recall memory.

STEP 14
Show Incident 1 as a relevant past experience if the backend/Hindsight actually returns it.

STEP 15
Generate recommendation.

STEP 16
Clearly show that the recommendation incorporates the recalled experience if supported by the backend response.

This is the core demo.

==================================================
18. STATE MANAGEMENT
==================================================

Do not introduce a large state-management library unless genuinely required.

Use:

- React state
- hooks
- service layer
- URL state where useful

The investigation page may need state such as:

incident
analysis
memory
recommendation
resolution
postmortem
learning

Keep state transitions predictable.

Avoid unnecessary global state.

==================================================
19. DATA REFRESH
==================================================

After mutations such as:

- incident creation
- analysis
- resolve
- post-mortem
- learning

refresh relevant backend data.

Do not rely entirely on optimistic updates.

For important security workflow information:

Backend confirmation should be the source of truth.

==================================================
20. ERROR HANDLING
==================================================

Handle realistic failures:

Backend unavailable
API timeout
Invalid incident
Analysis failure
Hindsight unavailable
No memory
Recommendation failure
Resolution failure
Post-mortem failure
Learning failure

Messages must be understandable to a SOC analyst.

Bad:

"AxiosError 500"

Better:

"Incident analysis could not be completed. Please retry."

Where appropriate provide:

Retry

Do not hide errors silently.

==================================================
21. DUPLICATE ACTION PROTECTION
==================================================

Prevent accidental repeated submissions.

For example:

When analyzing:

Analyze button
→ loading
→ disable button

When submitting post-mortem:

Submit
→ loading
→ disable

When resolving:

Resolve
→ confirmation/loading
→ backend request

Prevent double-click duplicate requests.

==================================================
22. DEMO SCENARIO DATA
==================================================

Make sure the backend and frontend can support the primary SSH brute-force scenario.

The frontend should be able to clearly present:

Incident 1:
SSH brute-force

Evidence:
Repeated authentication attempts against exposed SSH service.

Investigation:
Credential attack / brute-force pattern.

Response:
Appropriate defensive actions.

Outcome:
Incident resolved.

Post-mortem:
Lesson captured.

Then Incident 2:
Similar SSH brute-force pattern.

Memory:
Previous incident retrieved.

Recommendation:
Uses previous experience as context.

IMPORTANT:

Do not fabricate successful Hindsight recall in real API mode.

The backend/Hindsight must actually return the experience.

==================================================
23. MOCK MODE MUST STILL WORK
==================================================

Do not break Phase 2 mock mode.

Verify:

VITE_USE_MOCK_API=true

still produces the coherent demo.

The same UI components should work in both:

Mock mode
and
Real API mode

Avoid duplicating entire pages for mock vs real API.

Only the service/data layer should differ.

==================================================
24. API RESPONSE NORMALIZATION
==================================================

If the backend response structure differs slightly from the frontend view model:

Normalize it inside the service layer.

Example:

Backend response
→ service adapter
→ frontend domain type
→ component

Do not scatter backend-specific field transformations across UI components.

This will make the system easier to maintain.

==================================================
25. SECURITY
==================================================

Do not expose:

- API keys
- Hindsight credentials
- LLM keys
- database credentials

Frontend environment variables must contain only values safe for browser exposure.

Never put backend secrets into:

VITE_*

Do not log sensitive incident information unnecessarily.

==================================================
26. UX POLISH
==================================================

This phase is integration-focused, but make the critical flow polished enough for a live demo.

Prioritize:

- clear loading states
- clear success states
- clear error states
- readable incident evidence
- visible memory matches
- recommendation reasoning
- analyst control
- obvious state progression

Do not spend the entire phase on decorative UI.

Functional clarity > decoration.

==================================================
27. DOCUMENTATION
==================================================

Update:

docs/API.md

only if the actual implementation differs from the documented contract.

Update:

frontend/README.md

with:

- real backend setup
- mock mode
- environment variables
- API URL
- running frontend + backend together

Document any integration assumptions.

==================================================
28. VERIFICATION
==================================================

Run frontend checks:

npm run build

TypeScript checks if configured.

Lint if configured.

Tests if configured.

Then run the actual frontend and backend together.

Verify:

1. Backend health works.
2. Incident list loads.
3. Incident detail loads.
4. Analyze works.
5. Memory loads.
6. Recommendation works.
7. Resolution works.
8. Post-mortem works.
9. Learning works.
10. A second similar incident can retrieve the first incident's experience if Hindsight/backend supports it.

Also verify mock mode still works independently.

==================================================
29. DO NOT FIX BACKEND INSIDE THIS TASK
==================================================

If a backend endpoint is broken:

- identify the issue
- document the exact endpoint/problem
- do not rewrite backend architecture
- do not implement backend business logic inside frontend

If a small contract mismatch is found, coordinate through docs/API.md and adapt the frontend service layer where appropriate.

The backend team owns backend fixes.

==================================================
30. FINAL REPORT
==================================================

At the end report:

1. What was integrated
2. Actual backend endpoints used
3. Frontend service changes
4. Incident flow status
5. Hindsight memory flow status
6. Recommendation flow status
7. Resolution/post-mortem status
8. Learning flow status
9. Mock mode status
10. Build/typecheck/lint/test results
11. Any backend blockers
12. Exact remaining work required before Phase 4

IMPORTANT:

This is PHASE 3 ONLY.

Do not start Phase 4 automatically.

Do not add new architecture unless required to complete this phase.

Stop after the end-to-end integration has been verified.