# Incident-Response-Agent: Sentinel Memory

> **A Hindsight-Powered Cybersecurity Incident Response Agent that Learns from Past Incidents.**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Hindsight Memory](https://img.shields.io/badge/Hindsight-Persistent%20Memory-purple.svg)](https://github.com/vectorize-io/hindsight)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Executive Summary

- **Project Name**: Sentinel Memory
- **Hackathon Theme**: *AI Agents That Learn Using Hindsight*
- **Problem**: Modern Security Operations Centers (SOCs) suffer from alert fatigue and recurring incidents. Existing AI chatbots and stateless RAG systems treat each alert as an isolated incident, repeatedly suggesting the same generic perimeter blocks without remembering past investigation findings, actual root causes, or hard-won post-mortem lessons.
- **Solution**: **Sentinel Memory** is an experience-driven incident response agent. Powered by **Hindsight** (`vectorize-io/hindsight`), Sentinel retains structured outcome capsules from resolved incidents and recalls relevant experiences during new investigations. When a similar attack strikes, Sentinel recalls the root causes discovered previously, warning the analyst and recommending proven prevention runbooks.

---

## 2. Core Workflow & Milestone 1 Loop

The central operational loop directly addresses the hackathon requirement that Hindsight be central and the agent continuously learn:

```
Security Alert (Incident 1)
        ↓
Threat Analysis (MITRE ATT&CK T1110.001)
        ↓
Generic Baseline Recommendation
        ↓
Analyst Investigation & Root Cause Discovery (sshd_config password auth drift)
        ↓
Resolution & Post-Mortem
        ↓
HINDSIGHT RETAIN (Outcome-oriented experience capsule saved to memory bank)
        ↓
New Alert (Incident 2 - Similar SSH attack on different host/IP)
        ↓
HINDSIGHT RECALL (TEMPR parallel memory retrieval finds Incident 1)
        ↓
Enriched Contextual Recommendation (Alerts analyst to audit sshd_config right away!)
        ↓
Future Improvement Demonstrated
```

---

## 3. High-Level Architecture

```
Frontend (React 18 + Vite + TypeScript + Tailwind CSS)
    ↓  REST API
Backend (FastAPI + SQLAlchemy + Pydantic v2)
    ↓
Sentinel Agent Orchestrator
    ├── Threat Analyzer (MITRE ATT&CK classification)
    ├── Response Planner (Evidence + Recalled Lessons)
    └── Hindsight Memory Service (Adapter Layer)
         ├── MockHindsightAdapter (In-memory offline simulation & unit testing)
         └── HindsightClientAdapter (Hindsight Cloud or self-hosted daemon)
    ↓
Database (SQLite local dev / PostgreSQL production)
```

---

## 4. Repository Structure

```
.
├── apps/
│   ├── api/                    # FastAPI Backend Service
│   │   ├── app/
│   │   │   ├── agents/         # AI Threat Analyzer, Response Planner, Orchestrator
│   │   │   ├── api/            # API Endpoints (/health, /api/incidents)
│   │   │   ├── core/           # Configuration & Settings
│   │   │   ├── db/             # SQLAlchemy async engine & database session
│   │   │   ├── hindsight/      # Hindsight Adapter (Base, Mock, Client) & Service
│   │   │   ├── models/         # SQLAlchemy ORM models
│   │   │   ├── schemas/        # Pydantic v2 domain models
│   │   │   ├── services/       # Incident lifecycle service
│   │   │   └── main.py         # FastAPI application entry point
│   │   ├── tests/              # Pytest test suite (health, API, Hindsight, milestone loop)
│   │   └── requirements.txt    # Python dependencies
│   │
│   └── web/                    # React + Vite SOC Analyst Dashboard
│       ├── src/
│       │   ├── components/     # Layout, Navbar, Sidebar, Badges
│       │   ├── pages/          # Dashboard, Incident Queue, Investigation, Memory Bank, Learning
│       │   ├── services/       # Typed REST API client
│       │   ├── types/          # TypeScript domain interfaces
│       │   ├── App.tsx         # Route configuration
│       │   └── main.tsx        # React entrypoint
│       └── package.json        # Frontend dependencies
│
├── data/
│   └── scenarios/              # Synthetic incident datasets for testing & evaluation
│       ├── incident_01_ssh_brute_force.json
│       ├── incident_02_ssh_brute_force_variant.json
│       └── incident_03_credential_stuffing.json
│
├── docs/                       # Project Documentation & Architecture Records
│   ├── ARCHITECTURE.md         # Full system architecture & data flow
│   ├── API.md                  # REST API contract specifications
│   ├── HINDSIGHT.md            # Hindsight integration, TEMPR recall, adapter details
│   ├── DEVELOPMENT.md          # 5-minute developer onboarding guide
│   ├── DEMO.md                 # 2-3 minute official demo script
│   ├── DECISIONS.md            # Architecture Decision Records (ADR-001 through ADR-007)
│   └── TEAM_OWNERSHIP.md       # 4-member parallel workstream breakdown
│
├── scripts/
│   └── run_milestone1_demo.py  # Standalone CLI demo of the central learning loop
│
├── .env.example                # Safe environment variable template
├── .gitignore                  # Git ignore rules (secrets protected)
├── CONTRIBUTING.md             # Branching rules, conventional commits, code standards
├── LICENSE                     # MIT License
├── pytest.ini                  # Pytest configuration
└── package.json                # Root monorepo scripts
```

---

## 5. Quickstart & Local Setup

### 1. Clone & Configure
```bash
git clone https://github.com/siddharthg-7/Incident-Response-Agent.git
cd Incident-Response-Agent
cp .env.example .env
```

### 2. Run the Milestone 1 Demo
Verify the central learning loop in terminal:
```bash
python scripts/run_milestone1_demo.py
```

### 3. Run Backend API Server
```bash
npm run dev:api
# Or:
python -m uvicorn app.main:app --app-dir apps/api --reload --port 8000
```
- OpenAPI Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Run Frontend Dashboard
```bash
npm run dev:web
# Or:
cd apps/web && npm install && npm run dev
```
- Access SOC Dashboard: [http://localhost:5173](http://localhost:5173)

### 5. Run Automated Tests
```bash
pytest apps/api/tests -v
```

---

## 6. Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `HINDSIGHT_MODE` | `mock` | `mock` (offline testing) or `client` (cloud/Docker) |
| `HINDSIGHT_BASE_URL` | `http://localhost:8888` | Hindsight service endpoint |
| `HINDSIGHT_API_KEY` | *(empty)* | Optional Hindsight Cloud API token |
| `HINDSIGHT_BANK_ID` | `sentinel-incident-memory` | Target memory bank name |
| `DATABASE_URL` | `sqlite+aiosqlite:///./sentinel_memory.db` | Local SQLite or PostgreSQL URL |
| `LLM_PROVIDER` | `mock` | `mock`, `groq`, or `openai` |
| `API_PORT` | `8000` | FastAPI server port |
| `VITE_API_BASE_URL`| `http://localhost:8000` | Backend API URL for frontend |

---

## 7. Team Workstreams (4 Parallel Developers)

- **Member 1 (AI + Hindsight)**: `feature/hindsight-agent` — Hindsight client, recall/retain optimization, prompt engineering.
- **Member 2 (Backend)**: `feature/backend-api` — FastAPI endpoints, PostgreSQL persistence, data schemas.
- **Member 3 (Frontend)**: `feature/soc-dashboard` — React investigation UI, SOC timeline, memory visualization.
- **Member 4 (Data & Eval)**: `feature/data-evaluation` — Synthetic scenarios, evaluation benchmarks, CI/CD pipeline.

See [docs/TEAM_OWNERSHIP.md](docs/TEAM_OWNERSHIP.md) for full task assignments.

---

## 8. Current Implementation Status & Roadmap

- [x] **Repository Foundation**: Clean modular monorepo structure.
- [x] **Hindsight Abstraction**: Adapter pattern with full `MockHindsightAdapter` and `HindsightClientAdapter`.
- [x] **Milestone 1 Central Loop**: Tested and verifiable via `python scripts/run_milestone1_demo.py`.
- [x] **Domain Models & Lifecycle**: Pydantic v2 schemas and SQLAlchemy async ORM.
- [x] **API Contract**: Health check, incident CRUD, analyze, recommend, resolve, postmortem, and learn.
- [x] **Frontend Shell**: React 18 + Vite + Tailwind CSS dashboard with full SOC routing.
- [x] **Test Suite**: 100% passing tests for health, API contract, and memory loop.
- [ ] **Live Groq Integration** (Member 1)
- [ ] **PostgreSQL Migrations with Alembic** (Member 2)
- [ ] **Interactive SOC Timeline Visualization** (Member 3)
- [ ] **Comprehensive Multi-Attack Benchmark Dataset** (Member 4)

---

## 9. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
