import json
import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.hindsight.base import BaseHindsightAdapter
from app.hindsight.mock_adapter import MockHindsightAdapter
from app.hindsight.client_adapter import HindsightClientAdapter
from app.schemas.incident import RecalledExperience

logger = logging.getLogger(__name__)


class HindsightService:
    """Core memory service providing outcome-oriented recall and retain for Sentinel Agent."""

    def __init__(self, adapter: Optional[BaseHindsightAdapter] = None):
        if adapter is not None:
            self.adapter = adapter
        elif settings.HINDSIGHT_MODE == "client":
            self.adapter = HindsightClientAdapter(
                base_url=settings.HINDSIGHT_BASE_URL,
                api_key=settings.HINDSIGHT_API_KEY
            )
        else:
            self.adapter = MockHindsightAdapter()

        self.bank_id = settings.HINDSIGHT_BANK_ID

    def format_experience_capsule(
        self,
        incident_data: Dict[str, Any],
        postmortem_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Construct a structured, outcome-oriented experience text for Hindsight retention."""
        resolution = incident_data.get("resolution") or {}
        postmortem = postmortem_data or incident_data.get("postmortem") or {}
        analysis = incident_data.get("analysis") or {}

        actions = resolution.get("actions_taken", [])
        if isinstance(actions, list):
            actions_str = "; ".join(str(a) for a in actions)
        else:
            actions_str = str(actions)

        capsule = (
            f"INCIDENT: {incident_data.get('id', 'UNKNOWN')} - {incident_data.get('title', '')}\n"
            f"TYPE: {incident_data.get('incident_type', 'general')} | SEVERITY: {incident_data.get('severity', 'UNKNOWN')}\n"
            f"SOURCE: {incident_data.get('source', 'N/A')} -> TARGET: {incident_data.get('target', 'N/A')}\n"
            f"INDICATORS: {', '.join(incident_data.get('indicators', []))}\n"
            f"ANALYSIS SUMMARY: {analysis.get('summary', incident_data.get('description', ''))}\n"
            f"ROOT CAUSE: {postmortem.get('root_cause', 'Under investigation')}\n"
            f"RESPONSE ACTIONS TAKEN: {actions_str}\n"
            f"OUTCOME: {resolution.get('outcome', 'Resolved')}\n"
            f"LESSONS LEARNED: {postmortem.get('lessons_learned', 'Standard runbook applied')}\n"
        )
        return capsule

    async def retain_incident_experience(
        self,
        incident_data: Dict[str, Any],
        postmortem_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Retain an incident experience into Hindsight memory."""
        capsule_text = self.format_experience_capsule(incident_data, postmortem_data)
        
        resolution = incident_data.get("resolution") or {}
        postmortem = postmortem_data or incident_data.get("postmortem") or {}
        
        metadata = {
            "incident_id": incident_data.get("id"),
            "title": incident_data.get("title"),
            "incident_type": incident_data.get("incident_type"),
            "severity": incident_data.get("severity"),
            "root_cause": postmortem.get("root_cause"),
            "actions_taken": resolution.get("actions_taken", []),
            "outcome": resolution.get("outcome"),
            "lessons_learned": postmortem.get("lessons_learned")
        }

        result = await self.adapter.retain(
            bank_id=self.bank_id,
            content=capsule_text,
            metadata=metadata
        )
        logger.info(f"Retained incident {incident_data.get('id')} to Hindsight bank {self.bank_id}")
        return result

    async def recall_similar_incidents(
        self,
        incident_context: str,
        query: str,
        limit: int = 3
    ) -> List[RecalledExperience]:
        """Recall relevant past experiences given current incident context and search terms."""
        combined_query = f"{query} {incident_context}".strip()
        raw_matches = await self.adapter.recall(
            bank_id=self.bank_id,
            query=combined_query,
            limit=limit
        )

        recalled = []
        for match in raw_matches:
            meta = match.get("metadata", {})
            content = match.get("content", "")
            
            # Extract root cause and lessons from metadata or text
            root_cause = meta.get("root_cause")
            outcome = meta.get("outcome")
            lessons = meta.get("lessons_learned")
            actions = meta.get("actions_taken", [])
            incident_id = meta.get("incident_id") or match.get("id", "HISTORICAL")
            title = meta.get("title") or "Historical Incident"

            recalled.append(RecalledExperience(
                source_incident_id=incident_id,
                title=title,
                similarity_score=float(match.get("score", 0.8)),
                past_root_cause=root_cause,
                past_actions_taken=actions if isinstance(actions, list) else [str(actions)],
                past_outcome=outcome,
                lesson_learned=lessons
            ))

        return recalled

    async def health_check(self) -> Dict[str, Any]:
        """Check memory engine connectivity."""
        return await self.adapter.health_check()


# Global singleton instance for service access
_default_hindsight_service: Optional[HindsightService] = None


def get_hindsight_service() -> HindsightService:
    global _default_hindsight_service
    if _default_hindsight_service is None:
        _default_hindsight_service = HindsightService()
    return _default_hindsight_service
