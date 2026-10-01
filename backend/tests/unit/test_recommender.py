import pytest
from app.agents.recommender import ResponsePlanner
from app.schemas.incident import RecalledExperience


@pytest.mark.asyncio
async def test_recommender_cold_baseline_without_memory():
    planner = ResponsePlanner()
    incident_data = {
        "id": "INC-TEST-COLD",
        "title": "SSH Login Anomaly",
        "incident_type": "ssh_brute_force",
        "source": "198.51.100.99",
        "target": "bastion-staging"
    }

    # No recalled experiences
    rec = await planner.plan_response(incident_data, recalled_experiences=[])
    assert len(rec.recalled_experiences) == 0
    assert rec.confidence == 0.75
    assert "Baseline recommendation" in rec.rationale
    assert any("DROP rule" in action for action in rec.recommended_actions)
    assert not any("CRITICAL AUDIT" in action for action in rec.recommended_actions)
    assert rec.recommended_response is not None
    assert rec.why_this_response is not None
    assert "Standard containment" in rec.memory_influence
    assert len(rec.detailed_actions) == 3
    assert rec.detailed_actions[0].id == "ACT-01"


@pytest.mark.asyncio
async def test_recommender_adaptive_with_recalled_memory():
    planner = ResponsePlanner()
    incident_data = {
        "id": "INC-TEST-ADAPTIVE",
        "title": "SSH Login Anomaly on App Host",
        "incident_type": "ssh_brute_force",
        "source": "203.0.113.88",
        "target": "app-prod-04"
    }

    recalled = [
        RecalledExperience(
            source_incident_id="INC-2026-001",
            title="High Volume SSH Authentication Failure on Bastion-01",
            similarity_score=0.88,
            past_root_cause="OS package upgrade overwrote sshd_config, enabling password authentication.",
            past_actions_taken=["Applied firewall DROP rule", "Audited sshd_config"],
            past_outcome="Contained with zero breach.",
            lesson_learned="Enforce automated Ansible compliance check on sshd_config."
        )
    ]

    rec = await planner.plan_response(incident_data, recalled_experiences=recalled)
    assert len(rec.recalled_experiences) == 1
    assert rec.confidence == 0.94
    assert "Recommendation enriched by Hindsight memory recall" in rec.rationale
    assert "INC-2026-001" in rec.rationale

    actions_text = " ".join(rec.recommended_actions)
    assert "CRITICAL AUDIT" in actions_text
    assert "sshd_config" in actions_text
    assert "PREVENTION RUNBOOK" in actions_text
    assert "Ansible" in actions_text

    assert rec.recommended_response is not None
    assert rec.why_this_response is not None
    assert "INC-2026-001" in rec.memory_influence
    assert len(rec.detailed_actions) >= 5
    assert any(a.category == "eradication" for a in rec.detailed_actions)
    assert any(a.category == "recovery" for a in rec.detailed_actions)

