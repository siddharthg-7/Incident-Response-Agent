from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.incident import (
    RecalledExperience,
    LearningEvent,
    MemoryRecallRequest,
)
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/api/memory", tags=["Memory Bank"])


def get_incident_service(db: AsyncSession = Depends(get_db)) -> IncidentService:
    return IncidentService(db=db)


@router.get("", response_model=List[RecalledExperience])
async def get_memory_bank_items(
    service: IncidentService = Depends(get_incident_service)
):
    """Retrieve all retained experience capsules in the Hindsight memory bank."""
    return await service.get_all_retained_memories()


@router.get("/timeline", response_model=List[LearningEvent])
async def get_learning_timeline(
    service: IncidentService = Depends(get_incident_service)
):
    """Retrieve the chronological learning timeline showing retained post-mortems and subsequent recall matches."""
    return await service.get_learning_timeline()


@router.post("/recall", response_model=List[RecalledExperience])
async def recall_memories(
    payload: MemoryRecallRequest,
    service: IncidentService = Depends(get_incident_service)
):
    """Ad-hoc semantic query against Hindsight memory bank."""
    return await service.recall_memories_for_query(
        query=payload.query,
        context=payload.context,
        limit=payload.limit
    )
