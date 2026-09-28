# Sentinel Memory - Evaluator & Judge Demo Guide

This document provides the definitive, time-calibrated presentation walkthrough and troubleshooting runbook for **Sentinel Memory** (Hindsight-powered Incident Response Agent for SOC Analysts).

---

## 1. Demo Prerequisites

Before beginning the evaluation or live presentation, ensure the following components are running:

| Component | Target URL / Port | Verification Check |
| :--- | :--- | :--- |
| **Backend API** | `http://127.0.0.1:8000` | `GET /health` returns `{"status": "healthy"}` |
| **Frontend Web App** | `http://localhost:5173` | Browser loads SOC Dashboard with green `FastAPI: Connected` pill |
| **Database** | SQLite (`sentinel_memory.db`) | Tables created; 3 demo scenarios seeded |
| **Hindsight Memory** | Bank `sentinel-incident-memory` | Adapter active (`mock` or `client` mode) |
| **LLM Engine** | Mock or Cloud Provider | Configured via `LLM_PROVIDER` in `.env` |
| **Demo Data** | `INC-2026-001`, `INC-2026-002` | Reset to clean state via `python scripts/seed_demo.py` |

---

## 2. Deterministic Demo Reset / Seed

To restore the demo environment to the pristine Golden Path state at any moment:

```bash
python scripts/seed_demo.py
```

This resets:
- `INC-2026-001`: SSH Brute Force on `bastion-01` (`status: NEW`)
- `INC-2026-002`: SSH Brute Force on `app-prod-04` (`status: NEW`)
- `INC-2026-003`: Distributed Credential Stuffing on Customer Portal API (`status: NEW`)

---

## 3. Golden Path Walkthrough (2–3 Minutes)

### `0:00–0:20` | PROBLEM: The SOC Knowledge Loss Crisis
- **Page**: Dashboard (`http://localhost:5173/dashboard`)
- **Action**: Point to the active alert queue and system connectivity indicator.
- **Expected Result**: Real-time overview showing active incidents and system health.
- **Presenter Narrative**:
  > *"Every day, SOC analysts face a frustrating reality: amnesia. When an alert arrives, the team scrambles to isolate the attacker, and days later a post-mortem is filed away in a wiki. Months later, a similar attack hits a different server, and the next analyst starts from scratch—repeating the same mistakes. Stateless AI chatbots and generic RAG can't solve this because they only know static textbooks. Sentinel Memory solves this by equipping an Incident Response Agent with Hindsight: experiential, long-term organizational memory."*

---

### `0:20–0:50` | INCIDENT 1: Investigation & Root Cause Discovery
- **Page**: Incident Detail (`/incidents/INC-2026-001`)
- **Action**: Click into **INC-2026-001** and review the threat telemetry.
- **Expected Result**: 14,200 failed SSH logins identified on `bastion-01`. Classified as MITRE ATT&CK T1110.001 (Password Guessing).
- **Presenter Narrative**:
  > *"Here is Incident 1: 14,200 failed SSH logins attacking our perimeter bastion `bastion-01`. Our AI threat analysis detects the credential attack pattern. But notice what our analyst discovers upon deeper investigation: the attacker broke in because a routine OS package upgrade accidentally re-enabled password authentication."*

---

### `0:50–1:10` | RESOLUTION + POST-MORTEM: Committing to Hindsight
- **Page**: Incident Detail (`/incidents/INC-2026-001`)
- **Action**: Click **Record Resolution**, enter actions, then click **Post-Mortem & Retain**.
- **Expected Result**: Status updates to `RESOLVED` then `POSTMORTEM_COMPLETE`. Experience capsule is committed to Hindsight memory bank `sentinel-incident-memory`.
- **Presenter Narrative**:
  > *"The SOC analyst takes action: drops the attacker IP, disables password authentication in sshd_config, and confirms zero unauthorized sessions. In the post-mortem, the analyst documents the lesson: enforce automated Ansible compliance checks on all perimeter servers. With Sentinel Memory, this isn't lost. We click Post-Mortem & Retain, and Hindsight commits the full case context, root cause, and verified outcome into our long-term memory bank."*

---

### `1:10–1:30` | INCIDENT 2: Subsequent Attack on App-Prod-04
- **Page**: Incident Detail (`/incidents/INC-2026-002`)
- **Action**: Navigate to **INC-2026-002** and click **Analyze Threat Telemetry**.
- **Expected Result**: Analysis identifies similar SSH brute-force attack from a completely different attacker IP (`203.0.113.88`) against internal host `app-prod-04`.
- **Presenter Narrative**:
  > *"Weeks later, a completely different attacker from a different IP targets a production application server: `app-prod-04`. We click Analyze Threat Telemetry."*

