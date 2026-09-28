# Sentinel Memory - Video Shot List

This shot list defines the visual choreography for the 2m 30s demonstration video. Follow each shot sequentially to ensure every critical UI element and Hindsight feature is captured clearly.

---

### SHOT 1
- **Timestamp**: `0:00–0:15`
- **Page**: Dashboard (`http://localhost:5173/dashboard`)
- **Action**: Open dashboard; move cursor gently over the active incident queue.
- **What Must Be Visible**:
  - Top navigation bar with green `FastAPI: Connected` pill.
  - Active threat queue displaying `INC-2026-001`, `INC-2026-002`, `INC-2026-003`.
  - Stats cards: Open Incidents, Mean Time to Respond (MTTR), and Active Memory Capsules.

---

### SHOT 2
- **Timestamp**: `0:15–0:40`
- **Page**: Incident Detail (`http://localhost:5173/incidents/INC-2026-001`)
- **Action**: Click into **INC-2026-001** (`High Volume SSH Authentication Failure on Bastion-01`).
- **What Must Be Visible**:
  - 6-stage investigation pipeline stepper (Stage 1: Current Incident active).
  - Telemetry card: 14,200 failed attempts, external IP `198.51.100.45`, target asset `bastion-prod-01`.
  - AI Threat Analysis card: MITRE ATT&CK T1110.001 (Password Guessing) and assessed HIGH severity.

---

### SHOT 3
- **Timestamp**: `0:40–1:00`
- **Page**: Incident Detail (`/incidents/INC-2026-001`) - Resolution Section
- **Action**: Scroll down to the Resolution section. Click **Record Resolution**.
- **What Must Be Visible**:
  - Executed actions: firewall drop rule on `198.51.100.45` and credential rotation.
  - Discovered root cause text: *"Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication."*
  - Status transitions to `RESOLVED`.

---

### SHOT 4
- **Timestamp**: `1:00–1:15`
- **Page**: Incident Detail (`/incidents/INC-2026-001`) - Post-Mortem & Retain
- **Action**: Click the green **Post-Mortem & Retain** button.
- **What Must Be Visible**:
  - Investigation pipeline advances to Stage 6 (New Learning).
  - Status updates to `POSTMORTEM_COMPLETE`.
  - Green confirmation toast: *"Experience retained in Hindsight"*.
  - Retention into memory bank `sentinel-incident-memory`.

---

### SHOT 5
- **Timestamp**: `1:15–1:35`
- **Page**: Incidents Queue → Incident 2 Detail (`/incidents/INC-2026-002`)
- **Action**: Click **Incidents** in the sidebar, then select **INC-2026-002**. Click **Analyze Threat Telemetry**.
- **What Must Be Visible**:
  - Incident 2 title: `Spike in Failed SSH Logins on App-Prod-04`.
  - Distinct attacker IP `203.0.113.88` targeting internal server `app-prod-04`.
  - Analysis completes, classifying the similar brute-force pattern.

---

### SHOT 6
- **Timestamp**: `1:35–1:55`
- **Page**: Incident Detail (`/incidents/INC-2026-002`) - Hindsight Recall
- **Action**: Click the purple **Recall & Recommend** button. Scroll slightly to highlight memory matches.
- **What Must Be Visible**:
  - **Relevant Past Incidents** card rendering `INC-2026-001`.
  - **84.8% Cosine Similarity Match** badge.
  - Historical Root Cause: package upgrade overwrote `sshd_config` with password auth defaults.
  - Historical Outcome: threat contained with Zero Breach.
  - **Hindsight Cognitive Engine Explanation** callout box.

---

### SHOT 7
- **Timestamp**: `1:55–2:20`
- **Page**: Incident Detail (`/incidents/INC-2026-002`) - Recommendations & Action
- **Action**: Scroll to the purple **Memory Influence Provenance** banner. Click **Approve Action** on Directive 2 (CRITICAL AUDIT), then click **Mark Executed**.
- **What Must Be Visible**:
  - Directive 1: Perimeter firewall drop rule for `203.0.113.88`.
  - Directive 2: `CRITICAL AUDIT` citing `INC-2026-001` password auth drift on `app-prod-04`.
  - Directive 3: `PREVENTION RUNBOOK` for automated Ansible compliance checks.
  - Directive status updates to `EXECUTED` with a green checkmark.

---

### SHOT 8
- **Timestamp**: `2:20–2:40`
- **Page**: Learning & Evolution (`http://localhost:5173/learning`)
- **Action**: Click **Learning** in the left sidebar. Move cursor across the Before vs After comparison cards.
- **What Must Be Visible**:
  - **Without Memory** card: explains recurrent configuration vulnerabilities and generic IP-only blocking.
  - **With Memory** card: highlights proactive root-cause audits and 68% MTTR drop.
  - Chronological learning timeline showing accumulated memory capsules.

---

### SHOT 9
- **Timestamp**: `2:40–2:50`
- **Page**: Dashboard / Outro
- **Action**: Return to Dashboard (`/dashboard`) or hold on Learning screen; conclude voiceover.
- **What Must Be Visible**:
  - Full application interface showing active system health and repository attribution.
