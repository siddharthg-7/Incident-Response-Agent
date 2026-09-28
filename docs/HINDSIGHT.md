# Hindsight Integration & Memory Architecture

## 1. Why Hindsight?

Standard Retrieval-Augmented Generation (RAG) is stateless: it pulls static chunks of text based on vector cosine similarity. However, effective cybersecurity incident response requires **learning from past actions and outcomes**:

- Did blocking that CIDR block cause an outage?
- Was that alert a known benign false positive from the vulnerability scanner?
- What was the actual root cause discovered during the last post-mortem for this symptom?

**Hindsight** (`vectorize-io/hindsight`) provides a biomimetic memory system for AI agents, categorizing knowledge into distinct networks:
1. **World Facts**: Static organizational knowledge, infrastructure inventories, network architecture.
2. **Experiences**: Detailed records of past incidents, investigations, containment actions, and resolutions.
3. **Observations**: Ephemeral or ongoing telemetry patterns noted across alerts.
4. **Opinions / Mental Models**: Consolidated beliefs formed over time (e.g., "Bastion-01 is prone to brute force attacks on weekends").

---

## 2. Outcome-Oriented Memory Design

We do **not** store passive, unhelpful statements like *"Incident INC-101 occurred on server X."*

Instead, Sentinel Memory retains **Outcome-Oriented Experience Capsules**:

```json
{
  "incident_id": "INC-2026-001",
  "incident_type": "ssh_brute_force",
  "severity": "HIGH",
  "context": "14,200 failed SSH login attempts from 198.51.100.45 targeting root on bastion-prod-01",
  "investigation": "Auth logs showed dictionary attack against default port 22",
  "root_cause": "Password authentication was inadvertently re-enabled after OS update",
  "response_actions": [
    "Firewall drop rule applied to 198.51.100.45",
    "Disabled PasswordAuthentication in sshd_config",
    "Restarted sshd service and verified key-only login"
  ],
  "outcome": "Successful containment within 12 minutes. Zero unauthorized sessions established.",
  "lessons_learned": "Enforce Ansible compliance check for sshd_config on all edge hosts. Implement fail2ban."
}
```

---

## 3. Retain vs Recall vs Reflect Lifecycle

### A. RETAIN (Post-Mortem & Resolution)
- **When it triggers**: When an incident moves to `RESOLVED` or `POSTMORTEM_COMPLETE`.
- **What it does**: Ingests the incident experience capsule into the agent's Hindsight memory bank (`sentinel-incident-memory`). Hindsight indexes entities, relationships, temporal signals, and semantic content.

### B. RECALL (During Investigation)
- **When it triggers**: When an incident moves into `ANALYZING` or when the analyst requests response recommendations.
- **What it does**: Queries the memory bank using Hindsight's parallel retrieval strategy (TEMPR: Temporal, Entity, Matching/BM25, Parametric/Semantic) to extract relevant previous incident experiences.

### C. REFLECT (Agent Recommendation Synthesis)
- **When it triggers**: During Response Planning.
- **What it does**: Synthesizes recalled experiences with current incident telemetry to produce tailored recommendations, alerting the analyst to past lessons and avoiding repeated mistakes.

---

## 4. The Adapter Pattern

To enable rapid local development and testing without requiring an active external Hindsight service or API credentials, Sentinel Memory uses an **Adapter Pattern**:

```
                 ┌─────────────────────────────┐
                 │       HindsightService       │
                 └──────────────┬──────────────┘
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│     HindsightClientAdapter    │  │      MockHindsightAdapter     │
│  (Connects to Hindsight SDK   │  │ (In-memory semantic keyword  │
│   Cloud / Local Docker API)  │  │  store for offline & testing) │
└──────────────────────────────┘  └──────────────────────────────┘
```

Switching modes is controlled seamlessly via `.env`:
- `HINDSIGHT_MODE=mock`: Zero external dependencies, deterministic recall scoring, instant tests.
- `HINDSIGHT_MODE=client`: Connects to `HINDSIGHT_BASE_URL` using `hindsight-client`.
