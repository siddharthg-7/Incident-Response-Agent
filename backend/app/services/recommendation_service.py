from typing import Any, Dict
from app.agents.incident_agent.orchestrator import SentinelOrchestrator
from app.schemas.incident import IncidentRecommendation


class RecommendationService:
    """Service synthesizing context-aware recommendations via Hindsight memory recall."""

    def __init__(self, orchestrator: SentinelOrchestrator = None):
        self.orchestrator = orchestrator or SentinelOrchestrator()

    async def get_recommendation(self, incident_data: Dict[str, Any]) -> IncidentRecommendation:
        return await self.orchestrator.generate_recommendation(incident_data)
