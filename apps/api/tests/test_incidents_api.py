import pytest


@pytest.mark.asyncio
async def test_incident_crud_and_lifecycle(client):
    # 1. Create Incident
    payload = {
        "title": "Unauthorized Access Attempt",
        "description": "Suspicious login attempts detected on corporate gateway",
        "incident_type": "ssh_brute_force",
        "severity": "HIGH",
        "source": "198.51.100.99",
        "target": "vpn-gateway-01",
        "indicators": ["198.51.100.99", "admin", "port 22"]
    }
    create_res = await client.post("/api/incidents", json=payload)
    assert create_res.status_code == 201
    inc_data = create_res.json()
    inc_id = inc_data["id"]
    assert inc_data["status"] == "NEW"
    assert inc_data["title"] == payload["title"]

    # 2. List Incidents
    list_res = await client.get("/api/incidents")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 3. Get Single Incident
    get_res = await client.get(f"/api/incidents/{inc_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == inc_id

    # 4. Analyze Incident
    analyze_res = await client.post(f"/api/incidents/{inc_id}/analyze")
    assert analyze_res.status_code == 200
    analyzed_data = analyze_res.json()
    assert analyzed_data["status"] == "ANALYZED"
    assert analyzed_data["analysis"] is not None
    assert "MITRE ATT&CK" in analyzed_data["analysis"]["tactics"][0]

    # 5. Generate Recommendation
    recommend_res = await client.post(f"/api/incidents/{inc_id}/recommend")
    assert recommend_res.status_code == 200
    rec_data = recommend_res.json()
    assert rec_data["status"] == "RECOMMENDATION_READY"
    assert len(rec_data["recommendation"]["recommended_actions"]) > 0

    # 6. Resolve Incident
    res_payload = {
        "actions_taken": ["Terminated connection", "Added IP to blacklist"],
        "outcome": "Threat mitigated"
    }
    resolve_res = await client.post(f"/api/incidents/{inc_id}/resolve", json=res_payload)
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "RESOLVED"

    # 7. Post-Mortem
    pm_payload = {
        "root_cause": "Weak administrator password on staging gateway",
        "lessons_learned": "Enforce MFA and 16-character minimum"
    }
    pm_res = await client.post(f"/api/incidents/{inc_id}/postmortem", json=pm_payload)
    assert pm_res.status_code == 200
    assert pm_res.json()["status"] == "POSTMORTEM_COMPLETE"

    # 8. Learn (Hindsight Retain)
    learn_res = await client.post(f"/api/incidents/{inc_id}/learn")
    assert learn_res.status_code == 200
    assert learn_res.json()["status"] == "success"
