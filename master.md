You are continuing development of Sentinel Memory.

This is PHASE 2 ONLY.

Your responsibility is the FRONTEND implementation of the core SOC incident-response experience.

IMPORTANT:
- Phase 1 must already be working.
- Preserve the Phase 1 architecture.
- Do not rebuild the project from scratch.
- Do not implement backend intelligence.
- Do not implement the real Hindsight SDK.
- Do not invent Hindsight APIs.
- Do not move backend responsibilities into the frontend.
- Use the existing mock API architecture where the backend is not yet available.

==================================================
PROJECT CONTEXT
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

The key differentiator is Hindsight-powered memory.

The product should help a SOC analyst answer:

"What happened?"

"What evidence supports the analysis?"

"Have we seen something similar before?"

"What did we do last time?"

"What was the outcome?"

"What should we consider doing now?"

The frontend must make this workflow visually obvious.

==================================================
PHASE 2 OBJECTIVE
==================================================

Turn the Phase 1 frontend foundation into a functional SOC analyst interface using realistic mock data.

The frontend should now demonstrate:

1. Incident monitoring
2. Incident investigation
3. AI analysis presentation
4. Hindsight memory matches
5. Context-aware recommendations
6. Response actions
7. Resolution
8. Post-mortem
9. Learning history

The application should already feel like a usable product even though the backend intelligence is still being developed.

==================================================
1. FIRST INSPECT PHASE 1
==================================================

Before making changes:

- Inspect the existing frontend.
- Inspect current routes.
- Inspect existing components.
- Inspect existing services/API client.
- Inspect TypeScript types.
- Inspect mock data.
- Inspect docs/API.md.
- Check git status.

Do not replace working architecture unnecessarily.

Reuse existing components and abstractions where appropriate.

==================================================
2. DASHBOARD
==================================================

Upgrade /dashboard into a SOC-style operational dashboard.

Show:

A. Active Incidents

Display:
- Incident ID
- Incident type
- Severity
- Status
- Source
- Detection time
- Short description

B. Severity Summary

Show counts for:
- Critical
- High
- Medium
- Low

C. Recent Incidents

Show recent resolved and active incidents.

D. Memory / Learning Summary

Show useful product-level metrics such as:

- Past incidents retained
- Similar incidents available
- Recent learning events
- Recommendations influenced by memory

These are mock metrics for now.

Do not fabricate claims such as "Hindsight improved response time by 43%" unless represented explicitly as demo/synthetic data.

E. Quick Actions

Provide useful actions such as:

- View active incidents
- Investigate latest incident
- View memory
- View learning history

==================================================
3. INCIDENTS PAGE
==================================================

Upgrade /incidents.

The incident list should support:

- Search
- Severity filtering
- Status filtering
- Incident type filtering if useful
- Sorting by time/severity if useful

Each incident card/row should clearly show:

- ID
- Type
- Severity
- Status
- Timestamp
- Short description
- Investigation state

Clicking an incident should navigate to:

/incidents/:id

Use realistic cybersecurity incidents.

At minimum include:

1. SSH brute-force attack
2. Suspicious PowerShell execution
3. Unusual outbound network traffic
4. Repeated failed authentication
5. Suspicious privilege escalation

The SSH brute-force scenario should be the primary demo scenario.

==================================================
4. INCIDENT INVESTIGATION PAGE
==================================================

This is the most important screen in Phase 2.

Route:

/incidents/:id

Design it as an analyst investigation workspace.

Structure the page into clear sections.

--------------------------------------------------
A. INCIDENT HEADER
--------------------------------------------------

Show:

- Incident ID
- Incident type
- Severity
- Current status
- Detection timestamp
- Affected asset
- Source
- Analyst status

Include appropriate actions such as:

Analyze Incident
View Memory
Generate Recommendation
Resolve Incident

These can operate against mock services in Phase 2.

--------------------------------------------------
B. INCIDENT DETAILS
--------------------------------------------------

Display:

- What was detected
- Source/log information
- Affected host/user
- IP addresses
- timestamps
- indicators
- relevant evidence

For the SSH brute-force demo, realistic fields may include:

- source IP
- destination host
- attempted usernames
- failed login count
- time window
- authentication method
- geographic information if represented by mock data

Keep everything clearly labeled as incident evidence.

--------------------------------------------------
C. AI ANALYSIS
--------------------------------------------------

Create an analysis section.

Show:

- Classification
- Severity assessment
- Confidence
- Indicators
- Evidence
- Suspected root cause
- Investigation summary

Example conceptual output:

Classification:
Credential Attack / SSH Brute Force

Severity:
High

Root Cause:
Repeated external authentication attempts against an exposed SSH service.

Evidence:
- 437 failed authentication attempts
- Multiple usernames targeted
- Same source IP
- Activity concentrated within 8 minutes

