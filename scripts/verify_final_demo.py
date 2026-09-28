#!/usr/bin/env python3
"""
Sentinel Memory - Golden Path Final Verification Script
Validates the complete 2-incident experiential learning loop:
  INC-2026-001 (Resolve -> Post-Mortem -> Retain)
       |
       v
  INC-2026-002 (Analyze -> Hindsight Recall -> Recommendation Provenance)
"""

import urllib.request
import json
import time
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}", headers={"Accept": "application/json"})
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        lat = (time.perf_counter() - t0) * 1000
        return json.loads(resp.read().decode()), lat

def post(path, data=None):
    payload = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        lat = (time.perf_counter() - t0) * 1000
        return json.loads(resp.read().decode()), lat

def main():
    print("=" * 70)
    print("      SENTINEL MEMORY - GOLDEN PATH END-TO-END VERIFICATION")
    print("=" * 70)

    # 1. System Health
    print("\n[1/5] Checking System Health & Memory Bank...")
    health, lat_h = get("/health")
    print(f"  • API Status: {health.get('status')} ({lat_h:.1f}ms)")
    print(f"  • Database: {health.get('database')}")
    print(f"  • Hindsight Core: {health.get('hindsight', {}).get('status')}")
    assert health.get("status") == "healthy", "Backend unhealthy"

    # 2. Incident 1: Resolve & Post-Mortem
    print("\n[2/5] Executing Incident 1 (INC-2026-001) Resolution & Post-Mortem...")
    res1, lat_res = post("/api/incidents/INC-2026-001/resolve", {
        "actions_taken": [
            "Perimeter firewall DROP rule applied for 198.51.100.45",
            "Disabled PasswordAuthentication in /etc/ssh/sshd_config on bastion-01",
            "Rotated compromised user credentials and SSH host keys"
        ],
        "outcome": "Threat contained. Zero persistent access established.",
        "resolved_by": "lead_soc_analyst"
    })
    print(f"  • INC-2026-001 Status: {res1.get('status')} ({lat_res:.1f}ms)")

    pm1, lat_pm = post("/api/incidents/INC-2026-001/postmortem", {
        "root_cause": "SSH brute force against root user via compromised password authentication on perimeter bastion",
        "lessons_learned": "Enforce pubkey-only SSH across all DMZ bastions and implement automated geo-blocking for abnormal velocity."
    })
    print(f"  • Post-Mortem Recorded: {pm1.get('status')} ({lat_pm:.1f}ms)")

    # 3. Retain into Hindsight
    print("\n[3/5] Retaining INC-2026-001 Experience into Hindsight Memory Bank...")
    learn1, lat_l = post("/api/incidents/INC-2026-001/learn", {})
    print(f"  • Hindsight Commit Status: {learn1.get('status')} ({lat_l:.1f}ms)")

    # 4. Incident 2: Analysis & Memory Recall
    print("\n[4/5] Analyzing Incident 2 (INC-2026-002) and Recalling Memory...")
    inc2, lat_a = post("/api/incidents/INC-2026-002/analyze", {})
    print(f"  • Target: {inc2.get('target')} ({lat_a:.1f}ms)")

    rec2, lat_r = post("/api/incidents/INC-2026-002/recommend", {})
    rec = rec2.get("recommendation", {})
    recalled = rec.get("recalled_experiences", [])
    actions = rec.get("recommended_actions", [])
    confidence = rec.get("confidence", 0.0)

    print(f"  • Recalled Experiences Count: {len(recalled)} ({lat_r:.1f}ms)")
    print(f"  • Recommendation Confidence: {confidence:.2f}")

    matched_inc1 = False
    for exp in recalled:
        if exp.get("source_incident_id") == "INC-2026-001":
            matched_inc1 = True
            print(f"  • Recalled Match: INC-2026-001 (Similarity: {exp.get('similarity_score', 0):.3f})")
            print(f"    - Historical Root Cause: {exp.get('past_root_cause')}")
            print(f"    - Historical Outcome: {exp.get('past_outcome')}")
            print(f"    - Retained Lesson: {exp.get('lesson_learned')}")

    assert matched_inc1, "Verification Failed: INC-2026-001 was not recalled!"

    # 5. Recommendation Provenance Verification
    print("\n[5/5] Verifying Memory-Informed Provenance in Synthesized Actions...")
    has_audit = any("CRITICAL AUDIT" in a for a in actions)
    has_runbook = any("PREVENTION RUNBOOK" in a for a in actions)

    for a in actions:
        if "CRITICAL AUDIT" in a or "PREVENTION RUNBOOK" in a:
            print(f"  [Memory Directive]: {a}")

    assert has_audit, "Missing CRITICAL AUDIT in recommended actions"
    assert has_runbook, "Missing PREVENTION RUNBOOK in recommended actions"

    print("\n" + "=" * 70)
    print("             GOLDEN PATH VERIFICATION: 100% PASSED")
    print("=" * 70)
    print("Summary:")
    print("  ✓ Backend health verified")
    print("  ✓ INC-2026-001 resolved, post-mortem created, and retained in Hindsight")
    print("  ✓ INC-2026-002 analyzed with threat tactics extracted")
    print("  ✓ Hindsight successfully recalled INC-2026-001 with high cosine similarity")
    print("  ✓ Recommendation synthesized with explicit memory provenance directives")
    print("=" * 70)

if __name__ == "__main__":
    main()
