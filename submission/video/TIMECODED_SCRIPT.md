# Sentinel Memory - Timecoded Video Script (2m 30s)

> **Total Target Duration**: `02:30` (Max allowed: `03:00`)  
> **Speaker Pace**: Confident, technical, and measured (approx. 130–140 words per minute)  
> **Resolution**: 1920x1080 (Browser zoom set to 110% for crisp typography)

---

## Video Production Table

| Timestamp | Visual / On-Screen Action | Spoken Voiceover (Read Word-for-Word) | Production Notes |
| :--- | :--- | :--- | :--- |
| **`0:00 - 0:10`** | **Title Card / Dashboard**: Show Sentinel Memory dashboard (`http://localhost:5173/dashboard`). Cursor hovers over active incident queue. | *"Welcome to Sentinel Memory. We built an autonomous cybersecurity Incident Response Agent powered by Hindsight—an AI agent that actually remembers past investigations to solve the next attack faster."* | High energy hook. Highlight the dark-mode SOC UI. |
| **`0:10 - 0:25`** | **Problem Statement**: Point to the stats cards (Mean Time to Respond, Open Incidents, Memory Capsules). | *"Every day, SOC teams face a crisis of organizational amnesia. When an alert arrives, analysts scramble to isolate the threat. Later, a post-mortem is filed away in a wiki. Months later, a similar attack strikes a different server, and a new analyst repeats the exact same mistakes from scratch. Stateless AI chatbots and generic RAG can't solve this because they only search static textbooks."* | Pan mouse gently over the dashboard metrics. |
| **`0:25 - 0:40`** | **Incident 1 Ingestion**: Click on **INC-2026-001** (`/incidents/INC-2026-001`). View the 6-stage investigation pipeline stepper. | *"Here is Incident 1: 14,200 failed SSH logins hitting our DMZ perimeter bastion, `bastion-01`. Our AI threat analysis classifies this as a MITRE ATT&CK T1110 credential guessing attack. A standard agent would simply say: 'block the attacker IP'."* | Point to the MITRE ATT&CK badges and telemetry. |
| **`0:40 - 0:58`** | **Incident 1 Deep Investigation & Root Cause**: Scroll to Resolution & Post-Mortem. | *"Our analyst blocks the IP, but upon deeper investigation, discovers the true underlying root cause: a routine OS package update had overwritten `sshd_config`, re-enabling password authentication on our public interface! The team enforces pubkey-only SSH and documents the lesson."* | Highlight the root-cause textarea showing the package update flaw. |
| **`0:58 - 1:12`** | **Hindsight Retain**: Click **Record Resolution**, then click **Post-Mortem & Retain**. Watch the green toast appear. | *"With Sentinel Memory, this discovery isn't lost in a wiki. We click 'Post-Mortem & Retain'. The agent packages the context, root cause, executed actions, and outcome into an experience capsule, and commits it into our Hindsight memory bank."* | Let the status change to `POSTMORTEM_COMPLETE` and toast show. |
| **`1:12 - 1:28`** | **Incident 2 Ingestion**: Navigate to Incident Queue (`/incidents`) and click into **INC-2026-002**. | *"Weeks later, a completely different external IP—203.0.113.88—launches another SSH brute-force attack. But this time, it targets an internal application server: `app-prod-04`. We click 'Analyze Threat Telemetry'."* | Show the distinct IP and new asset hostname. |
| **`1:28 - 1:48`** | **Hindsight Recall**: Click **Recall & Recommend**. Highlight the **Relevant Past Incidents** card and the **Hindsight Cognitive Explanation**. | *"Now watch the magic of Hindsight. The agent doesn't just grep text. It performs multi-strategy retrieval across our experiential memory bank and matches INC-2026-001 with an 84.8% similarity score! Right on screen, the analyst sees the exact historical precedent: what happened before, the package upgrade root cause, and the proven outcome."* | Highlight the 84.8% similarity badge and the juxtaposition card. |
| **`1:48 - 2:08`** | **Memory-Informed Recommendation**: Scroll to the purple **Memory Influence Provenance** banner and directive cards. | *"Because the agent remembers, the synthesized recommendation is radically transformed. Alongside standard firewall drops, Sentinel Memory injects a CRITICAL AUDIT: 'Check service configuration on app-prod-04 immediately for password authentication drift.' It also injects the PREVENTION RUNBOOK for automated Ansible compliance checks."* | Mouse over the purple `CRITICAL AUDIT` tag and click **Approve Action**. |
| **`2:08 - 2:22`** | **Analyst Control**: Click **Mark Executed** on the approved action. | *"The analyst retains complete human-in-the-loop control. With one click, they approve the directive and execute the audit before the attacker ever penetrates the perimeter."* | Show action changing to `EXECUTED` with green checkmark. |
| **`2:22 - 2:38`** | **Learning Engine**: Click **Learning & Evolution** in the sidebar (`/learning`). | *"Finally, in our Learning Timeline, you can see the compound value of Hindsight. As experience accumulates, Mean Time to Respond plummets by 68%, and recurrent configuration vulnerabilities are neutralized before they spread."* | Show the Before vs After comparison cards. |
| **`2:38 - 2:50`** | **Closing & Outro**: Navigate back to `/dashboard` or show GitHub repo screen. | *"Sentinel Memory doesn't just respond to incidents. It remembers what happened, what worked, and uses that experience to defend the enterprise. Sentinel Memory: powered by Hindsight. Thank you."* | Fade out or hold on the dashboard. |

---

## Word Count & Speaking Cadence
- **Total Word Count**: ~335 words
- **Target Cadence**: 135 words per minute
- **Pacing Rule**: Leave a 1-second pause after clicking major buttons (`Post-Mortem & Retain` and `Recall & Recommend`) to let the viewer see the real-time UI animation and toast notification.
