from typing import Any, Dict
from app.agents.analyzer.analyzer import IncidentAnalyzer
from app.schemas.incident import IncidentAnalysis


class AnalysisService:
    """Service handling incident threat classification and indicator extraction."""

    def __init__(self, analyzer: IncidentAnalyzer = None):
        self.analyzer = analyzer or IncidentAnalyzer()

    async def analyze(self, incident_data: Dict[str, Any]) -> IncidentAnalysis:
        return await self.analyzer.analyze(incident_data)