Do not hard-code these exact values everywhere.

Use typed mock data.

Make the UI ready to consume the backend's future structured analysis response.

==================================================
5. HINDSIGHT MEMORY SECTION
==================================================

This is the most important product differentiator.

Create a prominent section showing:

"Relevant Past Incidents"

For each memory match show:

- Past incident ID
- Incident type
- Similarity/relevance indicator
- What happened
- Root cause
- Response taken
- Outcome
- Lesson learned
- Timestamp

Example:

Past Incident:
INC-014

Similar pattern:
SSH brute-force against internet-facing server

Previous response:
Blocked source IP
Rotated exposed credentials
Restricted SSH access
Reviewed authentication logs

Outcome:
No further unauthorized attempts observed.

Lesson:
Restricting SSH exposure prevented repeated attempts from reaching the host.

IMPORTANT:

Do not represent similarity as a mysterious AI score without context.

Use a clear label such as:

"Relevant past experience"

or

"Memory match"

The UI should communicate:

CURRENT INCIDENT
↓
HINDSIGHT RECALL
↓
RELEVANT PAST EXPERIENCE
↓
PREVIOUS RESPONSE + OUTCOME

This is central to the product.

==================================================
6. MEMORY COMPARISON
==================================================

Create a useful visual distinction between:

CURRENT INCIDENT

and

PAST EXPERIENCE

For example:

Current evidence:
- Same attack pattern
- Same exposed service
- Similar source behavior

Past experience:
- Previous SSH brute-force
- Response used
- Outcome
- Lesson learned

Avoid making this look like a generic vector-search/RAG results page.

The emphasis should be on EXPERIENCE and OUTCOME.

==================================================
7. RESPONSE RECOMMENDATION
==================================================

Create a recommendation section.

The recommendation should combine:

Current incident evidence
+
Relevant Hindsight memory
+
Previous outcomes

Display:

Recommended response

Why this response?

Memory influence

Expected objective

Potential risks

Recommended actions

Example structure:

Recommended Response

1. Block the identified source IP.
2. Restrict SSH exposure to approved networks.
3. Review authentication logs for successful access.
4. Rotate credentials if compromise is suspected.

Why?

"Similar incidents were previously resolved using IP blocking and SSH exposure reduction."

Previous outcome:

"No further authentication attempts were observed after the response."

IMPORTANT:

The UI must make it obvious that the recommendation is influenced by remembered experience.

Do NOT claim that Hindsight caused a recommendation unless the backend later provides that relationship.

For Phase 2 mock mode, label this as:

"Memory-informed recommendation"

==================================================
8. RESPONSE ACTIONS
==================================================

Create a response-action section.

Each action should show:

- Action
- Reason
- Status
- Risk level
- Whether analyst approval is required

Example:

Block source IP
Status: Recommended
Risk: Low
Approval: Required

Restrict SSH exposure
Status: Recommended
Risk: Medium
Approval: Required

Review authentication logs
Status: Recommended
Risk: Low
Approval: Not required

IMPORTANT:

Do NOT execute real security commands.

This product is recommendation-first.

The frontend should represent actions, not actually perform infrastructure changes.

==================================================
9. RESOLUTION FLOW
==================================================

Add a resolution section to the investigation page.

Allow the analyst to conceptually:

- Mark action completed
- Record outcome
- Resolve incident
- Add notes

Possible statuses:

Open
Investigating
Action Required
Resolved
Closed

Use mock API calls where appropriate.

Do not implement backend persistence yourself.

==================================================
10. POST-MORTEM
==================================================

Create a basic post-mortem interface.

The analyst should be able to capture:

- What happened?
- Root cause
- What was done?
- What worked?
- What did not work?
- Final outcome
- Lesson learned

This prepares the UI for Phase 3's Hindsight retain flow.

The important conceptual flow is:

Incident
→ Investigation
→ Response
→ Outcome
→ Post-mortem
→ Learning

==================================================
11. MEMORY PAGE
==================================================

Upgrade /memory.

The page should represent the accumulated experience of the system.

Show:

- Past incidents
- Incident patterns
- Responses used
- Outcomes
- Lessons learned

Provide search/filtering where useful.

Create a timeline or structured experience view.

Do NOT make it look like a generic database table.

The product should communicate:

"The system remembers what happened and what worked."

==================================================
12. LEARNING PAGE
==================================================

Upgrade /learning.

Show a chronological learning timeline.

Example:

INC-014
SSH brute-force
↓
Response completed
↓
Outcome recorded
↓
Lesson retained
↓
Later incident matched against this experience

Show the relationship between:

Incident
→ Response
→ Outcome
→ Lesson

This will later become the visible proof that the system improves through experience.

==================================================
13. COMPONENT ARCHITECTURE
==================================================

Create reusable components where appropriate.

Possible components:

