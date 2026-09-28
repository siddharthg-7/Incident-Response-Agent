import pytest
from app.hindsight.service import HindsightService
from app.hindsight.mock_adapter import MockHindsightAdapter


@pytest.mark.asyncio
async def test_hindsight_retain_and_recall():
    adapter = MockHindsightAdapter()
    service = HindsightService(adapter=adapter)

    # 1. Retain an experience
    incident_1 = {
        "id": "INC-TEST-001",
        "title": "SSH Brute Force Attack",
        "incident_type": "ssh_brute_force",
        "severity": "HIGH",
        "source": "198.51.100.45",
        "target": "bastion-prod-01",
        "indicators": ["198.51.100.45", "root", "port 22"],
        "resolution": {
            "actions_taken": ["Blocked IP", "Disabled PasswordAuthentication in sshd_config"],
            "outcome": "Contained successfully"
        },
        "postmortem": {
            "root_cause": "Password authentication was mistakenly re-enabled during OS upgrade",
            "lessons_learned": "Enforce automated Ansible compliance check on sshd_config"
        }
    }

    retain_res = await service.retain_incident_experience(incident_1)
    assert retain_res["status"] == "retained"

    # 2. Recall with similar query
    query = "Multiple failed SSH password logins from attacker targeting root"
    recalled = await service.recall_similar_incidents(
        incident_context="type: ssh_brute_force target: server-02",
        query=query,
        limit=3
    )

    assert len(recalled) == 1
    top_match = recalled[0]
    assert top_match.source_incident_id == "INC-TEST-001"
    assert top_match.similarity_score > 0.5
    assert "Password authentication" in top_match.past_root_cause
    assert "Ansible" in top_match.lesson_learned


@pytest.mark.asyncio
async def test_hindsight_health():
    adapter = MockHindsightAdapter()
    service = HindsightService(adapter=adapter)
    health = await service.health_check()
    assert health["status"] == "healthy"
    assert health["mode"] == "mock"
