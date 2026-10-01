import pytest


@pytest.mark.asyncio
async def test_demo_reset_and_memory_endpoints(client):
    # 1. Reset demo state via API
    reset_res = await client.post("/api/demo/reset")
    assert reset_res.status_code == 200
    reset_data = reset_res.json()
    assert reset_data["status"] == "success"
    assert "INC-2026-001" in reset_data["incidents_reset"]
    assert "INC-2026-002" in reset_data["incidents_reset"]

    # 2. Check memory bank endpoint
    mem_res = await client.get("/api/memory")
    assert mem_res.status_code == 200
    memories = mem_res.json()
    # At least INC-2026-001 has postmortem in seed data
    assert len(memories) >= 1
    inc_001_mem = next(m for m in memories if m["source_incident_id"] == "INC-2026-001")
    assert inc_001_mem["relevance_label"] is not None
    assert inc_001_mem["incident_pattern"] is not None
    assert inc_001_mem["what_happened"] is not None
    assert inc_001_mem["timestamp"] is not None

    # 3. Check learning timeline endpoint
    timeline_res = await client.get("/api/memory/timeline")
    assert timeline_res.status_code == 200
    timeline = timeline_res.json()
    assert len(timeline) >= 1
    assert any(t["incident_id"] == "INC-2026-001" for t in timeline)

    # 4. Ad-hoc memory recall endpoint
    recall_payload = {
        "query": "SSH brute force root login attempts with configuration drift",
        "context": "type: ssh_brute_force",
        "limit": 3
    }
    recall_res = await client.post("/api/memory/recall", json=recall_payload)
    assert recall_res.status_code == 200
    recalled_list = recall_res.json()
    assert isinstance(recalled_list, list)


@pytest.mark.asyncio
async def test_incident_memory_matches_endpoint(client):
    # Reset demo
    await client.post("/api/demo/reset")

    # Retain INC-2026-001 experience into Hindsight
    await client.post("/api/incidents/INC-2026-001/learn")

    # Query memory matches for INC-2026-002
    res = await client.get("/api/incidents/INC-2026-002/memory")
    assert res.status_code == 200
    matches = res.json()
    assert len(matches) >= 1
    assert matches[0]["source_incident_id"] == "INC-2026-001"
    assert matches[0]["relevance_label"] is not None
    assert matches[0]["incident_pattern"] is not None
    assert matches[0]["what_happened"] is not None

