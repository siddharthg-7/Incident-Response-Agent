from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, DateTime, JSON
from app.db.session import Base


class IncidentModel(Base):
    """SQLAlchemy model for persisting incidents and their complete lifecycle states."""
    __tablename__ = "incidents"

    id = Column(String(64), primary_key=True, default=lambda: f"INC-{uuid.uuid4().hex[:8].upper()}")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    incident_type = Column(String(64), nullable=False, default="general")
    severity = Column(String(32), nullable=False, default="MEDIUM")
    status = Column(String(32), nullable=False, default="NEW")
    
    source = Column(String(255), nullable=True)
    target = Column(String(255), nullable=True)
    analyst_assigned = Column(String(128), nullable=True, default="soc_lead_analyst")
    indicators = Column(JSON, default=list)
    evidence = Column(JSON, default=dict)

    
    analysis = Column(JSON, nullable=True)
    recommendation = Column(JSON, nullable=True)
    resolution = Column(JSON, nullable=True)
    postmortem = Column(JSON, nullable=True)
    
    detected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
