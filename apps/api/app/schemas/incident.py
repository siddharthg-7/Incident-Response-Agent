from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class IncidentStatus(str, Enum):
    NEW = "NEW"
    ANALYZING = "ANALYZING"
    ANALYZED = "ANALYZED"
    RECOMMENDATION_READY = "RECOMMENDATION_READY"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    POSTMORTEM_COMPLETE = "POSTMORTEM_COMPLETE"


class RecalledExperience(BaseModel):
    """Past incident experience recalled from Hindsight memory."""
    source_incident_id: str
    title: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    past_root_cause: Optional[str] = None
    past_actions_taken: List[str] = Field(default_factory=list)
    past_outcome: Optional[str] = None
    lesson_learned: Optional[str] = None


class IncidentAnalysis(BaseModel):
    """Structured AI analysis of an incident."""
    summary: str
    attack_vector: Optional[str] = None
    potential_impact: Optional[str] = None
    tactics: List[str] = Field(default_factory=list)
    extracted_iocs: List[str] = Field(default_factory=list)
    assessed_severity: Severity
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    analyzed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentRecommendation(BaseModel):
    """Context-aware response recommendation synthesized from evidence + Hindsight memory."""
    recommended_actions: List[str] = Field(default_factory=list)
    rationale: str
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    recalled_experiences: List[RecalledExperience] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentResolution(BaseModel):
    """Resolution details recorded by SOC analyst."""
    actions_taken: List[str] = Field(default_factory=list)
    outcome: str
    resolved_by: str = "soc_analyst"
    resolved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentPostMortem(BaseModel):
    """Post-mortem analysis capturing root cause and long-term lessons learned."""
    root_cause: str
    lessons_learned: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentBase(BaseModel):
    title: str
    description: str
    incident_type: str = "general"
    severity: Severity = Severity.MEDIUM
    source: Optional[str] = None
    target: Optional[str] = None
    indicators: List[str] = Field(default_factory=list)
    evidence: Dict[str, Any] = Field(default_factory=dict)


class IncidentCreate(IncidentBase):
    id: Optional[str] = None


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[Severity] = None
    status: Optional[IncidentStatus] = None
    source: Optional[str] = None
    target: Optional[str] = None
    indicators: Optional[List[str]] = None
    evidence: Optional[Dict[str, Any]] = None


class IncidentResponse(IncidentBase):
    id: str
    status: IncidentStatus = IncidentStatus.NEW
    detected_at: datetime
    created_at: datetime
    updated_at: datetime
    analysis: Optional[IncidentAnalysis] = None
    recommendation: Optional[IncidentRecommendation] = None
    resolution: Optional[IncidentResolution] = None
    postmortem: Optional[IncidentPostMortem] = None

    model_config = {"from_attributes": True}
