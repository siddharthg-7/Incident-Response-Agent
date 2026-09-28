from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HindsightMemoryRecord(BaseModel):
    """Schema for memories stored in Hindsight."""
    id: str
    bank_id: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    score: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HindsightRecallQuery(BaseModel):
    """Schema for recall queries to Hindsight."""
    query: str
    limit: int = 5
    bank_id: Optional[str] = None


class HindsightRetainRequest(BaseModel):
    """Schema for retaining information into Hindsight."""
    content: str
    metadata: Optional[Dict[str, Any]] = None
    bank_id: Optional[str] = None
