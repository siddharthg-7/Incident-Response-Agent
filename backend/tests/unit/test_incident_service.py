import pytest
from app.services.incident_service import IncidentService
from app.schemas.incident import (
    IncidentCreate,
    IncidentResolution,
    IncidentPostMortem,
    Severity,
    IncidentStatus
)
from tests.conftest import TestingSessionLocal


@pytest.mark.asyncio
async def test_incident_service_full_lifecycle(mock_hindsight):
    async with TestingSessionLocal() as session:
        service = IncidentService(db=session)
        service.orchestrator.hindsight_service = mock_hindsight

        # 1. Create incident
        payload = IncidentCreate(
            id="INC-UNIT-001",
            title="SSH Attack on Web Server",
            description="Continuous failed passwords",
            incident_type="ssh_brute_force",
            severity=Severity.HIGH,
            source="198.51.100.77",
            target="web-prod-01",
            indicators=["198.51.100.77", "root"]
        )
        incident = await service.create_incident(payload)
        assert incident.id == "INC-UNIT-001"
        assert incident.status == IncidentStatus.NEW.value

        # 2. Get incident
        fetched = await service.get_incident("INC-UNIT-001")
        assert fetched is not None
        assert fetched.title == payload.title

        # 3. List incidents
        incidents = await service.list_incidents(status=IncidentStatus.NEW.value)
        assert len(incidents) >= 1
        filtered = await service.list_incidents(severity="CRITICAL")
        assert len(filtered) == 0

        # 4. Analyze incident
        analyzed = await service.analyze_incident("INC-UNIT-001")
        assert analyzed.status == IncidentStatus.ANALYZED.value
        assert analyzed.analysis is not None

        # 5. Recommend response
        recommended = await service.recommend_incident("INC-UNIT-001")
        assert recommended.status == IncidentStatus.RECOMMENDATION_READY.value
        assert recommended.recommendation is not None

        # 6. Resolve incident
        res_payload = IncidentResolution(
            actions_taken=["Blocked IP 198.51.100.77", "Audited root login"],
            outcome="Attack thwarted",
            resolved_by="lead_analyst"
        )
        resolved = await service.resolve_incident("INC-UNIT-001", res_payload)
        assert resolved.status == IncidentStatus.RESOLVED.value
        assert resolved.resolution["outcome"] == "Attack thwarted"

        # 7. Add post-mortem
        pm_payload = IncidentPostMortem(
            root_cause="Default password on backup account",
            lessons_learned="Rotate passwords and disable password auth"
        )
        postmortem_done = await service.add_postmortem("INC-UNIT-001", pm_payload)
        assert postmortem_done.status == IncidentStatus.POSTMORTEM_COMPLETE.value

        # 8. Retain in memory (Learn)
        learn_res = await service.learn_incident("INC-UNIT-001")
        assert learn_res["status"] == "retained"

        # 9. Verify get_all_retained_memories
        memories = await service.get_all_retained_memories()
        assert len(memories) >= 1
        assert memories[0].source_incident_id == "INC-UNIT-001"
        assert "Default password" in memories[0].past_root_cause

        # 10. Verify get_learning_timeline
        timeline = await service.get_learning_timeline()
        assert len(timeline) >= 1
        assert timeline[0].incident_id == "INC-UNIT-001"


@pytest.mark.asyncio
async def test_incident_service_errors():
    async with TestingSessionLocal() as session:
        service = IncidentService(db=session)

        # Non-existent incident actions should raise ValueError
        with pytest.raises(ValueError, match="Incident NON-EXISTENT not found"):
            await service.analyze_incident("NON-EXISTENT")

        with pytest.raises(ValueError, match="Incident NON-EXISTENT not found"):
            await service.recommend_incident("NON-EXISTENT")

        with pytest.raises(ValueError, match="Incident NON-EXISTENT not found"):
            await service.resolve_incident("NON-EXISTENT", IncidentResolution(actions_taken=[], outcome=""))

        with pytest.raises(ValueError, match="Incident NON-EXISTENT not found"):
            await service.add_postmortem("NON-EXISTENT", IncidentPostMortem(root_cause="", lessons_learned=""))

        with pytest.raises(ValueError, match="Incident NON-EXISTENT not found"):
            await service.learn_incident("NON-EXISTENT")
