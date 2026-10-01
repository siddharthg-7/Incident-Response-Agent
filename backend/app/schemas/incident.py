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


class ActionStatus(str, Enum):
    RECOMMENDED = "RECOMMENDED"
    APPROVED = "APPROVED"
    EXECUTED = "EXECUTED"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ResponseAction(BaseModel):
    """Detailed response action with approval requirement, risk level, and rationale."""
    id: str
    action: str
    reason: str
    status: ActionStatus = ActionStatus.RECOMMENDED
    risk_level: RiskLevel = RiskLevel.LOW
    requires_approval: bool = True
    category: Optional[str] = "containment"


class RecalledExperience(BaseModel):
    """Past incident experience recalled from Hindsight memory."""
    source_incident_id: str
    title: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    past_root_cause: Optional[str] = None
    past_actions_taken: List[str] = Field(default_factory=list)
    past_outcome: Optional[str] = None
    lesson_learned: Optional[str] = None
    incident_pattern: Optional[str] = None
    relevance_label: Optional[str] = None
    what_happened: Optional[str] = None
    timestamp: Optional[datetime] = None


class IncidentAnalysis(BaseModel):
    """Structured AI analysis of an incident."""
    classification: Optional[str] = None
    suspected_root_cause: Optional[str] = None
    investigation_summary: Optional[str] = None
    evidence_summary: List[str] = Field(default_factory=list)
    summary: str
    attack_vector: Optional[str] = None
    potential_impact: Optional[str] = None
    tactics: List[str] = Field(default_factory=list)
    extracted_iocs: List[str] = Field(default_factory=list)
    assessed_severity: Optional[Severity] = Severity.MEDIUM
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    analyzed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentRecommendation(BaseModel):
    """Context-aware response recommendation synthesized from evidence + Hindsight memory."""
    recommended_response: Optional[str] = None
    why_this_response: Optional[str] = None
    memory_influence: Optional[str] = None
    expected_objective: Optional[str] = None
    potential_risks: Optional[str] = None
    recommended_actions: List[str] = Field(default_factory=list)
    detailed_actions: List[ResponseAction] = Field(default_factory=list)
    rationale: str
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    recalled_experiences: List[RecalledExperience] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentResolution(BaseModel):
    """Resolution details recorded by SOC analyst."""
    status: Optional[IncidentStatus] = IncidentStatus.RESOLVED
    actions_taken: List[str] = Field(default_factory=list)
    outcome: str
    notes: Optional[str] = None
    resolved_by: str = "soc_analyst"
    resolved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentPostMortem(BaseModel):
    """Post-mortem analysis capturing root cause and long-term lessons learned."""
    what_happened: Optional[str] = None
    root_cause: str
    what_was_done: Optional[str] = None
    what_worked: Optional[str] = None
    what_did_not_work: Optional[str] = None
    final_outcome: Optional[str] = None
    lessons_learned: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IncidentBase(BaseModel):
    title: str
    description: str
    incident_type: str = "general"
    severity: Severity = Severity.MEDIUM
    source: Optional[str] = None
    target: Optional[str] = None
    analyst_assigned: Optional[str] = "soc_lead_analyst"
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
    analyst_assigned: Optional[str] = None
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


class LearningEvent(BaseModel):
    """Timeline event showing empirical agent evolution from resolved incident post-mortems."""
    id: str
    incident_id: str
    title: str
    attack_type: str
    trigger_event: str
    retained_memory_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    root_cause: str
    outcome_summary: str
    lessons_learned: str
    matched_subsequent_incidents: Optional[List[str]] = None


class MemoryRecallRequest(BaseModel):
    """Request payload for ad-hoc semantic search against Hindsight memory bank."""
    query: str
    context: Optional[str] = None
    limit: int = Field(default=5, ge=1, le=20)


class DemoResetResponse(BaseModel):
    """Confirmation payload returned after restoring deterministic demo seed state."""
    status: str = "success"
    message: str
    incidents_reset: List[str] = Field(default_factory=list)

