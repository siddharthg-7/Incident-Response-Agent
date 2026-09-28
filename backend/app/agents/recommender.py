import logging
from typing import Any, Dict, List
from app.schemas.incident import IncidentRecommendation, RecalledExperience

logger = logging.getLogger(__name__)


class ResponsePlanner:
    """Synthesizes recommendations by combining live incident evidence with recalled Hindsight experiences."""

    def __init__(self, provider: str = "mock"):
        self.provider = provider

    async def plan_response(
        self,
        incident_data: Dict[str, Any],
        recalled_experiences: List[RecalledExperience]
    ) -> IncidentRecommendation:
        """Generate response recommendation enriched with lessons from past incidents."""
        source = incident_data.get("source", "untrusted source")
        target = incident_data.get("target", "target host")
        inc_type = incident_data.get("incident_type", "general")

        # Baseline recommendations (Without Memory)
        recommended_actions = [
            f"Apply immediate perimeter firewall DROP rule for traffic from {source}",
            f"Inspect live auth logs on {target} for any established sessions",
            "Monitor perimeter telemetry for rotating IP subnets"
        ]

        # Check if we have relevant past experiences recalled from Hindsight
        if recalled_experiences:
            # Memory-enriched adaptive recommendations (With Memory!)
            top_memory = recalled_experiences[0]
            
            # Incorporate past root-cause warnings and lessons learned
            if top_memory.past_root_cause:
                recommended_actions.insert(
                    1,
                    f"CRITICAL AUDIT: Check service configuration on {target} immediately. "
                    f"In prior incident {top_memory.source_incident_id}, root cause was: {top_memory.past_root_cause}"
                )

            if top_memory.lesson_learned:
                recommended_actions.append(
                    f"PREVENTION RUNBOOK: Apply lesson learned from {top_memory.source_incident_id}: "
                    f"{top_memory.lesson_learned}"
                )

            rationale = (
                f"Recommendation enriched by Hindsight memory recall (Match: {top_memory.source_incident_id}, "
                f"similarity: {top_memory.similarity_score:.0%}). "
                f"Historical incident experienced identical attack pattern. Prior resolution succeeded by "
                f"addressing root cause ({top_memory.past_root_cause}) and preventing recurrence."
            )
            confidence = 0.94
        else:
            # Generic cold recommendation
            rationale = (
                "Baseline recommendation generated from current indicators without prior memory match. "
                "Standard perimeter containment runbook suggested."
            )
            confidence = 0.75

        return IncidentRecommendation(
            recommended_actions=recommended_actions,
            rationale=rationale,
            confidence=confidence,
            recalled_experiences=recalled_experiences
        )
