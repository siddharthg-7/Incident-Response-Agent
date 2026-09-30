import pytest
from app.agents.orchestrator import SentinelOrchestrator
from app.hindsight.service import HindsightService
from app.hindsight.mock_adapter import MockHindsightAdapter
from app.schemas.incident import Severity


@pytest.mark.asyncio
async def test_orchestrator_pipeline_flow():
    adapter = MockHindsightAdapter()
    hindsight_service = HindsightService(adapter=adapter)
    orchestrator = SentinelOrchestrator(hindsight_service=hindsight_service)

    # 1. Analyze
    incident_1 = {
        "id": "INC-ORCH-001",
        "title": "SSH Brute Force",
        "incident_type": "ssh_brute_force",
        "source": "198.51.100.45",
        "target": "bastion-prod-01",
        "indicators": ["198.51.100.45", "root"],
        "resolution": {
            "actions_taken": ["Blocked IP", "Restored sshd_config"],
            "outcome": "Contained successfully"
        },
        "postmortem": {
            "root_cause": "sshd_config package upgrade drift enabled password auth",
            "lessons_learned": "Enforce Ansible compliance check on sshd_config"
        }
    }

    analysis = await orchestrator.analyze_incident(incident_1)
    assert analysis.assessed_severity == Severity.HIGH
    incident_1["analysis"] = analysis.model_dump(mode="json")

    # 2. Retain
    retain_res = await orchestrator.retain_incident(incident_1, incident_1["postmortem"])
    assert retain_res["status"] == "retained"

    # 3. Process second similar incident
    incident_2 = {
        "id": "INC-ORCH-002",
        "title": "SSH Login Failures on App Server",
        "incident_type": "ssh_brute_force",
        "source": "203.0.113.88",
        "target": "app-prod-04",
        "indicators": ["203.0.113.88", "root", "port 22"]
    }

    recommendation = await orchestrator.generate_recommendation(incident_2)
    assert len(recommendation.recalled_experiences) >= 1
    top = recommendation.recalled_experiences[0]
    assert top.source_incident_id == "INC-ORCH-001"
    assert "CRITICAL AUDIT" in " ".join(recommendation.recommended_actions)
