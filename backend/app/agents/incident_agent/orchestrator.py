import logging
from typing import Any, Dict, List
from app.agents.analyzer.analyzer import IncidentAnalyzer
from app.agents.response_planner.planner import ResponsePlanner
from app.hindsight.service import HindsightService, get_hindsight_service
from app.schemas.incident import IncidentAnalysis, IncidentRecommendation, RecalledExperience

logger = logging.getLogger(__name__)


class SentinelOrchestrator:
    """Orchestrates Sentinel Memory agent operations: Detect -> Analyze -> Recall -> Recommend -> Retain."""

    def __init__(
        self,
        hindsight_service: HindsightService = None,
        analyzer: IncidentAnalyzer = None,
        recommender: ResponsePlanner = None
    ):
        self.hindsight_service = hindsight_service or get_hindsight_service()
        self.analyzer = analyzer or IncidentAnalyzer()
        self.recommender = recommender or ResponsePlanner()

    async def analyze_incident(self, incident_data: Dict[str, Any]) -> IncidentAnalysis:
        """Run AI analysis on incoming incident telemetry."""
        logger.info(f"Analyzing incident {incident_data.get('id')}")
        return await self.analyzer.analyze(incident_data)

    async def generate_recommendation(
        self,
        incident_data: Dict[str, Any]
    ) -> IncidentRecommendation:
        """Recall relevant past experiences from Hindsight and synthesize an informed response."""
        inc_id = incident_data.get("id")
        logger.info(f"Generating recommendation for incident {inc_id}")

        title = incident_data.get("title", "")
        desc = incident_data.get("description", "")
        indicators = " ".join(incident_data.get("indicators", []))
        query = f"{title} {desc} {indicators}"

        recalled_experiences: List[RecalledExperience] = await self.hindsight_service.recall_similar_incidents(
            incident_context=f"type: {incident_data.get('incident_type')} target: {incident_data.get('target')}",
            query=query,
            limit=3
        )

        filtered_memories = [m for m in recalled_experiences if m.source_incident_id != inc_id]

        recommendation = await self.recommender.plan_response(
            incident_data=incident_data,
            recalled_experiences=filtered_memories
        )

        return recommendation

    async def retain_incident(
        self,
        incident_data: Dict[str, Any],
        postmortem_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Commit an incident's resolution and post-mortem experience to Hindsight."""
        return await self.hindsight_service.retain_incident_experience(
            incident_data=incident_data,
            postmortem_data=postmortem_data
        )
