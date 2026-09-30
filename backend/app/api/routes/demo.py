from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.incident import DemoResetResponse
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/api/demo", tags=["Demo Management"])


def get_incident_service(db: AsyncSession = Depends(get_db)) -> IncidentService:
    return IncidentService(db=db)


@router.post("/reset", response_model=DemoResetResponse)
async def reset_demo_state(
    service: IncidentService = Depends(get_incident_service)
):
    """Restore the deterministic Golden Path demo state (INC-2026-001, INC-2026-002, INC-2026-003)."""
    return await service.reset_demo_data()
