import logging
from typing import Any, Dict, List
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
        evidence = incident_data.get("evidence", {})
        indicators = incident_data.get("indicators", [])

        # Extraction logic with heuristics / LLM
        extracted_iocs = list(indicators)
        source = incident_data.get("source")
        target = incident_data.get("target", "perimeter node")
        if source and source not in extracted_iocs:
            extracted_iocs.append(source)

        evidence_summary: List[str] = []
        if "failed_attempts" in evidence:
            evidence_summary.append(f"{evidence['failed_attempts']} failed authentication attempts detected")
        if "log_source" in evidence:
            evidence_summary.append(f"Recorded in log source: {evidence['log_source']}")
        if "time_window" in evidence:
            evidence_summary.append(f"Observed within {evidence['time_window']}")
        elif "time_window_minutes" in evidence:
            evidence_summary.append(f"Activity concentrated within {evidence['time_window_minutes']} minutes")
        if "attempted_usernames" in evidence and evidence["attempted_usernames"]:
            users = ", ".join(str(u) for u in evidence["attempted_usernames"][:4])
            evidence_summary.append(f"Privileged accounts targeted: {users}")
        if source:
            evidence_summary.append(f"Originating from source: {source}")
        if indicators:
            evidence_summary.append(f"Key indicators: {', '.join(indicators[:4])}")

        if "ssh" in inc_type or "ssh" in title.lower() or "ssh" in desc.lower():
            classification = "Credential Attack / SSH Brute Force"
            tactics = [
                "MITRE ATT&CK T1110.001 - Password Guessing",
                "MITRE ATT&CK T1021.004 - Remote Services: SSH"
            ]
            summary = (
                f"High-frequency SSH authentication brute-force attempt targeting {target} "
                f"from external source {source or 'untrusted IP'}."
            )
            investigation_summary = (
                f"High-frequency dictionary attack detected from {source or 'untrusted IP'} targeting {target}. "
                f"The attacker is systematically attempting authentication across administrative accounts."
            )
            suspected_root_cause = (
                "Internet-exposed SSH daemon with password authentication allowed or configuration drift post-update."
            )
            attack_vector = "Public-facing SSH port (22/TCP)"
            potential_impact = "Host compromise, credential theft, lateral movement across internal VPC"
            assessed_severity = Severity.HIGH
            confidence = 0.94
        elif "credential" in inc_type or "stuffing" in title.lower():
            classification = "Credential Attack / Credential Stuffing"
            tactics = [
                "MITRE ATT&CK T1110.004 - Credential Stuffing",
                "MITRE ATT&CK T1078 - Valid Accounts"
            ]
            summary = "Automated high-velocity login attacks using leaked credentials."
            investigation_summary = (
                f"Distributed credential stuffing attack targeting {target}. Multiple credential pairs attempted "
                f"from rotating client endpoints."
            )
            suspected_root_cause = (
                "Public-facing authentication endpoint lacking adaptive rate-limiting or CAPTCHA enforcement."
            )
            attack_vector = "Web Authentication REST Endpoint"
            potential_impact = "Account takeover, customer data exfiltration, service degradation"
            assessed_severity = Severity.HIGH
            confidence = 0.90
        elif "powershell" in title.lower() or "powershell" in desc.lower():
            classification = "Execution / Obfuscated Process Spawn"
            tactics = [
                "MITRE ATT&CK T1059.001 - PowerShell",
                "MITRE ATT&CK T1027 - Obfuscated Files or Information"
            ]
            summary = f"Obfuscated PowerShell execution detected on {target}."
            investigation_summary = f"Word/Office child process spawned encoded PowerShell command targeting {target}."
            suspected_root_cause = "Malicious Office macro executed by user attempting secondary stage payload retrieval."
            attack_vector = "Endpoint Execution / Malicious Document"
            potential_impact = "Secondary payload execution, C2 beacon establishment, endpoint compromise"
            assessed_severity = Severity.CRITICAL
            confidence = 0.96
        elif "privilege" in inc_type or "sudo" in title.lower():
            classification = "Privilege Escalation / Unauthorized Elevation"
            tactics = [
                "MITRE ATT&CK T1548.003 - Abuse Elevation Control: Sudo",
                "MITRE ATT&CK T1068 - Exploitation for Privilege Escalation"
            ]
            summary = f"Unauthorized privilege escalation attempt on {target}."
            investigation_summary = f"Local service account attempted unauthorized sudoers elevation on {target}."
            suspected_root_cause = "Web application flaw exploited to drop unauthorized sudoers file or execute root shell."
            attack_vector = "Local System Permissions / Sudo Configuration"
            potential_impact = "Full administrative takeover of host node"
            assessed_severity = Severity.CRITICAL
            confidence = 0.98
        else:
            classification = f"Security Anomaly / {inc_type.replace('_', ' ').title() if inc_type else 'General'}"
            tactics = ["MITRE ATT&CK T1059 - Command and Scripting Interpreter"]
            summary = f"Security anomaly detected: {title}. Requires rapid SOC triage."
            investigation_summary = f"Anomalous telemetry observed on {target} matching {inc_type} attack profile."
            suspected_root_cause = f"Anomalous activity pattern matching {inc_type} tactics requiring perimeter investigation."
            attack_vector = "Network Perimeter"
            potential_impact = "Potential service degradation or perimeter breach"
            assessed_severity = Severity.MEDIUM
            confidence = 0.80

        if not evidence_summary:
            evidence_summary = [
                f"Telemetry alert: {title}",
                f"Target node: {target}",
                f"Originating source: {source or 'unspecified'}"
            ]

        return IncidentAnalysis(
            classification=classification,
            suspected_root_cause=suspected_root_cause,
            investigation_summary=investigation_summary,
            evidence_summary=evidence_summary,
            summary=summary,
            attack_vector=attack_vector,
            potential_impact=potential_impact,
            tactics=tactics,
            extracted_iocs=extracted_iocs,
            assessed_severity=assessed_severity,
            confidence=confidence
        )


