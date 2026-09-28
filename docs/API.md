# Sentinel Memory - API Documentation

The Sentinel Memory REST API is built on FastAPI and follows RESTful conventions.

All response payloads adhere to standard JSON schemas. Errors return RFC 7807 problem details or standard `{ "detail": "error message" }`.

---

## 1. System Health

### `GET /health`
Returns system status, active database connectivity, and Hindsight memory service availability.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "database": "connected",
  "hindsight": {
    "status": "connected",
    "mode": "mock",
    "bank_id": "sentinel-incident-memory"
  }
}
```

---

## 2. Incidents Management

### `POST /api/incidents`
Creates and registers a new incoming security incident.

**Request Body:**
```json
{
  "title": "SSH Brute Force on Bastion-01",
  "description": "High volume of failed authentication attempts from untrusted external IP.",
  "incident_type": "ssh_brute_force",
  "severity": "HIGH",
  "source": "198.51.100.45",
  "target": "bastion-prod-01",
  "indicators": ["198.51.100.45", "root", "port 22"],
  "evidence": {
    "log_sample": "Failed password for root from 198.51.100.45 port 44211 ssh2",
    "failed_attempts": 14200,
    "time_window_minutes": 15
  }
}
```

**Response (201 Created):**
Returns the created `Incident` object with auto-generated `id`, `status: "NEW"`, `created_at`, etc.

---

### `GET /api/incidents`
Retrieves a paginated list of registered incidents.

**Query Parameters:**
- `status` (optional): Filter by status (`NEW`, `ANALYZING`, `ANALYZED`, `RECOMMENDATION_READY`, `RESOLVED`, `POSTMORTEM_COMPLETE`)
- `severity` (optional): Filter by severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `limit` (default: 50): Number of records
- `offset` (default: 0): Pagination offset

---

### `GET /api/incidents/{incident_id}`
Retrieves full details of a specific incident, including analysis, recommendations, and resolution data.

---

### `POST /api/incidents/{incident_id}/analyze`
Triggers AI incident analysis: extracts IOCs, assigns severity, identifies attack pattern, and notes preliminary root causes.

**Response (200 OK):**
```json
{
  "incident_id": "INC-2026-001",
  "status": "ANALYZED",
  "analysis": {
    "summary": "Distributed brute force attack targeting SSH root credentials on production bastion.",
    "tactics": ["MITRE ATT&CK T1110.001 - Password Guessing"],
    "extracted_iocs": ["198.51.100.45"],
    "assessed_severity": "HIGH",
    "confidence": 0.95
  }
}
```

---

### `POST /api/incidents/{incident_id}/recommend`
Executes Hindsight recall against similar prior incidents and synthesizes a tailored response recommendation.

**Response (200 OK):**
```json
{
  "incident_id": "INC-2026-002",
  "status": "RECOMMENDATION_READY",
  "recommendation": {
    "recommended_actions": [
      "Drop traffic from 203.0.113.88 at edge security group",
      "Inspect sshd_config on app-prod-04 for disabled PasswordAuthentication",
      "Verify no unauthorized user accounts were created in /etc/passwd"
    ],
    "rationale": "Prior incident INC-2026-001 had an identical brute-force pattern where password auth was found enabled after patch deployment. Previous remediation succeeded in 12 min.",
    "confidence": 0.92,
    "recalled_experiences": [
      {
        "source_incident_id": "INC-2026-001",
        "title": "SSH Brute Force on Bastion-01",
        "similarity_score": 0.88,
        "past_outcome": "Successful containment within 12 minutes. Zero breach.",
        "lesson_learned": "Enforce Ansible compliance check for sshd_config."
      }
    ]
  }
}
```

---

### `POST /api/incidents/{incident_id}/resolve`
Records the analyst's containment and remediation actions, moving status to `RESOLVED`.

**Request Body:**
```json
{
  "actions_taken": [
    "Blocked source IP 198.51.100.45",
    "Disabled password authentication in sshd_config",
    "Restarted sshd service"
  ],
  "outcome": "Attack contained. No successful logins detected.",
  "resolved_by": "analyst_sarah"
}
```

---

### `POST /api/incidents/{incident_id}/postmortem`
Attaches formal root-cause analysis and lessons learned to the incident.

**Request Body:**
```json
{
  "root_cause": "Configuration drift during baseline OS update enabled password authentication.",
  "lessons_learned": "Automate sshd configuration checks in daily audit pipeline."
}
```

---

### `POST /api/incidents/{incident_id}/learn`
Explicitly invokes `HindsightService.retain()` to commit the incident's experience capsule into persistent memory.
