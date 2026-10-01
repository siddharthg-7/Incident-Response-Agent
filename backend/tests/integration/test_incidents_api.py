import pytest


@pytest.mark.asyncio
async def test_incident_crud_and_lifecycle(client):
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

    list_res = await client.get("/api/incidents")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    get_res = await client.get(f"/api/incidents/{inc_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == inc_id

    analyze_res = await client.post(f"/api/incidents/{inc_id}/analyze")
    assert analyze_res.status_code == 200
    analyzed_data = analyze_res.json()
    assert analyzed_data["status"] == "ANALYZED"
    assert analyzed_data["analysis"] is not None
    assert analyzed_data["analysis"]["classification"] is not None
    assert analyzed_data["analysis"]["suspected_root_cause"] is not None
    assert len(analyzed_data["analysis"]["evidence_summary"]) >= 1

    recommend_res = await client.post(f"/api/incidents/{inc_id}/recommend")
    assert recommend_res.status_code == 200
    rec_data = recommend_res.json()
    assert rec_data["status"] == "RECOMMENDATION_READY"
    assert rec_data["recommendation"]["recommended_response"] is not None
    assert rec_data["recommendation"]["why_this_response"] is not None
    assert len(rec_data["recommendation"]["detailed_actions"]) >= 1

    # Test Action Status Update: Approve ACT-01
    act_res = await client.post(
        f"/api/incidents/{inc_id}/actions/ACT-01",
        json={"status": "APPROVED"}
    )
    assert act_res.status_code == 200
    updated_actions = act_res.json()["recommendation"]["detailed_actions"]
    act_01 = next(a for a in updated_actions if a["id"] == "ACT-01")
    assert act_01["status"] == "APPROVED"

    # Test Action Status Update: Execute ACT-01
    act_exec_res = await client.post(
        f"/api/incidents/{inc_id}/actions/ACT-01",
        json={"status": "EXECUTED"}
    )
    assert act_exec_res.status_code == 200
    act_01_exec = next(a for a in act_exec_res.json()["recommendation"]["detailed_actions"] if a["id"] == "ACT-01")
    assert act_01_exec["status"] == "EXECUTED"

    # Test Analyst Assignment
    assign_res = await client.post(
        f"/api/incidents/{inc_id}/assign",
        json={"analyst": "analyst_lead_sarah"}
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["analyst_assigned"] == "analyst_lead_sarah"

    # Test PATCH incident general attributes
    patch_res = await client.patch(
        f"/api/incidents/{inc_id}",
        json={"title": "Updated Unauthorized Access Attempt - Confirmed Threat"}
    )
    assert patch_res.status_code == 200
    assert "Confirmed Threat" in patch_res.json()["title"]

    res_payload = {
        "actions_taken": ["Terminated connection", "Added IP to blacklist"],
        "outcome": "Threat mitigated"
    }
    resolve_res = await client.post(f"/api/incidents/{inc_id}/resolve", json=res_payload)
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "RESOLVED"

    # Test Auto-Generate Post-Mortem
    gen_pm_res = await client.post(f"/api/incidents/{inc_id}/postmortem/generate")
    assert gen_pm_res.status_code == 200
    assert gen_pm_res.json()["status"] == "POSTMORTEM_COMPLETE"
    assert gen_pm_res.json()["postmortem"]["root_cause"] is not None

    learn_res = await client.post(f"/api/incidents/{inc_id}/learn")
    assert learn_res.status_code == 200
    assert learn_res.json()["status"] == "success"

