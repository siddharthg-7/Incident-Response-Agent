# Sentinel Memory - Presenter Cue Cards (8-Click Cheatsheet)

Keep this window or printout open on a second monitor while recording. Follow the 8 sequential clicks below for a flawless one-take recording:

---

### [CLICK 1] `0:00` | Start on Dashboard
- **URL**: `http://localhost:5173/dashboard`
- **Say**: *"Welcome to Sentinel Memory. An autonomous cybersecurity Incident Response Agent powered by Hindsight—an agent that remembers past investigations to solve the next attack faster."*
- **Action**: Hover cursor briefly over the stats cards (MTTR, Memory Bank).

---

### [CLICK 2] `0:25` | Open Incident 1
- **Click**: Click the row or title for **INC-2026-001** (`High Volume SSH Authentication Failure on Bastion-01`).
- **Say**: *"Here is Incident 1: 14,200 failed SSH logins hitting our perimeter bastion. Threat analysis identifies MITRE T1110 password guessing."*
- **Action**: Point mouse at MITRE tactics badges.

---

### [CLICK 3] `0:42` | Open Resolution & Post-Mortem
- **Click**: Scroll down and click **Record Resolution**, then review the actions.
- **Say**: *"Our analyst blocks the IP, but discovers the true root cause: an OS package update had overwritten sshd_config, enabling password authentication."*
- **Action**: Ensure `PasswordAuthentication` root cause text is visible.

---

### [CLICK 4] `1:00` | Retain to Hindsight
- **Click**: Click the green **Post-Mortem & Retain** button.
- **Say**: *"We click 'Post-Mortem & Retain'. Hindsight commits this complete experience capsule into our persistent memory bank."*
- **Action**: Pause 1 second for the green status pill (`POSTMORTEM_COMPLETE`) and toast notification.

---

### [CLICK 5] `1:15` | Navigate to Incident 2
- **Click**: Click **Incidents** in the sidebar, then click **INC-2026-002** (`Spike in Failed SSH Logins on App-Prod-04`).
- **Say**: *"Weeks later, a new attacker from a different IP hits an internal application server: app-prod-04. We click 'Analyze Threat Telemetry'."*
- **Action**: Click the blue **Analyze Threat Telemetry** button.

---

### [CLICK 6] `1:32` | Hindsight Recall & Recommend
- **Click**: Click the purple **Recall & Recommend** button.
- **Say**: *"Watch Hindsight in action. The agent retrieves from our memory bank and matches INC-2026-001 with an 84.8% similarity score, showing the exact previous root cause and zero breach outcome."*
- **Action**: Point cursor at the **Relevant Past Incidents** card and the 84.8% score badge.

---

### [CLICK 7] `1:52` | Highlight Recommendations & Approve
- **Click**: Scroll down to the purple **Memory Influence Provenance** banner. Click **Approve Action** on Directive 2 (CRITICAL AUDIT), then click **Mark Executed**.
- **Say**: *"Alongside standard firewall rules, the agent injects a CRITICAL AUDIT to inspect sshd_config on app-prod-04, plus the PREVENTION RUNBOOK. The analyst approves and marks it executed with one click."*
- **Action**: Watch badge turn green (`EXECUTED`).

---

### [CLICK 8] `2:25` | Learning & Evolution
- **Click**: Click **Learning** in the left sidebar (`/learning`).
- **Say**: *"In our Learning Timeline, you can see how organizational MTTR drops by 68% as memories accumulate. Sentinel Memory doesn't just respond—it learns. Thank you."*
- **Action**: Hold view on the Before vs After comparison cards for 5 seconds, then stop recording.

---

### Emergency Reset Button
If you slip up or want to re-record:
```bash
python scripts/seed_demo.py
```
Refresh the browser (`Ctrl + F5`) and restart from Click 1.