components/
├── ui/
├── incidents/
├── memory/
├── recommendations/
├── dashboard/
└── learning/

Do not create components purely for the sake of creating files.

Reuse components when there is genuine repetition.

==================================================
14. TYPES
==================================================

Review and extend the Phase 1 TypeScript types.

Ensure the frontend has structured types for:

Incident
IncidentAnalysis
Evidence
MemoryMatch
PastResponse
Outcome
Recommendation
ResponseAction
Postmortem
LearningEvent

Do not use `any` as a shortcut.

The types should be designed around the API contract rather than around individual UI components.

==================================================
15. MOCK DATA
==================================================

Expand the mock data system.

Create realistic interconnected data.

IMPORTANT:

The data must tell a coherent story.

For example:

INC-001
SSH brute-force
→ analyzed
→ response completed
→ resolved
→ post-mortem
→ lesson retained

Then:

INC-009
similar SSH brute-force
→ memory match to INC-001
→ previous response displayed
→ memory-informed recommendation displayed

This is critical.

Do not create unrelated random mock records.

The demo must clearly show that Incident 2 benefits from Incident 1's remembered experience.

==================================================
16. API INTEGRATION ARCHITECTURE
==================================================

Use the Phase 1 API abstraction.

Do not put fetch calls directly inside pages.

Create appropriate service functions such as:

getIncidents()
getIncident(id)
analyzeIncident(id)
getIncidentMemory(id)
getRecommendation(id)
resolveIncident(id)
createPostmortem(id)
recordLearning(id)

These should initially work with mock mode.

When the backend becomes available, switching:

VITE_USE_MOCK_API=false

should route requests through the real backend.

Do not change backend implementation.

==================================================
17. LOADING / ERROR / EMPTY STATES
==================================================

Every major async section should have sensible states:

Loading
Error
Empty

Examples:

"Loading incident analysis..."

"No relevant past experience found."

"Unable to load memory. Try again."

Do not leave blank white screens.

==================================================
18. UX RULES
==================================================

The UI should feel like a real SOC product.

Priorities:

1. Information clarity
2. Incident severity
3. Evidence visibility
4. Memory relevance
5. Recommendation reasoning
6. Analyst control

Avoid:

- excessive animations
- excessive gradients
- huge decorative elements
- fake futuristic interfaces
- unnecessary glassmorphism
- meaningless charts
- generic AI chatbot layouts

The user should understand the incident within seconds.

==================================================
19. RESPONSIVE DESIGN
==================================================

Ensure the major screens work on:

- Desktop
- Laptop
- Tablet

The primary target is desktop SOC usage.

Do not spend excessive time optimizing mobile in this phase.

==================================================
20. DEMO-FIRST REQUIREMENT
==================================================

The Phase 2 frontend must support this demo story:

STEP 1
Open Dashboard.

STEP 2
Open an SSH brute-force incident.

STEP 3
Show incident evidence.

STEP 4
Show AI analysis.

STEP 5
Show relevant past incident.

STEP 6
Show previous response and outcome.

STEP 7
Show memory-informed recommendation.

STEP 8
Show response actions.

STEP 9
Resolve the incident.

STEP 10
Create/view the post-mortem.

STEP 11
Show that the experience becomes part of the learning timeline.

The UI should make this flow possible without jumping through unrelated screens.

==================================================
21. DO NOT DO THESE THINGS
==================================================

Do NOT implement:

- Real Hindsight integration
- Backend AI
- LLM calls
- Real security infrastructure actions
- Authentication
- SIEM integrations
- EDR integrations
- Threat intelligence APIs
- Real IP blocking
- Shell command execution
- Autonomous remediation
- Multi-agent architecture
- WebSockets
- Production deployment

Those are outside this phase.

==================================================
22. VERIFICATION
==================================================

After implementation:

Run:

npm run build

Run TypeScript checks if configured.

Run lint if configured.

Run tests if available.

Start the frontend.

Manually verify:

/dashboard
/incidents
/incidents/<demo-id>
/memory
/learning

Test the complete mock demo flow.

Verify:

- no broken routes
- no console errors
- no broken imports
- no TypeScript errors
- mock API works
- incident data is coherent
- memory matches are visible
- recommendation is visible
- resolution/post-mortem flow works
- learning timeline updates in mock mode

==================================================
23. FINAL REPORT
==================================================

When finished, report:

1. What you changed
2. Dashboard implementation
3. Incident investigation implementation
4. Hindsight memory UI
5. Recommendation UI
6. Resolution/post-mortem UI
7. Learning UI
8. Mock data scenarios
9. API service changes
10. Verification commands/results
11. Remaining limitations

IMPORTANT:

This is PHASE 2 ONLY.

Do not start Phase 3 automatically.

Phase 3 will be the real frontend-backend integration and the complete Hindsight learning loop.

Stop after Phase 2 is verified.