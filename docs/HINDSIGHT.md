# Hindsight Integration & Memory Architecture

## 1. Why Hindsight?

Standard Retrieval-Augmented Generation (RAG) is stateless: it retrieves text chunks from static documentation based on cosine similarity of search queries. However, cybersecurity incident response is fundamentally an **experiential discipline**:

- Did blocking that CIDR range inadvertently disrupt customer traffic?
- Was this alert a recurring false positive from our internal scanner?
- What was the actual root cause uncovered during the post-mortem the last time this attack pattern occurred?

**Hindsight** (`vectorize-io/hindsight`) provides a biomimetic memory engine for AI agents. Rather than treating memory as a flat text cache, Hindsight structures memories into conceptual networks:

1. **World Facts**: Static organizational knowledge, infrastructure inventories, network architecture.
2. **Experiences**: Outcome-oriented records of past incidents, investigations, containment actions, and resolutions.
3. **Observations**: Telemetry patterns noted across alerts.
4. **Opinions / Mental Models**: Consolidated operational beliefs formed over time.

In Sentinel Memory, Hindsight functions as the **institutional memory bank** (`sentinel-incident-memory`), enabling the response agent to recall what happened in previous investigations and recommend actions proven to work.

---

## 2. What Does Sentinel Memory Remember?

Sentinel Memory does **not** store passive, unhelpful statements like *"Incident INC-101 occurred on server X."*

Instead, Sentinel Memory retains **Outcome-Oriented Experience Capsules**:

```json
{
  "source_incident_id": "INC-2026-001",
  "incident_type": "ssh_brute_force",
  "title": "High Volume SSH Authentication Failure on Bastion-01",
  "context": "14,200 failed SSH login attempts from 198.51.100.45 targeting root on bastion-prod-01 (10.0.1.15)",
  "investigation": "Auth logs showed dictionary attack against default port 22. Classified as MITRE ATT&CK T1110.001.",
  "root_cause": "Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication.",
  "actions_taken": [
    "Perimeter firewall DROP rule applied for 198.51.100.45",
    "Disabled PasswordAuthentication in /etc/ssh/sshd_config on bastion-01",
    "Restarted sshd service and verified key-only authentication"
  ],
  "outcome": "Threat contained. Zero persistent access or unauthorized sessions established.",
  "lesson_learned": "Enforce automated Ansible compliance check on all perimeter servers every 15 minutes to guarantee PasswordAuthentication no is permanently set. Deploy fail2ban as an immediate circuit breaker."
}
```

### Capsule Schema Elements
- **Incident Context**: Attack type, target asset, attacker IP, indicators of compromise (IOCs), and log telemetry.
- **Investigation Finding**: Tactics identified (MITRE ATT&CK), initial severity assessment, and attack vector.
- **Root Cause**: The true underlying vulnerability or human error discovered during post-mortem triage.
- **Actions Taken**: The exact containment, mitigation, and recovery steps executed by the analyst.
- **Outcome**: The verified operational result (e.g., threat contained within 12 minutes, zero breach).
- **Lessons Learned**: Permanent preventive hardening measures to stop future recurrence.

---

## 3. The Memory Lifecycle: Retain vs Recall vs Reflect

```
[ New Incident Ingestion ]
            │
            ▼
   [ Threat Analysis ]
            │
            ▼
    [ HINDSIGHT RECALL ] ◄─── Queries Memory Bank ('sentinel-incident-memory')
            │
            ▼
   [ Response Planning ] ─── Injects Past Root Cause & Lesson into Recommendations
            │
            ▼
  [ Analyst Resolution ]
            │
            ▼
  [ Post-Mortem Triage ]
            │
            ▼
    [ HINDSIGHT RETAIN ] ───► Commits New Experience Capsule into Persistent Memory
```

### When is Memory Retained?
- **Lifecycle Trigger**: Memory retention occurs when an incident investigation concludes and the SOC analyst documents both the resolution actions and the post-mortem root cause.
- **Backend Endpoint**: `POST /api/incidents/{incident_id}/learn` (invoked automatically via the UI "Post-Mortem & Retain" action or directly via API).
- **Operation**: The `LearningService` serializes the incident's context, root cause, resolution actions, outcome, and post-mortem lessons into an experience capsule and commits it into Hindsight memory bank `sentinel-incident-memory`.

### When is Memory Recalled?
- **Lifecycle Trigger**: Memory recall is triggered whenever an incident is analyzed and the analyst requests response recommendations.
- **Backend Endpoint**: `POST /api/incidents/{incident_id}/recommend` (and `GET /api/incidents/{incident_id}/memory`).
- **Operation**: The `ResponsePlanner` constructs a contextual recall query combining the incident title, attack description, target asset, and observed indicators. It queries the memory bank using Hindsight's multi-strategy retrieval, returning ranked historical matches with similarity scores.

