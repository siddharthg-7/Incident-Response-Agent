# Sentinel Memory - Demo Video Script (2m 30s)

> **Theme**: AI Agents That Learn Using Hindsight  
> **Duration**: 02:30 (Target: 2–3 minutes; Max: 5 minutes)  
> **Cadence**: Confident, deliberate, technical (130–140 words per minute)

---

## 0:00–0:15 | INTRO & THE PROBLEM
- **Screen / Action**: Open Sentinel Memory Dashboard (`http://localhost:5173/dashboard`). Cursor gently hovers over the active threat queue.
- **Voiceover**: 
  > *"Welcome to Sentinel Memory. We built an autonomous cybersecurity Incident Response Agent powered by Hindsight—an agent that learns from previous security incidents rather than investigating every alert from scratch."*
- **Expected Result**: Clean dark-mode SOC dashboard is visible with live incident metrics and system connectivity status (`FastAPI: Connected`).

---

## 0:15–0:40 | INCIDENT 1 INGESTION & THREAT ANALYSIS
- **Screen / Action**: Click on **INC-2026-001** (`/incidents/INC-2026-001`). View the 6-stage investigation pipeline stepper and threat telemetry.
- **Voiceover**: 
  > *"Here is Incident 1: 14,200 failed SSH logins hitting our DMZ perimeter bastion, `bastion-01`. Our AI threat analysis classifies this as a MITRE ATT&CK T1110 password guessing attack. A standard, stateless AI agent would simply say: 'block the attacker IP'."*
- **Expected Result**: Incident detail workspace displays failed login count, attacker IP `198.51.100.45`, targeted host `bastion-prod-01`, and MITRE ATT&CK badges.

---

## 0:40–1:00 | ANALYST RESPONSE & ROOT CAUSE DISCOVERY
- **Screen / Action**: Scroll to Resolution section. Click **Record Resolution**. Point mouse at the discovered root cause.
- **Voiceover**: 
  > *"The analyst reviews the recommendation, applies a perimeter firewall drop rule, and uncovers the true root cause during investigation: an automated OS package update had overwritten `sshd_config`, re-enabling password authentication on our public interface."*
- **Expected Result**: Resolution modal/section displays the executed firewall rule and the underlying configuration drift root cause.

---

## 1:00–1:15 | LEARNING & HINDSIGHT RETENTION
- **Screen / Action**: Click **Post-Mortem & Retain**.
- **Voiceover**: 
  > *"The critical step is that the resolved incident becomes reusable experience. We click 'Post-Mortem & Retain', and Hindsight commits the full case context, root cause, and verified outcome into our long-term memory bank."*
- **Expected Result**: Status updates to `POSTMORTEM_COMPLETE`. Green confirmation toast appears: *"Experience retained in Hindsight"*.

---

## 1:15–1:35 | INCIDENT 2 INCOMING ATTACK
- **Screen / Action**: Navigate to Incident Queue (`/incidents`) and click into **INC-2026-002** (`Spike in Failed SSH Logins on App-Prod-04`). Click **Analyze Threat Telemetry**.
- **Voiceover**: 
  > *"Weeks later, a completely different external IP—203.0.113.88—launches another SSH brute-force attack, this time targeting an internal application server: `app-prod-04`. This incident looks similar, but the system now has experience from the previous incident."*
- **Expected Result**: Incident 2 workspace loads with new observables, and AI threat analysis classifies the attack pattern.

---

## 1:35–1:55 | HINDSIGHT RECALL: EXPERIENTIAL PRECEDENT
- **Screen / Action**: Click **Recall & Recommend**. Highlight the **Relevant Past Incidents** card and the **Hindsight Cognitive Engine Explanation**.
- **Voiceover**: 
  > *"Watch Hindsight in action. The agent executes multi-strategy retrieval across our memory bank and recalls INC-2026-001 with an 84.8% similarity score! Right on screen, the analyst sees the exact historical precedent: what happened before, the package upgrade root cause, and the proven outcome: zero breach."*
- **Expected Result**: Hindsight recall card renders with the 84.8% similarity badge, past root cause (package update enabled password auth), and prior containment outcome.

---

## 1:55–2:20 | MEMORY-INFORMED RECOMMENDATION & PROVENANCE
- **Screen / Action**: Scroll down to the purple **Memory Influence Provenance** banner and directive cards. Click **Approve Action** on Directive 2 (CRITICAL AUDIT), then click **Mark Executed**.
- **Voiceover**: 
  > *"The recommendation now incorporates relevant experience from the previous incident. Alongside standard firewall drops, Sentinel Memory injects a CRITICAL AUDIT warning the analyst to inspect `sshd_config` on `app-prod-04` immediately, plus the PREVENTION RUNBOOK for fleet-wide Ansible compliance. The analyst approves and executes the directive before the attacker ever breaches the system."*
- **Expected Result**: Action status updates to `EXECUTED` with a green checkmark. Provenance tags clearly trace back to `INC-2026-001`.

---

## 2:20–2:40 | CLOSING & LEARNING EVOLUTION
- **Screen / Action**: Click **Learning** in the left sidebar (`/learning`). Show the Before vs After comparison cards and the chronological learning timeline.
- **Voiceover**: 
  > *"Sentinel Memory turns incident history into operational experience, allowing future incidents to benefit from what the system has already learned. As memories accumulate, organizational MTTR drops by 68%. Sentinel Memory: powered by Hindsight. Thank you."*
- **Expected Result**: Learning timeline renders showing MTTR drop, zero recurrent breaches, and historical memory bank growth.
