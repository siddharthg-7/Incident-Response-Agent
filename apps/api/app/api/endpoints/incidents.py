from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentResolution,
    IncidentPostMortem,
    RecalledExperience
)
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


def get_incident_service(db: AsyncSession = Depends(get_db)) -> IncidentService:
    return IncidentService(db=db)


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    payload: IncidentCreate,
    service: IncidentService = Depends(get_incident_service)
):
    """Register a new incoming security incident."""
    incident = await service.create_incident(payload)
    return incident


@router.get("", response_model=List[IncidentResponse])
async def list_incidents(
    status: Optional[str] = Query(None, description="Filter by status"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: IncidentService = Depends(get_incident_service)
):
    """List registered incidents with optional filtering."""
    incidents = await service.list_incidents(status=status, severity=severity, limit=limit, offset=offset)
    return incidents


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: str,
    service: IncidentService = Depends(get_incident_service)
):
    """Retrieve full incident details."""
    incident = await service.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return incident


@router.post("/{incident_id}/analyze", response_model=IncidentResponse)
async def analyze_incident(
    incident_id: str,
    service: IncidentService = Depends(get_incident_service)
):
    """Trigger AI analysis to classify threat and extract indicators."""
    try:
        return await service.analyze_incident(incident_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/{incident_id}/recommend", response_model=IncidentResponse)
async def recommend_incident_response(
    incident_id: str,
    service: IncidentService = Depends(get_incident_service)
):
    """Execute Hindsight recall against past incidents and synthesize recommended response."""
    try:
        return await service.recommend_incident(incident_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/{incident_id}/memory", response_model=List[RecalledExperience])
async def get_incident_memory_matches(
    incident_id: str,
    service: IncidentService = Depends(get_incident_service)
):
    """View Hindsight memory matches and similarity scores for an incident."""
    incident = await service.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    query = f"{incident.title} {incident.description} {' '.join(incident.indicators or [])}"
    experiences = await service.orchestrator.hindsight_service.recall_similar_incidents(
        incident_context=f"type: {incident.incident_type}",
        query=query,
        limit=5
    )
    return [e for e in experiences if e.source_incident_id != incident_id]


@router.post("/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: str,
    payload: IncidentResolution,
    service: IncidentService = Depends(get_incident_service)
):
    """Record containment and remediation actions executed by SOC analyst."""
    try:
        return await service.resolve_incident(incident_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/{incident_id}/postmortem", response_model=IncidentResponse)
async def add_incident_postmortem(
    incident_id: str,
    payload: IncidentPostMortem,
    service: IncidentService = Depends(get_incident_service)
):
    """Record root-cause analysis and lessons learned from the incident."""
    try:
        return await service.add_postmortem(incident_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/{incident_id}/learn")
async def learn_incident(
    incident_id: str,
    service: IncidentService = Depends(get_incident_service)
):
    """Commit resolved incident and post-mortem experience into Hindsight memory."""
    try:
        result = await service.learn_incident(incident_id)
        return {"status": "success", "detail": "Experience retained in Hindsight", "result": result}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
