from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.hindsight.service import get_hindsight_service

router = APIRouter(tags=["System"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint validating database and Hindsight memory service availability."""
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"

    hindsight_service = get_hindsight_service()
    hindsight_status = await hindsight_service.health_check()

    return {
        "status": "healthy" if db_status == "connected" and hindsight_status.get("status") in ("healthy", "connected") else "degraded",
        "version": "0.1.0",
        "database": db_status,
        "hindsight": hindsight_status
    }
