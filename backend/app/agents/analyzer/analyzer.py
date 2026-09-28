import logging
from typing import Any, Dict
from app.schemas.incident import IncidentAnalysis, Severity

logger = logging.getLogger(__name__)


class IncidentAnalyzer:
    """Analyzes security alerts, classifies threats, identifies attack tactics, and extracts IOCs."""

    def __init__(self, provider: str = "mock"):
        self.provider = provider

    async def analyze(self, incident_data: Dict[str, Any]) -> IncidentAnalysis:
        """Analyze an incident and return structured findings."""
        title = incident_data.get("title", "")
        desc = incident_data.get("description", "")
        inc_type = incident_data.get("incident_type", "").lower()
        indicators = incident_data.get("indicators", [])

        extracted_iocs = list(indicators)
        source = incident_data.get("source")
        if source and source not in extracted_iocs:
            extracted_iocs.append(source)

        if "ssh" in inc_type or "ssh" in title.lower() or "ssh" in desc.lower():
            tactics = ["MITRE ATT&CK T1110.001 - Password Guessing", "MITRE ATT&CK T1021.004 - SSH"]
            summary = (
                f"High-frequency SSH authentication brute-force attempt targeting {incident_data.get('target', 'perimeter node')} "
                f"from external source {source or 'untrusted IP'}."
            )
            attack_vector = "Public-facing SSH port (22/TCP)"
            potential_impact = "Host compromise, lateral movement across internal VPC"
            assessed_severity = Severity.HIGH
            confidence = 0.94
        elif "credential" in inc_type or "stuffing" in title.lower():
            tactics = ["MITRE ATT&CK T1110.004 - Credential Stuffing"]
            summary = "Automated high-velocity login attacks using leaked credentials."
            attack_vector = "Web Authentication REST Endpoint"
            potential_impact = "Account takeover, customer data exfiltration"
            assessed_severity = Severity.HIGH
            confidence = 0.90
        else:
            tactics = ["MITRE ATT&CK T1059 - Command and Scripting Interpreter"]
            summary = f"Security anomaly detected: {title}. Requires rapid SOC triage."
            attack_vector = "Network Perimeter"
            potential_impact = "Potential service degradation or perimeter breach"
            assessed_severity = Severity.MEDIUM
            confidence = 0.80

        return IncidentAnalysis(
            summary=summary,
            attack_vector=attack_vector,
            potential_impact=potential_impact,
            tactics=tactics,
            extracted_iocs=extracted_iocs,
            assessed_severity=assessed_severity,
            confidence=confidence
        )
