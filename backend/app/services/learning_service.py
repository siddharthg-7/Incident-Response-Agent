from typing import Any, Dict, Optional
from app.hindsight.service import HindsightService, get_hindsight_service


class LearningService:
    """Service committing resolved incident experiences and post-mortem findings into Hindsight memory."""

    def __init__(self, hindsight_service: HindsightService = None):
        self.hindsight_service = hindsight_service or get_hindsight_service()

    async def retain_experience(
        self,
        incident_data: Dict[str, Any],
        postmortem_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        return await self.hindsight_service.retain_incident_experience(
            incident_data=incident_data,
            postmortem_data=postmortem_data
        )
