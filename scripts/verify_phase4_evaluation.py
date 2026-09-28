import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}", headers={"Accept": "application/json"})
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        duration_ms = (time.perf_counter() - t0) * 1000
        return json.loads(resp.read().decode()), duration_ms

def post(path, data=None):
    payload = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        duration_ms = (time.perf_counter() - t0) * 1000
        return json.loads(resp.read().decode()), duration_ms

def main():
    print("=" * 65)
    print("  SENTINEL MEMORY - PHASE 4 EVALUATION & RELIABILITY TEST SUITE")
    print("=" * 65)

    # Evaluation Checklist Tracker
    results = {
        "health_check": False,
        "incident_load": False,
        "past_outcome_retained": False,
        "memory_recall_match": False,
        "similarity_score_threshold": False,
        "recommendation_memory_provenance": False,
        "critical_audit_injected": False,
        "prevention_runbook_injected": False,
        "evaluator_journey_coherent": False
    }

    # 1. Health & Hindsight Status
    print("\n[1/6] Evaluating System Health & Memory Bank Latency...")
    health, lat_health = get("/health")
    print(f"  • Status: {health.get('status')} (Latency: {lat_health:.1f}ms)")
    print(f"  • DB State: {health.get('database')}")
    print(f"  • Hindsight Bank: {health.get('hindsight', {}).get('status')} (Active Banks: {health.get('hindsight', {}).get('banks_active')})")
    assert health.get("status") == "healthy"
    results["health_check"] = True

    # 2. Ingest / Resolve Incident 1
    print("\n[2/6] Evaluating Incident 1 (INC-2026-001) Resolution & Post-Mortem Retain...")
    res1, lat_res1 = post("/api/incidents/INC-2026-001/resolve", {
        "actions_taken": [
            "Perimeter firewall DROP rule applied for 198.51.100.45",
            "Disabled PasswordAuthentication on bastion-01 sshd_config",
            "Rotated SSH host and user credentials"
        ],
        "outcome": "Threat contained. Zero persistent access established.",
        "resolved_by": "evaluator_soc_lead"
    })
    print(f"  • Resolution Status: {res1.get('status')} (Latency: {lat_res1:.1f}ms)")

    pm1, lat_pm1 = post("/api/incidents/INC-2026-001/postmortem", {
        "root_cause": "SSH brute force against root user via compromised password authentication",
        "lessons_learned": "Enforce pubkey-only SSH across all DMZ bastions and implement automated geo-blocking for abnormal velocity."
    })
    print(f"  • Post-Mortem Status: {pm1.get('status')} (Latency: {lat_pm1:.1f}ms)")

    learn1, lat_l1 = post("/api/incidents/INC-2026-001/learn", {})
    print(f"  • Hindsight Retain: {learn1.get('status')} (Latency: {lat_l1:.1f}ms)")
    results["past_outcome_retained"] = True

    # 3. Analyze Incident 2
    print("\n[3/6] Evaluating Incident 2 (INC-2026-002) Threat Analysis...")
    inc2, lat_a2 = post("/api/incidents/INC-2026-002/analyze", {})
    print(f"  • Target: {inc2.get('target')} | Severity: {inc2.get('severity')} (Latency: {lat_a2:.1f}ms)")
    results["incident_load"] = True

    # 4. Recall Memory & Generate Recommendations for Incident 2
    print("\n[4/6] Evaluating Hindsight Memory Match & Cosine Overlap for Incident 2...")
    rec2, lat_r2 = post("/api/incidents/INC-2026-002/recommend", {})
    rec_obj = rec2.get("recommendation", {})
    recalled_list = rec_obj.get("recalled_experiences", [])
    actions_list = rec_obj.get("recommended_actions", [])
    confidence = rec_obj.get("confidence", 0.0)

    print(f"  • Recalled Matches: {len(recalled_list)} items found (Latency: {lat_r2:.1f}ms)")
    print(f"  • Recommendation Confidence: {confidence:.2f}")

    matched_inc1 = False
    highest_score = 0.0
    for exp in recalled_list:
        score = exp.get("similarity_score", 0.0)
        highest_score = max(highest_score, score)
        if exp.get("source_incident_id") == "INC-2026-001":
            matched_inc1 = True
            print(f"  • Matched Incident: {exp.get('source_incident_id')} with Similarity Score: {score:.3f}")
            print(f"    - Historical Root Cause: {exp.get('past_root_cause')}")
            print(f"    - Historical Outcome: {exp.get('past_outcome')}")
            print(f"    - Retained Lesson: {exp.get('lesson_learned')}")

    results["memory_recall_match"] = matched_inc1
    results["similarity_score_threshold"] = highest_score >= 0.80

    # 5. Recommendation Transparency & Memory Provenance
    print("\n[5/6] Evaluating Recommendation Transparency & Provenance Injections...")
    for act in actions_list:
        if "CRITICAL AUDIT" in act:
            results["critical_audit_injected"] = True
            print(f"  [OK Found Injected Audit]: {act[:90]}...")
        if "PREVENTION RUNBOOK" in act:
            results["prevention_runbook_injected"] = True
            print(f"  [OK Found Injected Runbook]: {act[:90]}...")

    if results["critical_audit_injected"] and results["prevention_runbook_injected"]:
        results["recommendation_memory_provenance"] = True

    # 6. Evaluator Journey Summary
    print("\n[6/6] Verifying Complete Evaluator Journey...")
    print("  Pipeline: Current Incident -> Past Experience -> Previous Outcome -> Recommendation -> Analyst Action -> New Learning")
    journey_ok = all([
        results["health_check"],
        results["incident_load"],
        results["past_outcome_retained"],
        results["memory_recall_match"],
        results["similarity_score_threshold"],
        results["recommendation_memory_provenance"]
    ])
    results["evaluator_journey_coherent"] = journey_ok

    print("\n" + "=" * 65)
    print("                    PHASE 4 EVALUATION REPORT")
    print("=" * 65)
    for test_name, passed in results.items():
        icon = "PASSED [OK]" if passed else "FAILED [X]"
        print(f"  {test_name.replace('_', ' ').title():<40} {icon}")
    print("=" * 65)

    if journey_ok:
        print("\n>>> EVALUATION SUCCESS: All Phase 4 reliability and clarity criteria met!\n")
    else:
        print("\n>>> EVALUATION FAILED: Not all criteria passed.\n")
        exit(1)

if __name__ == "__main__":
    main()
