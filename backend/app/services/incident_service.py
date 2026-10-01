from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid
import json
from pathlib import Path
from sqlalchemy import select, delete
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import IncidentModel
from app.schemas.incident import (
    ActionStatus,
    IncidentCreate,
    IncidentUpdate,
    IncidentStatus,
    IncidentResolution,
    IncidentPostMortem,
    IncidentResponse,
    RecalledExperience,
    LearningEvent,
    DemoResetResponse,
)
from app.agents.orchestrator import SentinelOrchestrator


class IncidentService:
    """Business service managing incident persistence, lifecycle transitions, and agent workflows."""

    def __init__(self, db: AsyncSession, orchestrator: Optional[SentinelOrchestrator] = None):
        self.db = db
        self.orchestrator = orchestrator or SentinelOrchestrator()

    async def create_incident(self, payload: IncidentCreate) -> IncidentModel:
        incident_id = payload.id or f"INC-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now(timezone.utc)
        
        incident = IncidentModel(
            id=incident_id,
            title=payload.title,
            description=payload.description,
            incident_type=payload.incident_type,
            severity=payload.severity.value if hasattr(payload.severity, "value") else str(payload.severity),
            status=IncidentStatus.NEW.value,
            source=payload.source,
            target=payload.target,
            analyst_assigned=payload.analyst_assigned or "soc_lead_analyst",
            indicators=payload.indicators,
            evidence=payload.evidence,
            detected_at=now,
            created_at=now,
            updated_at=now
        )
        self.db.add(incident)
        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def get_incident(self, incident_id: str) -> Optional[IncidentModel]:
        stmt = select(IncidentModel).where(IncidentModel.id == incident_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_incidents(
        self,
        status: Optional[str] = None,
        severity: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[IncidentModel]:
        stmt = select(IncidentModel)
        if status:
            stmt = stmt.where(IncidentModel.status == status)
        if severity:
            stmt = stmt.where(IncidentModel.severity == severity)
        stmt = stmt.order_by(IncidentModel.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def analyze_incident(self, incident_id: str) -> IncidentModel:
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident_dict = {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "incident_type": incident.incident_type,
            "severity": incident.severity,
            "source": incident.source,
            "target": incident.target,
            "indicators": incident.indicators,
            "evidence": incident.evidence
        }
        analysis = await self.orchestrator.analyze_incident(incident_dict)
        
        incident.analysis = analysis.model_dump(mode="json")
        incident.status = IncidentStatus.ANALYZED.value
        incident.updated_at = datetime.now(timezone.utc)
        
        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def recommend_incident(self, incident_id: str) -> IncidentModel:
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident_dict = {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "incident_type": incident.incident_type,
            "severity": incident.severity,
            "source": incident.source,
            "target": incident.target,
            "indicators": incident.indicators,
            "evidence": incident.evidence,
            "analysis": incident.analysis
        }
        recommendation = await self.orchestrator.generate_recommendation(incident_dict)

        incident.recommendation = recommendation.model_dump(mode="json")
        incident.status = IncidentStatus.RECOMMENDATION_READY.value
        incident.updated_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def resolve_incident(self, incident_id: str, resolution: IncidentResolution) -> IncidentModel:
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident.resolution = resolution.model_dump(mode="json")
        incident.status = IncidentStatus.RESOLVED.value
        incident.updated_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def add_postmortem(self, incident_id: str, postmortem: IncidentPostMortem) -> IncidentModel:
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident.postmortem = postmortem.model_dump(mode="json")
        incident.status = IncidentStatus.POSTMORTEM_COMPLETE.value
        incident.updated_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def update_action_status(
        self,
        incident_id: str,
        action_id: str,
        new_status: Any
    ) -> IncidentModel:
        """Update the approval or execution status of a specific response action."""
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        if not incident.recommendation or "detailed_actions" not in incident.recommendation:
            raise ValueError(f"Incident {incident_id} has no recommendation with detailed actions")

        rec = dict(incident.recommendation)
        detailed_actions = list(rec.get("detailed_actions", []))
        
        status_str = new_status.value if hasattr(new_status, "value") else str(new_status)
        found = False
        for act in detailed_actions:
            if act.get("id") == action_id:
                act["status"] = status_str
                found = True
                break

        if not found:
            raise ValueError(f"Action {action_id} not found in recommendation for incident {incident_id}")

        rec["detailed_actions"] = detailed_actions
        incident.recommendation = rec
        flag_modified(incident, "recommendation")
        incident.updated_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def assign_analyst(self, incident_id: str, analyst: str) -> IncidentModel:
        """Assign or reassign an analyst to lead the incident investigation."""
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident.analyst_assigned = analyst
        incident.updated_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def update_incident(self, incident_id: str, payload: IncidentUpdate) -> IncidentModel:
        """Apply general property updates to an incident."""
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None and hasattr(incident, field):
                if field == "status" and hasattr(value, "value"):
                    setattr(incident, field, value.value)
                elif field == "severity" and hasattr(value, "value"):
                    setattr(incident, field, value.value)
                else:
                    setattr(incident, field, value)

        incident.updated_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def generate_postmortem(self, incident_id: str) -> IncidentModel:
        """Automatically synthesize an outcome-oriented post-mortem from incident lifecycle artifacts."""
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        analysis = incident.analysis or {}
        res = incident.resolution or {}

        what_happened = (
            incident.description
            or analysis.get("investigation_summary")
            or f"Security incident {incident.id} involving {incident.incident_type}."
        )
        root_cause = (
            analysis.get("suspected_root_cause")
            or f"Vulnerability in {incident.incident_type} exposed service allowed unauthorized traffic."
        )
        actions = res.get("actions_taken", [])
        what_was_done = "; ".join(actions) if actions else "Containment and security baseline enforcement executed."
        what_worked = "Perimeter containment rule and prompt verification prevented unauthorized breach."
        what_did_not_work = "Automated preventive guardrails did not trigger prior to threat threshold breach."
        final_outcome = res.get("outcome") or "Threat neutralized with zero credential compromise."
        lessons_learned = (
            "Enforce automated compliance checks across infrastructure nodes and configure immediate perimeter rate-limiting."
        )

        pm = IncidentPostMortem(
            what_happened=what_happened,
            root_cause=root_cause,
            what_was_done=what_was_done,
            what_worked=what_worked,
            what_did_not_work=what_did_not_work,
            final_outcome=final_outcome,
            lessons_learned=lessons_learned,
            completed_at=datetime.now(timezone.utc)
        )
        return await self.add_postmortem(incident_id, pm)

    async def learn_incident(self, incident_id: str) -> Dict[str, Any]:
        """Commit the resolved incident and post-mortem into Hindsight memory."""
        incident = await self.get_incident(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        incident_dict = {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "incident_type": incident.incident_type,
            "severity": incident.severity,
            "source": incident.source,
            "target": incident.target,
            "indicators": incident.indicators,
            "analysis": incident.analysis,
            "resolution": incident.resolution,
            "postmortem": incident.postmortem
        }
        result = await self.orchestrator.retain_incident(incident_dict, incident.postmortem)
        return result

    async def get_all_retained_memories(self) -> List[RecalledExperience]:
        """Retrieve all retained memories by inspecting incidents with completed post-mortems."""
        stmt = select(IncidentModel).where(IncidentModel.postmortem.isnot(None)).order_by(IncidentModel.updated_at.desc())
        result = await self.db.execute(stmt)
        incidents = result.scalars().all()

        memories: List[RecalledExperience] = []
        for inc in incidents:
            pm = inc.postmortem or {}
            res = inc.resolution or {}
            memories.append(RecalledExperience(
                source_incident_id=inc.id,
                title=inc.title,
                similarity_score=1.0,
                relevance_label="Hindsight Retained Capsule (100%)",
                what_happened=inc.description,
                past_root_cause=pm.get("root_cause", "Under investigation"),
                past_actions_taken=res.get("actions_taken", []),
                past_outcome=res.get("outcome") or pm.get("final_outcome", "Resolved"),
                lesson_learned=pm.get("lessons_learned", "Standard runbook applied"),
                incident_pattern=inc.incident_type,
                timestamp=inc.updated_at
            ))
        return memories

    async def get_learning_timeline(self) -> List[LearningEvent]:
        """Construct the chronological learning timeline showing retained post-mortems and subsequent recall matches."""
        stmt = select(IncidentModel).order_by(IncidentModel.created_at.asc())
        result = await self.db.execute(stmt)
        all_incidents = list(result.scalars().all())

        timeline: List[LearningEvent] = []
        event_num = 1
        for inc in all_incidents:
            if inc.postmortem:
                pm = inc.postmortem
                res = inc.resolution or {}
                
                # Check which subsequent incidents recalled this incident
                matched_subsequent: List[str] = []
                for other in all_incidents:
                    if other.id != inc.id and other.recommendation:
                        recalled = other.recommendation.get("recalled_experiences", [])
                        for r in recalled:
                            if r.get("source_incident_id") == inc.id and other.id not in matched_subsequent:
                                matched_subsequent.append(other.id)

                timeline.append(LearningEvent(
                    id=f"LRN-{event_num:03d}",
                    incident_id=inc.id,
                    title=f"{inc.title} - Lessons Retained",
                    attack_type=inc.incident_type,
                    trigger_event="Post-Mortem Retained in Hindsight",
                    retained_memory_id=f"mem_{inc.id.lower().replace('-', '_')}",
                    timestamp=inc.updated_at or inc.created_at,
                    root_cause=pm.get("root_cause", "Identified in post-mortem"),
                    outcome_summary=res.get("outcome", "Resolved and verified"),
                    lessons_learned=pm.get("lessons_learned", "Prevention guideline established"),
                    matched_subsequent_incidents=matched_subsequent if matched_subsequent else None
                ))
                event_num += 1

        return timeline

    async def recall_memories_for_query(
        self,
        query: str,
        context: Optional[str] = None,
        limit: int = 5
    ) -> List[RecalledExperience]:
        """Query Hindsight memory bank directly for matching historical experiences."""
        return await self.orchestrator.hindsight_service.recall_similar_incidents(
            incident_context=context or "general security alert",
            query=query,
            limit=limit
        )

    async def reset_demo_data(self) -> DemoResetResponse:
        """Reset and restore deterministic demo scenarios (INC-2026-001, INC-2026-002, INC-2026-003)."""
        demo_ids = ["INC-2026-001", "INC-2026-002", "INC-2026-003"]
        await self.db.execute(delete(IncidentModel).where(IncidentModel.id.in_(demo_ids)))
        await self.db.commit()

        # Locate scenarios directory
        root_dir = Path(__file__).resolve().parent.parent.parent.parent
        scenarios_dir = root_dir / "data" / "scenarios"
        scenario_files = [
            scenarios_dir / "incident_01_ssh_brute_force.json",
            scenarios_dir / "incident_02_ssh_brute_force_variant.json",
            scenarios_dir / "incident_03_credential_stuffing.json",
        ]

        seeded_ids: List[str] = []
        for s_file in scenario_files:
            if not s_file.exists():
                continue
            with open(s_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            incident = IncidentModel(
                id=data["id"],
                title=data["title"],
                description=data["description"],
                incident_type=data.get("incident_type", "general"),
                severity=data.get("severity", "MEDIUM"),
                status=data.get("status", "NEW"),
                source=data.get("source"),
                target=data.get("target"),
                analyst_assigned=data.get("analyst_assigned", "soc_lead_analyst"),
                indicators=data.get("indicators", []),
                evidence=data.get("evidence", {}),
                analysis=data.get("analysis"),
                recommendation=data.get("recommendation"),
                resolution=data.get("resolution"),
                postmortem=data.get("postmortem"),
            )
            self.db.add(incident)
            seeded_ids.append(incident.id)

        await self.db.commit()
        return DemoResetResponse(
            status="success",
            message=f"Successfully reset and seeded {len(seeded_ids)} demo scenarios.",
            incidents_reset=seeded_ids
        )

