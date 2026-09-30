# Sentinel Memory - Frontend ↔ Backend API Contract

This document specifies the REST API contract established between the frontend dashboard and the FastAPI backend service.

Base URL: `http://localhost:8000` (Configured via `VITE_API_URL`)

All response bodies are `application/json`. Errors return standard RFC 7807 problem details or `{ "detail": "error message" }`.

---

## 1. System Information & Health

### `GET /`
- **Purpose**: Retrieve API service metadata, operational status, and interactive documentation URLs.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
{
  "service": "Sentinel Memory API",
  "description": "Hindsight-powered Incident Response Agent",
  "status": "operational",
  "docs_url": "/docs",
  "health_url": "/health"
}
```

---

### `GET /health`
- **Purpose**: Verify backend API availability, database connectivity, and Hindsight persistent memory status.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "database": "connected",
  "hindsight": {
    "status": "connected",
    "mode": "mock",
    "bank_id": "sentinel-incident-memory",
    "banks_active": 1,
    "total_memories_indexed": 1
  }
}
```
- **Error Expectations**:
  - `503 Service Unavailable`: Database or critical memory service unreachable.

---

## 2. Incidents Management

### `POST /api/incidents`
- **Purpose**: Ingest and register a new security alert or incident.
- **Request Body**:
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
- **Expected Response (201 Created)**:
```json
{
  "id": "INC-2026-001",
  "title": "SSH Brute Force on Bastion-01",
  "description": "High volume of failed authentication attempts from untrusted external IP.",
  "incident_type": "ssh_brute_force",
  "severity": "HIGH",
  "status": "NEW",
  "source": "198.51.100.45",
  "target": "bastion-prod-01",
  "indicators": ["198.51.100.45", "root", "port 22"],
  "evidence": {
    "log_sample": "Failed password for root from 198.51.100.45 port 44211 ssh2",
    "failed_attempts": 14200,
    "time_window_minutes": 15
  },
  "detected_at": "2026-09-28T09:14:02Z",
  "created_at": "2026-09-28T09:14:02Z",
  "updated_at": "2026-09-28T09:14:02Z"
}
```
- **Error Expectations**:
  - `422 Unprocessable Entity`: Validation failure on required fields (`title`, `description`).

---

### `GET /api/incidents`
- **Purpose**: Retrieve a paginated list of registered incidents with optional filtering.
- **Query Parameters**:
  - `status` (optional): Filter by state (`NEW`, `ANALYZING`, `ANALYZED`, `RECOMMENDATION_READY`, `IN_PROGRESS`, `RESOLVED`, `POSTMORTEM_COMPLETE`).
  - `severity` (optional): Filter by severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - `limit` (optional, default: 50): Page size (1–100).
  - `offset` (optional, default: 0): Pagination offset.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