---

### `1:30–1:55` | HINDSIGHT RECALL: Experiential Match
- **Page**: Incident Detail (`/incidents/INC-2026-002`)
- **Action**: Click **Recall & Recommend**. Inspect the **Relevant Past Incidents** card and the **Hindsight Cognitive Engine Explanation**.
- **Expected Result**: Hindsight returns `INC-2026-001` with an **84.8% similarity score**. The card displays the past root cause (package update enabled password auth) and historical outcome (Zero Breach).
- **Presenter Narrative**:
  > *"Notice what just happened. The agent did not just grep documentation. Hindsight performed a semantic vector search across our retained incident memories and matched INC-2026-001 with an 84.8% confidence score. Right on screen, the analyst sees the exact historical precedent: what happened before, the identified root cause, and the proven outcome: threat contained with zero breach."*

---

### `1:55–2:20` | MEMORY-INFORMED RECOMMENDATION: Provenance & Directives
- **Page**: Incident Detail (`/incidents/INC-2026-002`)
- **Action**: Highlight the **Memory Influence Provenance Banner** and the purple **Hindsight Precedent** directives.
- **Expected Result**: Recommendation contains:
  1. Standard firewall drop rule for `203.0.113.88`.
  2. `CRITICAL AUDIT`: Immediate inspection of `sshd_config` on `app-prod-04` referencing the `INC-2026-001` root cause.
  3. `PREVENTION RUNBOOK`: Enforcing automated Ansible compliance checks fleet-wide.
- **Presenter Narrative**:
  > *"Because Sentinel Memory remembers, the synthesized recommendation is radically transformed. A generic agent would only say 'block the IP'. Sentinel Memory outputs a CRITICAL AUDIT directive: 'Check service configuration on app-prod-04 immediately. In prior incident INC-2026-001, root cause was password authentication drift.' It also injects the PREVENTION RUNBOOK. The analyst has full human-in-the-loop control to click Approve and Mark Executed directly from the directive console."*

---

### `2:20–2:40` | LEARNING LOOP: Summary & Closing
- **Page**: Learning & Evolution (`http://localhost:5173/learning`)
- **Action**: Navigate to `/learning` and showcase the Before vs. After comparison.
- **Expected Result**: Visual timeline showing how retained memories reduce MTTR and prevent recurrent configuration failures.
- **Presenter Narrative**:
  > *"In our Learning Timeline, you can see how organizational MTTR drops as memories accumulate. Sentinel Memory doesn't just remember incidents. It remembers what happened, what worked, and uses that experience on the next incident. Thank you."*

---

## 4. Practical Troubleshooting Runbook

If any component fails during preparation or evaluation, use these tested recovery steps:

### Issue 1: Backend API Unavailable (`GET /health` fails or connection refused)
- **Symptom**: Top navigation bar shows `FastAPI: Disconnected` (red pill).
- **Fix**:
  1. Check if the port is in use or service is stopped:
     ```bash
     python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
     ```
  2. Verify health in terminal:
     ```bash
     curl http://127.0.0.1:8000/health
     ```

### Issue 2: Empty Database (No incidents appear on `/incidents`)
- **Symptom**: Incident table or queue shows 0 records.
- **Fix**:
  1. Execute the deterministic seed command:
     ```bash
     python scripts/seed_demo.py
     ```
  2. Refresh the browser page (`F5`).

### Issue 3: Hindsight Service Connection Error
- **Symptom**: `GET /health` shows `"hindsight": {"status": "error"}`.
- **Fix**:
  1. Verify `HINDSIGHT_MODE=mock` in `.env` (or `backend/.env`). The mock adapter operates 100% in-memory with zero external network dependencies.
  2. If connecting to a live Hindsight Cloud instance, verify `HINDSIGHT_BASE_URL` and `HINDSIGHT_API_KEY` in `.env`.

### Issue 4: LLM Provider Timeout / API Key Failure
- **Symptom**: Threat analysis or recommendation hangs or returns 500 error.
- **Fix**:
  1. Ensure `LLM_PROVIDER=mock` in `.env`.
  2. The built-in mock analyzer and recommender produce deterministic, realistic MITRE ATT&CK classifications and memory-provenance recommendations without external API rate limits or keys.

### Issue 5: Frontend API Configuration Mismatch
- **Symptom**: Frontend console reports `NetworkError` when calling `http://localhost:8000`.
- **Fix**:
  1. Verify `frontend/.env` contains `VITE_API_URL=http://localhost:8000`.
  2. If running fully offline without the backend, set `VITE_USE_MOCK_API=true` in `frontend/.env` and restart the Vite dev server (`npm run dev`).
