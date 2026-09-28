# Sentinel Memory - Core Demo Script (2-3 Minutes)

This document defines the official milestone demo demonstrating **how Sentinel Memory learns and improves from experience using Hindsight**.

---

## The Demo Concept: "Before vs After Experience"

The core demonstration highlights two sequential incidents to visibly prove the agent's memory improvement:

```
[Incident 1: First Occurrence]
Alert → Analysis → Recommendation (Generic) → Analyst Resolves → Post-Mortem → RETAIN to Hindsight

                                        ↓

[Incident 2: Subsequent Occurrence]
Alert → Analysis → RECALL from Hindsight → Recommendation (Enriched with Past Lessons & Root Cause!)
```

---

## Step-by-Step Demo Flow

### Phase 1: Incident 1 (Baseline - Cold Memory)
1. **Ingest Incident 1**:
   - `INC-2026-001`: External SSH Brute Force against `bastion-prod-01`.
   - Alert indicators: 14,200 failed attempts from IP `198.51.100.45`.
2. **Agent Analysis**:
   - Agent identifies MITRE ATT&CK T1110.001 (Brute Force / Password Guessing).
   - Generates generic baseline recommendation: *"Block IP 198.51.100.45"*.
3. **Analyst Resolution & Post-Mortem**:
   - Analyst investigates and discovers the true root cause: *Password authentication was inadvertently re-enabled during a routine package update.*
   - Analyst executes: (a) Drop IP, (b) Disable `PasswordAuthentication no` in `sshd_config`, (c) Restart sshd.
   - Outcome: *Contained in 12 min. Zero unauthorized logins.*
   - Lesson Learned: *Enforce automated Ansible compliance check to ensure password auth remains disabled.*
4. **Hindsight RETAIN**:
   - The outcome capsule is retained into Hindsight's memory bank.

---

### Phase 2: Incident 2 (Adaptive - Recalled Memory)
1. **Ingest Incident 2**:
   - `INC-2026-002`: A different external attacker (`203.0.113.88`) attempts SSH brute force on `app-prod-04`.
2. **Agent Analysis & Hindsight RECALL**:
   - Agent detects the SSH attack pattern.
   - Sentinel Agent queries Hindsight: `recall(query="ssh brute force failed password login")`.
   - Hindsight returns `INC-2026-001` with high relevance!
3. **Enriched Contextual Recommendation**:
   - **Without Memory**, an agent would only say: *"Block IP 203.0.113.88"*.
   - **With Hindsight Memory**, Sentinel Agent outputs:
     > *"🚨 Primary Action: Block IP 203.0.113.88.*
     > *⚠️ Critical Memory Context (from INC-2026-001): In the previous SSH incident on Bastion-01, attackers exploited password authentication that was accidentally left enabled. Immediate recommendation: Audit `sshd_config` on `app-prod-04` right now to ensure `PasswordAuthentication no` is enforced, preventing credentials from being cracked."*

---

## Running the Automated Demo CLI

To execute this exact demonstration in terminal:
```bash
python scripts/run_milestone1_demo.py
```
The script runs the full end-to-end loop, prints structured visual summaries, and displays the direct comparison between generic response and Hindsight-enhanced response.
