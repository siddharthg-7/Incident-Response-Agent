import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}", headers={"Accept": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def post(path, data=None):
    payload = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def main():
    print("=== PHASE 3 END-TO-END VALIDATION SCRIPT ===")
    
    # 1. Health check
    print("\n1. Testing Backend Health...")
    health = get("/health")
    print(f"Health Status: {health.get('status')} | DB: {health.get('database')} | Hindsight: {health.get('hindsight')}")
    assert health.get("status") == "healthy", "Backend unhealthy"
    
    # 2. List Incidents
    print("\n2. Listing Incidents...")
    incidents = get("/api/incidents")
    print(f"Found {len(incidents)} incidents in database.")
    for inc in incidents:
        print(f" - {inc.get('id')}: {inc.get('title')} [{inc.get('status')}]")
        
    # 3. Complete Phase 3 Loop Verification:
    # Incident 1 (INC-2026-001) -> resolve -> postmortem -> learn
    print("\n3. Resolving and Learning Incident 1 (INC-2026-001)...")
    res_1 = post("/api/incidents/INC-2026-001/resolve", {
        "actions_taken": [
            "Blocked attacker IP 198.51.100.45 at perimeter firewall",
            "Disabled password authentication on bastion-01",
            "Rotated compromised user credentials and SSH host keys",
            "Deployed fail2ban daemon with 3-attempt limit"
        ],
        "outcome": "Threat contained. Zero persistent access established.",
        "resolved_by": "lead_soc_analyst"
    })
    print(f"INC-2026-001 status: {res_1.get('status')}")
    
    # Post-mortem
    pm_1 = post("/api/incidents/INC-2026-001/postmortem", {
        "root_cause": "SSH brute force against root user via compromised credential on perimeter bastion",
        "lessons_learned": "Enforce pubkey-only SSH across all DMZ bastions and implement automated geo-blocking for abnormal velocity."
    })
    print(f"INC-2026-001 post-mortem generated. Status: {pm_1.get('status')}")
    
    # Retain into Hindsight Memory
    learn_1 = post("/api/incidents/INC-2026-001/learn", {})
    mem_id = learn_1.get("memory_id")
    print(f"Hindsight RETAIN successful! Memory ID: {mem_id}")
    
    # 4. Incident 2 (INC-2026-002) -> analyze -> recall memory -> recommendation influenced by memory
    print("\n4. Analyzing Incident 2 (INC-2026-002)...")
    inc2_analyzed = post("/api/incidents/INC-2026-002/analyze", {})
    analysis_data = inc2_analyzed.get("analysis", {})
    print(f"INC-2026-002 classification: {analysis_data.get('classification')}")
    print(f"Summary: {analysis_data.get('investigation_summary', '')[:80]}...")
    
    print("\n5. Generating Memory-Influenced Recommendations for Incident 2...")
    inc2_recommended = post("/api/incidents/INC-2026-002/recommend", {})
    rec_data = inc2_recommended.get("recommendation", {})
    recalled = rec_data.get("recalled_experiences", [])
    actions = rec_data.get("recommended_actions", [])
    confidence = rec_data.get("confidence", 0.0)
    
    print(f"Confidence score: {confidence}")
    print(f"Recalled memories count: {len(recalled)}")
    matched_inc1 = False
    for exp in recalled:
        matched_id = exp.get("source_incident_id")
        score = exp.get("similarity_score", 0.0)
        print(f" - Recalled Experience from: {matched_id} (Similarity: {score:.3f})")
        print(f"   Outcome: {exp.get('past_outcome')}")
        print(f"   Key Takeaway / Lesson: {exp.get('lesson_learned')}")
        if matched_id == "INC-2026-001":
            matched_inc1 = True
            
    print(f"\nRecommended Actions influenced by memory ({len(actions)} total):")
    for act in actions:
        print(f" [Action] {act}")
        
    assert matched_inc1, "Failed: INC-2026-002 did not recall INC-2026-001!"
    print("\nSUCCESS: Phase 3 loop verified end-to-end with live FastAPI backend and Hindsight memory!")

if __name__ == "__main__":
    main()