[
  {
    "id": "INC-2026-001",
    "title": "SSH Brute Force on Bastion-01",
    "severity": "HIGH",
    "status": "RECOMMENDATION_READY",
    "source": "198.51.100.45",
    "target": "bastion-prod-01",
    "detected_at": "2026-09-28T09:14:02Z",
    "created_at": "2026-09-28T09:14:02Z",
    "updated_at": "2026-09-28T09:16:30Z"
  }
]
```
- **Error Expectations**:
  - `400 Bad Request`: Invalid query parameters.

---

### `GET /api/incidents/{incident_id}`
- **Purpose**: Retrieve full details of a specific incident including analysis, recommendations, and post-mortem.
- **Request Body**: None
- **Expected Response (200 OK)**: Complete `Incident` object.
- **Error Expectations**:
  - `404 Not Found`: Incident with specified ID does not exist.

---

### `POST /api/incidents/{incident_id}/analyze`
- **Purpose**: Trigger AI threat analysis on incident telemetry (identifies tactics, extracts IOCs, assesses severity).
- **Request Body**: None (analyzes existing stored incident data)
- **Expected Response (200 OK)**:
```json
{
  "id": "INC-2026-001",
  "status": "ANALYZED",
  "analysis": {
    "summary": "Distributed brute force attack targeting SSH root credentials on production bastion.",
    "attack_vector": "Public-facing SSH port (22/TCP)",
    "potential_impact": "Host compromise, lateral movement across internal VPC",
    "tactics": [
      "MITRE ATT&CK T1110.001 - Password Guessing",
      "MITRE ATT&CK T1021.004 - SSH"
    ],
    "extracted_iocs": ["198.51.100.45", "root"],
    "assessed_severity": "HIGH",
    "confidence": 0.94,
    "analyzed_at": "2026-09-28T09:15:00Z"
  }
}
```
- **Error Expectations**:
  - `404 Not Found`: Incident not found.

---

### `GET /api/incidents/{incident_id}/memory`
- **Purpose**: Retrieve relevant past incident experiences from Hindsight memory bank matching this incident.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
[
  {
    "source_incident_id": "INC-2026-001",
    "title": "High Volume SSH Authentication Failure on Bastion-01",
    "similarity_score": 0.88,
    "past_root_cause": "Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication.",
    "past_actions_taken": [
      "Applied edge firewall DROP rule for IP 198.51.100.45",
      "Disabled PasswordAuthentication in sshd_config",
      "Restarted sshd service"
    ],
    "past_outcome": "Contained successfully within 12 minutes. Zero unauthorized sessions established.",
    "lesson_learned": "Enforce automated Ansible compliance check on all perimeter servers every 15 minutes to guarantee PasswordAuthentication no is permanently set."
  }
]
```
- **Error Expectations**:
  - `404 Not Found`: Incident not found.

---

### `POST /api/incidents/{incident_id}/recommend`
- **Purpose**: Query Hindsight for similar past incidents and synthesize a context-aware response recommendation.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
{
  "id": "INC-2026-002",
  "status": "RECOMMENDATION_READY",
  "recommendation": {
    "recommended_actions": [
      "Apply immediate perimeter firewall DROP rule for traffic from 203.0.113.88",
      "CRITICAL AUDIT: Check service configuration on app-prod-04 immediately. In prior incident INC-2026-001, root cause was: Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication.",
      "Inspect live auth logs on app-prod-04 for any established sessions",
      "PREVENTION RUNBOOK: Apply lesson learned from INC-2026-001: Enforce automated Ansible compliance check on all perimeter servers every 15 minutes."
    ],
    "rationale": "Recommendation enriched by Hindsight memory recall (Match: INC-2026-001, similarity: 88%). Historical incident experienced identical attack pattern.",
    "confidence": 0.94,
    "recalled_experiences": [
      {
        "source_incident_id": "INC-2026-001",
        "title": "High Volume SSH Authentication Failure on Bastion-01",
        "similarity_score": 0.88,
        "past_root_cause": "Password authentication was inadvertently enabled after OS update",
        "past_outcome": "Contained successfully within 12 minutes. Zero breach.",
        "lesson_learned": "Enforce automated Ansible compliance check on sshd_config"
      }
    ],
    "generated_at": "2026-09-28T09:16:30Z"
  }
}
```
- **Error Expectations**:
  - `404 Not Found`: Incident not found.

---

### `POST /api/incidents/{incident_id}/resolve`
- **Purpose**: Record containment and remediation actions executed by the SOC analyst.
- **Request Body**:
```json
{
  "actions_taken": [
    "Applied edge firewall DROP rule for IP 198.51.100.45",
    "Disabled password authentication in sshd_config",
    "Restarted sshd service"
  ],
  "outcome": "Attack contained. No successful logins detected.",
  "resolved_by": "analyst_sarah"
}
```
- **Expected Response (200 OK)**: Incident with updated `status: "RESOLVED"` and `resolution` object populated.
- **Error Expectations**:
  - `404 Not Found`: Incident not found.
  - `422 Unprocessable Entity`: Missing `actions_taken` or `outcome`.

---

### `POST /api/incidents/{incident_id}/postmortem`
- **Purpose**: Record post-mortem root-cause analysis and long-term prevention lessons learned.
- **Request Body**:
```json
{
  "root_cause": "Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication.",
  "lessons_learned": "Enforce automated Ansible compliance check on all perimeter servers every 15 minutes to guarantee PasswordAuthentication no is permanently set. Deploy fail2ban as an immediate perimeter circuit breaker."
}
```
- **Expected Response (200 OK)**: Incident with updated `status: "POSTMORTEM_COMPLETE"` and `postmortem` object populated.
- **Error Expectations**:
  - `404 Not Found`: Incident not found.
  - `422 Unprocessable Entity`: Missing `root_cause` or `lessons_learned`.

---

### `POST /api/incidents/{incident_id}/learn`
- **Purpose**: Explicitly invoke Hindsight RETAIN to commit the incident's experience capsule into persistent memory for future agent recall.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
{
  "status": "success",
  "detail": "Experience retained in Hindsight",
  "result": {
    "status": "retained",
    "memory_id": "mem-0001",
    "bank_id": "sentinel-incident-memory"
  }
}
```
- **Error Expectations**:
  - `404 Not Found`: Incident not found.
  - `400 Bad Request`: Incident has not yet been resolved or lacks post-mortem details.

