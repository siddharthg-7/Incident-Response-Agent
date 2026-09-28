# Sentinel Memory 🛡️🧠

> A Hindsight-powered Cybersecurity Incident Response Agent for SOC analysts that remembers past investigations, root causes, and containment outcomes to continuously improve future recommendations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Hindsight Core](https://img.shields.io/badge/Hindsight-Persistent%20Memory-purple.svg)](https://github.com/vectorize-io/hindsight)
[![Status: Final Ship](https://img.shields.io/badge/Status-Final%20Ship%20(Frozen)-emerald.svg)]()

---

## 1. What Sentinel Memory Is
**Sentinel Memory** is an adaptive, memory-augmented cybersecurity Incident Response platform designed for Security Operations Center (SOC) teams. Unlike stateless chatbots or basic retrieval-augmented generation (RAG) systems that treat every security alert in isolation, Sentinel Memory leverages **Hindsight** to retain institutional memory across incident lifecycles: discovering root causes, remembering what containment actions succeeded or failed, and injecting proven preventative lessons into future response recommendations.

---

## 2. Problem: SOC Knowledge Loss & Alert Amnesia
Modern SOC analysts face recurring attack campaigns and infrastructure configuration drift. When an alert arrives, analysts must re-investigate from zero:
- **No Institutional Continuity**: Knowledge gained in post-mortems is buried in static wiki documents and rarely reaches the analyst triaging an active alert.
- **Repeated Ineffective Actions**: Analysts repeat identical containment steps without knowing what underlying root cause allowed the attack to succeed previously.
- **Stateless AI Failure**: Generic LLMs recommend generic textbook answers (*"block the IP"*) without knowing that the same server suffered from an authentication configuration flaw weeks prior.

---

## 3. Solution: Experiential Memory Augmentation
Sentinel Memory integrates **Hindsight** (`vectorize-io/hindsight`) as an experiential memory bank (`sentinel-incident-memory`). 
- When an incident is resolved and its post-mortem is documented, the full experience capsule (attack pattern, root cause, executed actions, outcome, and lessons learned) is **retained**.
- When a subsequent attack strikes, Hindsight executes semantic vector recall to retrieve relevant historical precedents and injects actionable **Critical Audits** and **Prevention Runbooks** into the recommendation.

---

## 4. Core Workflow
```
[ Detect ] ──> [ Analyze ] ──> [ Recall (Hindsight) ] ──> [ Recommend ] ──> [ Resolve ] ──> [ Post-Mortem ] ──> [ Retain (Hindsight) ]
                                      │                                                                                  │
                                      └────────────────────── Future Case Enrichment <───────────────────────────────────┘
```

---

## 5. Why Hindsight Matters: The Golden Path Demonstration
The definitive differentiator between Sentinel Memory and stateless security tools is proven in the **Golden Path**:

```
[Incident 1: INC-2026-001]
Attacker brute forces SSH on bastion-01
  ↳ Analysis: Credential attack / password guessing
  ↳ Resolution: Attacker IP dropped; compromised keys rotated
  ↳ Post-Mortem: True root cause identified — password authentication was accidentally re-enabled during a package update
  ↳ Lesson Learned: Enforce pubkey-only SSH across all DMZ bastions and automated geo-blocking
  ↳ Hindsight RETAIN: Experience committed to "sentinel-incident-memory" bank

                                    ↓↓↓

[Incident 2: INC-2026-002]
Different external IP attacks app-prod-04 with SSH brute force
  ↳ Analysis: Identifies similar SSH pattern
  ↳ Hindsight RECALL: Recalls INC-2026-001 with 84.6% semantic similarity
  ↳ Memory-Informed Recommendation:
      • Standard Action: Apply firewall DROP rule for attacker IP
      • CRITICAL AUDIT (from INC-2026-001): Immediately inspect sshd_config on app-prod-04 for password auth drift
      • PREVENTION RUNBOOK (from INC-2026-001): Enforce pubkey-only SSH fleet-wide
  ↳ Analyst Control: Human-in-the-loop one-click approval & execution tracking
```

---

## 6. Architecture

```
                  ┌───────────────────────────────────────────────┐
                  │      SOC Analyst / Evaluator Browser          │
                  └───────────────────────┬───────────────────────┘
                                          │ HTTP / JSON
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │    React 18 Frontend Dashboard (Vite 5)       │
                  │  • Investigation Pipeline Stepper             │
                  │  • Hindsight Explanation & Juxtaposition      │
                  │  • Interactive Response Action Controls       │
                  └───────────────────────┬───────────────────────┘
                                          │ REST API (VITE_API_URL)
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │            FastAPI Backend Service            │
                  │  • GET  /health (System & Memory Bank Status) │
                  │  • CRUD /api/incidents                        │
                  │  • POST /api/incidents/{id}/analyze           │
                  │  • GET  /api/incidents/{id}/memory            │
                  │  • POST /api/incidents/{id}/recommend         │
                  │  • POST /api/incidents/{id}/resolve           │
                  │  • POST /api/incidents/{id}/postmortem        │
                  │  • POST /api/incidents/{id}/learn             │
                  └───────────────┬───────────────────────┬───────┘
                                  │                       │
                  ┌───────────────▼──────────┐ ┌──────────▼───────────────┐
                  │  Incident Response Agent │ │ Hindsight Memory Engine  │
                  │  • IncidentAnalyzer      │ │ (sentinel-incident-memory│
                  │  • ResponsePlanner       │ │  Biomimetic Retain/Recall│
                  └───────────────┬──────────┘ └──────────┬───────────────┘
                                  │                       │
                                  ▼                       ▼
                  ┌───────────────────────────────────────────────┐
                  │         Persistent SQLite / SQLAlchemy        │
                  │              (sentinel_memory.db)             │
                  └───────────────────────────────────────────────┘
```

---

## 7. Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite 5, React Router DOM v6
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2.0 (Async), aiosqlite
- **Memory Engine**: Hindsight Persistent Memory SDK with unified Mock and Client adapters
- **Testing & Verification**: Pytest, Pytest-Asyncio, TypeScript `tsc`, Vite Build Engine

---

## 8. Repository Structure
```
Incident Response Agent/
├── frontend/                   # React 18 SOC dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── incidents/      # InvestigationPipelineStepper, IncidentCreateModal, ResolutionModal, PostmortemModal
│   │   │   ├── memory/         # MemoryMatchCard, MemoryComparisonView, HindsightExplanationCard
│   │   │   ├── recommendations/# RecommendationSection (Provenance & Action Controls)
│   │   │   ├── common/         # LoadingState, ErrorState, EmptyState
│   │   │   └── layout/         # Navbar (Live Connectivity Pill), Sidebar
│   │   ├── pages/              # DashboardPage, IncidentsPage, IncidentDetailPage, MemoryPage, LearningPage
│   │   ├── services/           # api.ts (Centralized API client with response normalization)
│   │   └── types/              # Domain TypeScript contracts
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/                    # FastAPI backend service
│   ├── app/
│   │   ├── api/routes/         # health.py, incidents.py
│   │   ├── agents/             # SentinelOrchestrator, IncidentAnalyzer, ResponsePlanner
│   │   ├── hindsight/          # HindsightService, client.py, schemas.py
│   │   ├── services/           # IncidentService (CRUD, analyze, recommend, resolve, postmortem, learn)
│   │   ├── models/             # SQLAlchemy IncidentModel
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── core/config.py      # Environment settings and CORS configuration
│   │   └── db/session.py       # Async SQLite database session
│   ├── tests/                  # Unit and integration pytest suite
│   ├── requirements.txt
│   └── README.md
│
├── data/
│   ├── scenarios/              # Primary demo scenarios (INC-2026-001, INC-2026-002, INC-2026-003)
│   └── seed/seed_data.py
│
├── docs/                       # Official architectural documentation
│   ├── ARCHITECTURE.md         # System design & component boundaries
│   ├── API.md                  # REST contract specification
│   ├── DEMO.md                 # 2-3 minute presentation script & checklist
│   ├── HINDSIGHT.md            # Memory retain/recall architecture
│   ├── DECISIONS.md            # Architectural Decision Records (ADRs)
│   └── TEAM_OWNERSHIP.md       # 4-workstream organization
│
├── scripts/
│   ├── seed_demo.py            # Deterministic demo database reset
│   ├── verify_final_demo.py    # Golden Path automated validation script
│   ├── verify_phase4_evaluation.py # Latency and recommendation provenance evaluation
│   ├── verify_phase3_loop.py   # End-to-end backend integration loop
│   └── run_milestone1_demo.py  # Standalone CLI memory loop
│
├── .env.example                # Root environment variables template
└── README.md                   # This document
```

---

## 9. Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher (with npm)
- Git

### Installation
Clone the repository and install dependencies:
```bash
# 1. Clone repository
git clone https://github.com/siddharthg-7/Incident-Response-Agent.git
cd Incident-Response-Agent

# 2. Setup backend virtualenv & install dependencies
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r backend/requirements.txt

# 3. Setup frontend dependencies
cd frontend
npm install
cd ..
```

---

## 10. Environment Variables

Create environment configuration files from templates:

### Root `.env` (Backend Configuration)
```bash
cp .env.example .env
```
Key configuration parameters:
| Parameter | Default | Purpose |
| :--- | :--- | :--- |
| `API_HOST` | `0.0.0.0` | Host IP binding for FastAPI |
| `API_PORT` | `8000` | Port for REST API server |
| `CORS_ORIGINS` | `["http://localhost:5173","http://localhost:3000"]` | Allowed frontend origins |
| `DATABASE_URL` | `sqlite+aiosqlite:///./sentinel_memory.db` | Async SQLite database path |
| `HINDSIGHT_MODE` | `mock` | `mock` for local deterministic testing, `client` for Hindsight Cloud |
| `HINDSIGHT_BANK_ID` | `sentinel-incident-memory` | Target memory bank name |

### Frontend `.env`
```bash
cp frontend/.env.example frontend/.env
```
| Parameter | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8000` | Target FastAPI backend URL |
| `VITE_USE_MOCK_API` | `false` | `false` to connect to real backend; `true` for offline demo mode |

---

## 11. Running the System

### Terminal 1: Backend Service
```bash
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```
- API Health Status: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Interactive OpenAPI Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Terminal 2: Frontend Dashboard
```bash
cd frontend
npm run dev
```
- Application Web App: [http://localhost:5173](http://localhost:5173)

---

## 12. Demo Setup & Deterministic Reset
To reset the demonstration database to the pristine Golden Path state prior to a presentation:
```bash
python scripts/seed_demo.py
```

---

## 13. Verification Commands

Run the comprehensive test and evaluation suite:

```bash
# 1. Frontend TypeScript typecheck:
npm --prefix frontend run typecheck

# 2. Frontend production bundle build:
npm --prefix frontend run build

# 3. Backend unit and integration test suite:
pytest backend/tests -v

# 4. Golden Path end-to-end verification:
python scripts/verify_final_demo.py

# 5. Phase 4 reliability and recommendation provenance evaluation:
python scripts/verify_phase4_evaluation.py
```

---

## 14. 2–3 Minute Presentation Demo Flow

| Time | Stage | Action / URL | Key Takeaway |
| :--- | :--- | :--- | :--- |
| `0:00-0:20` | **Problem** | `/dashboard` | SOC amnesia crisis: without memory, each alert is investigated from zero. |
| `0:20-0:50` | **Incident 1** | `/incidents/INC-2026-001` | SSH brute force on `bastion-01`. Root cause: password auth enabled after package update. |
| `0:50-1:10` | **Resolution & Learning** | `/incidents/INC-2026-001` | Analyst resolves case, documents post-mortem, and commits experience to Hindsight. |
| `1:10-1:30` | **Incident 2** | `/incidents/INC-2026-002` | Similar SSH attack on `app-prod-04`. Analyst clicks **Analyze Threat Telemetry**. |
| `1:30-1:55` | **Hindsight Recall** | `/incidents/INC-2026-002` | Hindsight recalls `INC-2026-001` (84.6% match). Past root cause and zero breach outcome shown. |
| `1:55-2:20` | **Recommendation** | `/incidents/INC-2026-002` | Memory-informed directives: `CRITICAL AUDIT` and `PREVENTION RUNBOOK`. Analyst approves actions. |
| `2:20-2:40` | **Learning Loop** | `/learning` | Organizational MTTR reduction. *"The system remembers what happened, what worked, and improves."* |

---

## 15. Feature Freeze Statement
Sentinel Memory is in **FINAL SHIP (Feature Freeze)** state. All core architectural commitments, Hindsight memory adapters, backend services, SOC investigation UI, and automated evaluation harnesses are verified and operational.
