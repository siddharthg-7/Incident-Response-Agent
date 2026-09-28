import json
from pathlib import Path
import pytest
from app.agents.orchestrator import SentinelOrchestrator
from app.hindsight.service import HindsightService
from app.hindsight.mock_adapter import MockHindsightAdapter


@pytest.mark.asyncio
async def test_milestone1_end_to_end_loop():
    """Validates the core Milestone 1 learning loop:
    Incident JSON 1 -> Analysis -> Retain to Hindsight -> Incident JSON 2 -> Recall -> Enriched Recommendation.
    """
    scenarios_dir = Path(__file__).resolve().parent.parent.parent.parent / "data" / "scenarios"
    incident1_path = scenarios_dir / "incident_01_ssh_brute_force.json"
    incident2_path = scenarios_dir / "incident_02_ssh_brute_force_variant.json"

    assert incident1_path.exists(), f"Scenario 1 not found at {incident1_path}"
    assert incident2_path.exists(), f"Scenario 2 not found at {incident2_path}"

    with open(incident1_path, "r", encoding="utf-8") as f:
        incident1_data = json.load(f)

    with open(incident2_path, "r", encoding="utf-8") as f:
        incident2_data = json.load(f)

    # Initialize isolated Hindsight memory adapter and orchestrator
    adapter = MockHindsightAdapter()
    hindsight_service = HindsightService(adapter=adapter)
    orchestrator = SentinelOrchestrator(hindsight_service=hindsight_service)

    # -------------------------------------------------------------
    # PHASE 1: Incident 1 (Historical Baseline)
    # -------------------------------------------------------------
    # Step 1.1: Analyze Incident 1
    analysis_1 = await orchestrator.analyze_incident(incident1_data)
    assert analysis_1.assessed_severity.value == "HIGH"
    assert "MITRE ATT&CK T1110.001" in analysis_1.tactics[0]

    # Step 1.2: Verify recommendation BEFORE memory exists (Baseline Cold)
    cold_recommendation = await orchestrator.generate_recommendation(incident1_data)
    assert len(cold_recommendation.recalled_experiences) == 0
    assert "Baseline recommendation" in cold_recommendation.rationale

    # Step 1.3: Retain Incident 1's outcome & post-mortem into Hindsight
    incident1_data["analysis"] = analysis_1.model_dump(mode="json")
    retain_result = await orchestrator.retain_incident(
        incident_data=incident1_data,
        postmortem_data=incident1_data.get("postmortem")
    )
    assert retain_result["status"] == "retained"

    # Verify Hindsight memory health
    health = await hindsight_service.health_check()
    assert health["total_memories_indexed"] == 1

    # -------------------------------------------------------------
    # PHASE 2: Incident 2 (Adaptive - Memory Recall)
    # -------------------------------------------------------------
    # Step 2.1: Analyze Incident 2
    analysis_2 = await orchestrator.analyze_incident(incident2_data)
    assert analysis_2.assessed_severity.value == "HIGH"
    incident2_data["analysis"] = analysis_2.model_dump(mode="json")

    # Step 2.2: Generate recommendation with Hindsight Recall
    adaptive_recommendation = await orchestrator.generate_recommendation(incident2_data)

    # -------------------------------------------------------------
    # VERIFICATION: Prove that the agent learned from Incident 1!
    # -------------------------------------------------------------
    # 1. Experiences recalled
    assert len(adaptive_recommendation.recalled_experiences) > 0, "No past memories recalled!"
    top_memory = adaptive_recommendation.recalled_experiences[0]
    assert top_memory.source_incident_id == "INC-2026-001"
    assert top_memory.similarity_score > 0.5

    # 2. Past root-cause context was surfaced
    assert "Password authentication" in top_memory.past_root_cause or "sshd_config" in top_memory.past_root_cause

    # 3. Actions explicitly incorporated lessons learned
    actions_text = " ".join(adaptive_recommendation.recommended_actions)
    assert "CRITICAL AUDIT" in actions_text
    assert "PREVENTION RUNBOOK" in actions_text
    assert "Ansible" in actions_text or "PasswordAuthentication" in actions_text

    # 4. Rationale demonstrates learning
    assert "Hindsight memory recall" in adaptive_recommendation.rationale
    assert adaptive_recommendation.confidence > cold_recommendation.confidence
