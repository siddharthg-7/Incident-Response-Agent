# Sentinel Memory - Final Live Demo Script (2–3 Minutes)

This document provides the definitive, time-calibrated presentation walkthrough for **Sentinel Memory** (Hindsight-powered Incident Response Agent for SOC Analysts).

---

## Pre-Demo Checklist

Run through this checklist 5 minutes prior to presentation:

- [ ] **Backend Running**: `http://127.0.0.1:8000` responding (`GET /health` returns `healthy`)
- [ ] **Frontend Running**: `http://localhost:5173` loaded in browser
- [ ] **Database Available**: SQLite tables initialized (`sentinel_memory.db`)
- [ ] **Hindsight Available**: Memory bank `sentinel-incident-memory` initialized
- [ ] **Demo Data Seeded**: Clean state verified (`python scripts/seed_demo.py`)
- [ ] **INC-2026-001 Exists**: SSH brute force on `bastion-01`
- [ ] **INC-2026-002 Exists**: SSH brute force on `app-prod-04`
- [ ] **Incident 1 Experience Retained**: Post-mortem committed into memory
- [ ] **Incident 2 Recall Verified**: Hindsight returns INC-2026-001 with 84%+ similarity
- [ ] **Recommendation Provenance Verified**: Actions include `CRITICAL AUDIT` & `PREVENTION RUNBOOK`
- [ ] **Browser Console Clean**: 0 unhandled rejections or runtime errors
- [ ] **Screen Recording / Display**: Display scaling checked (1080p / 1440p)

---

## 2–3 Minute Presentation Script

### `0:00–0:20` | PROBLEM: The SOC Amnesia Crisis
- **Action**: Open Dashboard (`http://localhost:5173/dashboard`). Point to the active threat queue.
- **Narrative**:
  > *"Every day, SOC analysts face a frustrating reality: amnesia. An alert comes in, the team scrambles to isolate the attacker, and days later a post-mortem is filed away in a wiki. Months later, a similar attack hits a different server, and the next analyst starts from scratch—repeating the same mistakes. Stateless AI chatbots and generic RAG can't solve this because they only know static textbooks. Sentinel Memory solves this by equipping an Incident Response Agent with Hindsight: experiential, long-term organizational memory."*

---

### `0:20–0:50` | INCIDENT 1: Investigation & Root Cause
- **Action**: Click into **INC-2026-001** (`/incidents/INC-2026-001`).
- **Narrative**:
  > *"Here is Incident 1: 14,200 failed SSH logins attacking our perimeter bastion `bastion-01`. Our AI threat analysis detects the credential attack pattern. But notice what our analyst discovers upon deeper investigation: the attacker broke in because a routine OS upgrade accidentally re-enabled password authentication."*

---

### `0:50–1:10` | RESPONSE + LEARNING: Resolution & Memory Commit
- **Action**: Scroll to **Record Resolution** & **Post-Mortem**.
- **Narrative**:
  > *"The SOC analyst takes action: drops the attacker IP, disables password authentication in sshd_config, and confirms zero unauthorized sessions. In the post-mortem, the analyst documents the lesson: enforce pubkey-only SSH across all DMZ bastions and deploy aggressive fail2ban.*
  >
  > *With Sentinel Memory, this isn't lost. We click **Post-Mortem & Retain**, and Hindsight commits the full case context, root cause, and verified outcome into our long-term memory bank."*

---

### `1:10–1:30` | INCIDENT 2: Subsequent Attack on App-Prod-04
- **Action**: Navigate to **INC-2026-002** (`/incidents/INC-2026-002`).
- **Narrative**:
  > *"Weeks later, a completely different attacker from a different IP targets a production application server: `app-prod-04`. We click **Analyze Threat Telemetry**."*

---

### `1:30–1:55` | HINDSIGHT RECALL: Experiential Match
- **Action**: Click **Recall & Recommend**. Highlight the **Relevant Past Incidents** card and the **Hindsight Cognitive Engine Explanation**.
- **Narrative**:
  > *"Notice what just happened. The agent did not just grep documentation. Hindsight performed a semantic vector search across our retained incident memories and matched **INC-2026-001 with an 84.6% confidence score**.*
  >
  > *Right on screen, the analyst sees the exact historical precedent: what happened before, the identified root cause, and the proven outcome: threat contained with zero breach."*

---

### `1:55–2:20` | MEMORY-INFORMED RECOMMENDATION: Provenance & Directives
- **Action**: Highlight the **Memory Influence Provenance Banner** and the purple **Hindsight Precedent** directives.
- **Narrative**:
  > *"Because Sentinel Memory remembers, the synthesized recommendation is radically transformed:*
  > 
  > *1. A generic agent would only say 'block the IP'.*
  > *2. Sentinel Memory outputs a **CRITICAL AUDIT** directive: 'Check service configuration on app-prod-04 immediately. In prior incident INC-2026-001, root cause was password authentication drift.'*
  > *3. It injects a **PREVENTION RUNBOOK**: 'Enforce pubkey-only SSH and velocity geo-blocking.'*
  >
  > *The analyst has full human-in-the-loop control to click **Approve** and **Mark Executed** directly from the directive console."*

---

### `2:20–2:40` | LEARNING LOOP: Summary & Closing
- **Action**: Click into the **Learning & Evolution** view (`/learning`).
- **Narrative**:
  > *"In our Learning Timeline, you can see how organizational MTTR drops as memories accumulate. Sentinel Memory doesn't just remember incidents. It remembers what happened, what worked, and uses that experience on the next incident. Thank you."*

---

## Deterministic Reset Command
To restore this exact clean state at any time:
```bash
python scripts/seed_demo.py
```