### How Does Recalled Memory Affect Recommendations?
When the `ResponsePlanner` synthesizes recommendations for a new incident:
1. **Memory Filtering**: Recalled experiences with similarity exceeding the threshold (e.g., >75%) are attached to the recommendation.
2. **Critical Audit Injection**: If a past incident revealed an underlying root cause (such as configuration drift), the planner injects an urgent directive:
   ```
   CRITICAL AUDIT: Check service configuration on [current_target] immediately.
   In prior incident [source_id], root cause was: [past_root_cause]
   ```
3. **Prevention Runbook Injection**: The planner injects the preventive lesson learned from the past post-mortem:
   ```
   PREVENTION RUNBOOK: Apply lesson learned from [source_id]: [lesson_learned]
   ```
4. **Transparency & Provenance**: The UI displays the exact matched incident, similarity score, historical root cause, and verified outcome so the analyst understands *why* the agent is suggesting each action.

---

## 4. Why Hindsight is Different from Simple Search

| Dimension | Standard Keyword / Vector Search | Hindsight Experiential Memory |
| :--- | :--- | :--- |
| **Data Stored** | Raw log strings, unstructured wiki pages | Structured, outcome-oriented **Experience Capsules** |
| **Causal Linkage** | None (finds text matching keywords) | Links **Context → Action → Outcome → Root Cause → Prevention** |
| **Retrieval Strategy** | Cosine similarity against single vector | **TEMPR Parallel Strategy**: Temporal, Entity, Keyword (BM25), and Parametric/Semantic |
| **Recommendation Value** | Suggests generic textbook steps (*"block IP"*) | Suggests **proven actions** that succeeded in the organization before |
| **Adaptability** | Static until someone rewrites documentation | **Continuously evolves** with every resolved incident and post-mortem |

---

## 5. Concrete Demonstration: INC-2026-001 → INC-2026-002

### Step 1: Incident 1 (`INC-2026-001`)
- **Event**: 14,200 failed SSH logins hitting `bastion-01` from external IP `198.51.100.45`.
- **Baseline Suggestion (Without Memory)**: Block IP `198.51.100.45`.
- **Analyst Investigation & Post-Mortem**:
  - The analyst blocks the IP, but discovers the true root cause: a routine package upgrade had reset `/etc/ssh/sshd_config` to defaults, enabling password authentication.
  - Lesson: enforce automated Ansible compliance checks on all servers.
- **Hindsight RETAIN**: The experience capsule is retained into memory bank `sentinel-incident-memory`.

### Step 2: Incident 2 (`INC-2026-002`)
- **Event**: Weeks later, an attacker from a completely different IP (`203.0.113.88`) attempts SSH brute force against `app-prod-04`.
- **Hindsight RECALL**:
  - The agent queries the memory bank and matches `INC-2026-001` with an **84.8% similarity score**.
- **Memory-Informed Recommendation (With Memory)**:
  1. `Apply immediate perimeter firewall DROP rule for traffic from 203.0.113.88`
  2. `CRITICAL AUDIT: Check service configuration on app-prod-04 (10.0.2.44) immediately. In prior incident INC-2026-001, root cause was: Routine OS package upgrade overwrote sshd_config with defaults, inadvertently enabling password authentication.`
  3. `PREVENTION RUNBOOK: Apply lesson learned from INC-2026-001: Enforce automated Ansible compliance check on all perimeter servers every 15 minutes.`
- **Result**: The analyst audits `app-prod-04` immediately, fixing the configuration flaw *before* the attacker breaches the system.

---

## 6. Memory Adapter Architecture

To guarantee 100% reproducible developer onboarding and reliable automated testing without external API dependencies, Sentinel Memory uses an **Adapter Pattern**:

```
                 ┌─────────────────────────────────┐
                 │        HindsightService         │
                 └────────────────┬────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
   ┌───────────────────────────┐     ┌───────────────────────────┐
   │   HindsightClientAdapter   │     │    MockHindsightAdapter   │
   │ (Connects to Hindsight SDK │     │ (In-memory semantic store │
   │  Cloud or Local Docker API)│     │  for offline & test runs) │
   └───────────────────────────┘     └───────────────────────────┘
```

- **`MockHindsightAdapter`** (`backend/app/hindsight/mock_adapter.py`):
  Implements an in-memory cosine and keyword retrieval engine. Powers unit tests, integration tests, and offline evaluation with zero external dependencies.
- **`HindsightClientAdapter`** (`backend/app/hindsight/client_adapter.py`):
  Wraps the official `hindsight-client` SDK, connecting to Hindsight Cloud or self-hosted Docker daemons via `HINDSIGHT_BASE_URL` and `HINDSIGHT_API_KEY`.
- **Runtime Mode Selection**:
  Configured via `HINDSIGHT_MODE=mock` or `HINDSIGHT_MODE=client` in `.env`.
