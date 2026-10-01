import logging
from typing import Any, Dict, List
from app.schemas.incident import (
    ActionStatus,
    IncidentRecommendation,
    RecalledExperience,
    ResponseAction,
    RiskLevel,
)

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

            recommended_response = (
                f"Block attacker source {source} at perimeter firewall, audit service configuration "
                f"on {target} to ensure hardened security baseline, and restrict service exposure to approved corporate CIDRs."
            )
            why_this_response = (
                f"Similar incidents were previously resolved using IP containment and configuration auditing. "
                f"In prior incident {top_memory.source_incident_id}, perimeter firewall drop combined with "
                f"hardened configuration completely neutralized the attack with zero session breach."
            )
            memory_influence = (
                f"Memory-informed recommendation based on recalled experience {top_memory.source_incident_id} "
                f"({int(top_memory.similarity_score * 100)}% Match)."
            )
            expected_objective = (
                "Immediately terminate external attack traffic, prevent credential compromise, and enforce baseline compliance."
            )
            potential_risks = (
                f"Low operational risk. Blocking {source} does not disrupt authorized corporate workflows."
            )

            detailed_actions = [
                ResponseAction(
                    id="ACT-01",
                    action=f"Apply perimeter firewall DROP rule for {source}",
                    reason="Immediately cuts off brute-force connection attempts at network edge",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=True,
                    category="containment",
                ),
                ResponseAction(
                    id="ACT-02",
                    action=f"Restrict access to {target} to authorized corporate VPN CIDR",
                    reason="Prevents untrusted external IP addresses from reaching service ports directly",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.MEDIUM,
                    requires_approval=True,
                    category="containment",
                ),
                ResponseAction(
                    id="ACT-03",
                    action=f"Audit service configuration on {target} to prevent configuration drift",
                    reason=f"Directly addresses root cause discovered in prior incident {top_memory.source_incident_id}",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=False,
                    category="eradication",
                ),
                ResponseAction(
                    id="ACT-04",
                    action=f"Review authentication and access logs on {target} for established sessions",
                    reason="Confirm no credentials were successfully compromised prior to containment",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=False,
                    category="audit",
                ),
                ResponseAction(
                    id="ACT-05",
                    action="Deploy automated compliance check and preventative controls",
                    reason=f"Applies prevention guideline learned from {top_memory.source_incident_id}",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=False,
                    category="recovery",
                ),
            ]
        else:
            # Generic cold recommendation
            rationale = (
                "Baseline recommendation generated from current indicators without prior memory match. "
                "Standard perimeter containment runbook suggested."
            )
            confidence = 0.75
            recommended_response = (
                f"Apply immediate perimeter firewall DROP rule for traffic from {source} "
                f"and inspect authentication logs on {target}."
            )
            why_this_response = (
                "Standard perimeter containment protocol synthesized from live indicators without historical memory match."
            )
            memory_influence = "Standard containment recommendations (no historical match found)."
            expected_objective = (
                "Halt incoming unauthorized traffic and verify target host integrity."
            )
            potential_risks = "Low operational risk. Standard security containment overhead."

            detailed_actions = [
                ResponseAction(
                    id="ACT-01",
                    action=f"Apply immediate perimeter firewall DROP rule for traffic from {source}",
                    reason="Sever incoming connection attempts from suspicious source",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=True,
                    category="containment",
                ),
                ResponseAction(
                    id="ACT-02",
                    action=f"Inspect live auth logs on {target} for any established sessions",
                    reason="Verify host integrity and identify any successful breaches",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=False,
                    category="audit",
                ),
                ResponseAction(
                    id="ACT-03",
                    action="Monitor perimeter telemetry for rotating IP subnets",
                    reason="Detect distributed or secondary ingress attempts",
                    status=ActionStatus.RECOMMENDED,
                    risk_level=RiskLevel.LOW,
                    requires_approval=False,
                    category="containment",
                ),
            ]

        return IncidentRecommendation(
            recommended_response=recommended_response,
            why_this_response=why_this_response,
            memory_influence=memory_influence,
            expected_objective=expected_objective,
            potential_risks=potential_risks,
            recommended_actions=recommended_actions,
            detailed_actions=detailed_actions,
            rationale=rationale,
            confidence=confidence,
            recalled_experiences=recalled_experiences
        )