---

## 3. Hindsight Memory Bank & Learning Timeline

### `GET /api/memory`
- **Purpose**: Retrieve all retained experience capsules across the Hindsight memory bank for the Memory Bank dashboard.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
[
  {
    "source_incident_id": "INC-2026-001",
    "title": "High Volume SSH Authentication Failure on Bastion-01",
    "similarity_score": 1.0,
    "relevance_label": "Hindsight Retained Capsule (100%)",
    "what_happened": "14,200 failed SSH logins hitting our DMZ bastion.",
    "past_root_cause": "Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with defaults, inadvertently enabling password authentication.",
    "past_actions_taken": [
      "Applied edge firewall DROP rule for IP 198.51.100.45",
      "Audited /etc/ssh/sshd_config and disabled password auth"
    ],
    "past_outcome": "Contained successfully. Zero breach.",
    "lesson_learned": "Enforce automated Ansible compliance check on all perimeter servers every 15 minutes.",
    "incident_pattern": "ssh_brute_force",
    "timestamp": "2026-09-28T09:30:00Z"
  }
]
```

---

### `GET /api/memory/timeline`
- **Purpose**: Retrieve the chronological timeline of learning events showing when past post-mortems were retained and which subsequent incidents matched them.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
[
  {
    "id": "LRN-001",
    "incident_id": "INC-2026-001",
    "title": "High Volume SSH Authentication Failure on Bastion-01 - Lessons Retained",
    "attack_type": "ssh_brute_force",
    "trigger_event": "Post-Mortem Retained in Hindsight",
    "retained_memory_id": "mem_inc_2026_001",
    "timestamp": "2026-09-28T09:30:00Z",
    "root_cause": "Routine OS package upgrade overwrote sshd_config",
    "outcome_summary": "Contained successfully. Zero breach.",
    "lessons_learned": "Enforce automated Ansible compliance check on perimeter servers.",
    "matched_subsequent_incidents": ["INC-2026-002"]
  }
]
```

---

### `POST /api/memory/recall`
- **Purpose**: Ad-hoc semantic search query against the Hindsight memory bank.
- **Request Body**:
```json
{
  "query": "SSH brute force root login attempts with configuration drift",
  "context": "type: ssh_brute_force",
  "limit": 3
}
```
- **Expected Response (200 OK)**: List of matching `RecalledExperience` objects.

---

## 4. Demo State Management

### `POST /api/demo/reset`
- **Purpose**: Reset and restore the database to the deterministic, clean state for the Golden Path presentation.
- **Request Body**: None
- **Expected Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully reset and seeded 3 demo scenarios.",
  "incidents_reset": [
    "INC-2026-001",
    "INC-2026-002",
    "INC-2026-003"
  ]
}
```

