from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import IncidentModel
from app.schemas.incident import (
    IncidentCreate,
    IncidentUpdate,
    IncidentStatus,
    IncidentResolution,
    IncidentPostMortem,
    IncidentResponse,
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
