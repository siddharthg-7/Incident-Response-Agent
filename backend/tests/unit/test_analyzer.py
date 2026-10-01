import pytest
from app.agents.analyzer import IncidentAnalyzer
from app.schemas.incident import Severity


@pytest.mark.asyncio
async def test_analyzer_ssh_brute_force():
    analyzer = IncidentAnalyzer()
    incident_data = {
        "id": "INC-TEST-001",
        "title": "High Volume SSH Authentication Failure on Bastion-01",
        "description": "14200 failed login attempts in 15 minutes",
        "incident_type": "ssh_brute_force",
        "source": "198.51.100.45",
        "target": "bastion-prod-01",
        "indicators": ["198.51.100.45", "root", "port 22"]
    }

    analysis = await analyzer.analyze(incident_data)
    assert analysis.assessed_severity == Severity.HIGH
    assert analysis.confidence >= 0.90
    assert any("T1110.001" in t for t in analysis.tactics)
    assert any("T1021.004" in t for t in analysis.tactics)
    assert "198.51.100.45" in analysis.extracted_iocs
    assert "bastion-prod-01" in analysis.summary
    assert "SSH Brute Force" in analysis.classification
    assert analysis.suspected_root_cause is not None
    assert len(analysis.investigation_summary) > 20
    assert len(analysis.evidence_summary) >= 1


@pytest.mark.asyncio
async def test_analyzer_credential_stuffing():
    analyzer = IncidentAnalyzer()
    incident_data = {
        "id": "INC-TEST-002",
        "title": "Distributed Credential Stuffing on Customer Portal API",
        "description": "Rapid succession of authentication requests with varying usernames",
        "incident_type": "credential_stuffing",
        "source": "203.0.113.50",
        "target": "auth-api-prod",
        "indicators": ["auth-api-prod", "POST /api/v1/auth/login"]
    }

    analysis = await analyzer.analyze(incident_data)
    assert analysis.assessed_severity == Severity.HIGH
    assert any("T1110.004" in t for t in analysis.tactics)
    assert "Web Authentication REST Endpoint" in analysis.attack_vector
    assert "Credential Stuffing" in analysis.classification
    assert "rate-limiting" in analysis.suspected_root_cause


@pytest.mark.asyncio
async def test_analyzer_generic_anomaly():
    analyzer = IncidentAnalyzer()
    incident_data = {
        "id": "INC-TEST-003",
        "title": "Unusual Process Execution in DMZ",
        "description": "Unknown script executed with elevated privileges",
        "incident_type": "anomalous_process",
        "source": "10.0.1.5",
        "target": "dmz-proxy",
        "indicators": ["/tmp/x.sh", "root"]
    }

    analysis = await analyzer.analyze(incident_data)
    assert analysis.assessed_severity == Severity.MEDIUM
    assert any("T1059" in t for t in analysis.tactics)
    assert analysis.classification is not None
    assert len(analysis.evidence_summary) >= 1
