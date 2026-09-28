# Sentinel Memory

> A Hindsight-powered Cybersecurity Incident Response Agent that remembers past investigations, root causes, and outcomes to continuously improve future recommendations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Hindsight Memory](https://img.shields.io/badge/Hindsight-Persistent%20Memory-purple.svg)](https://github.com/vectorize-io/hindsight)

---

## Problem

Security teams repeatedly encounter similar incidents and lose valuable knowledge from previous investigations and resolutions. Traditional chatbots and stateless RAG systems treat every alert in isolation, suggesting the same generic perimeter containment without recalling what actually caused previous incidents or what post-mortem lessons were learned.

---

## Solution

Sentinel Memory uses **Hindsight** (`vectorize-io/hindsight`) to remember incident experiences and use them during future incident response. Instead of raw text chunks, Sentinel stores structured outcome capsules (root cause, actions taken, outcome, lessons learned) and retrieves them using biomimetic multi-strategy recall when similar threats occur.

---

## Core Flow

```
Detect
  ↓
Analyze
  ↓
Recall (Hindsight)
  ↓
Recommend
  ↓
Resolve (Analyst)
  ↓
Retain (Hindsight)
  ↓
Improve
```

---

## Architecture

```
Frontend (React + Vite + TypeScript + Tailwind CSS)
      ↓  REST API (VITE_API_URL)
FastAPI Backend
      ↓
Agent Layer
├── LLM Provider (Provider Agnostic: Groq / Llama / Mock)
└── Hindsight Memory Layer (HindsightService Adapter)
      ├── Mock Adapter (Offline development / testing)
      └── Client Adapter (Hindsight Cloud or self-hosted daemon)
      ↓
Database (PostgreSQL / SQLite local development)
```

---

## Project Structure

```
sentinel-memory/
├── frontend/                   # React 18 + Vite + TypeScript application
│   ├── src/
│   │   ├── components/         # Reusable UI widgets
│   │   ├── pages/              # /dashboard, /incidents, /memory, /learning
│   │   ├── layouts/            # Top-level application layout
│   │   ├── features/           # Domain feature modules
│   │   ├── services/           # api.ts (Supports MOCK MODE and REAL API MODE)
│   │   ├── hooks/              # Custom React hooks (useIncidents)
│   │   ├── types/              # Domain TypeScript types
│   │   ├── lib/                # Utility helpers
│   │   ├── assets/             # Static brand assets
│   │   ├── config/             # Theme tokens & constants
│   │   ├── App.tsx             # Application router
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static public files
│   ├── tests/                  # Frontend tests
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite build config
│   ├── tsconfig.json           # TypeScript configuration
│   ├── .env.example            # Frontend environment template
│   └── README.md
│
├── backend/                    # FastAPI Backend Service
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/         # REST API routes (/health, /api/incidents)
│   │   │   └── dependencies/   # Dependency injection providers
│   │   ├── agents/
│   │   │   ├── incident_agent/ # SentinelOrchestrator
│   │   │   ├── analyzer/       # IncidentAnalyzer (MITRE ATT&CK extraction)
│   │   │   └── response_planner/# ResponsePlanner (Evidence + Memory synthesis)
│   │   ├── hindsight/
│   │   │   ├── client.py       # Hindsight client connector
│   │   │   ├── service.py      # Outcome-oriented memory service
│   │   │   └── schemas.py      # Memory schemas
│   │   ├── services/
│   │   │   ├── incident_service.py
│   │   │   ├── analysis_service.py
│   │   │   ├── recommendation_service.py
│   │   │   └── learning_service.py
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic v2 schemas
│   │   ├── db/                 # Async session and table creation
│   │   ├── core/               # Configuration settings
│   │   ├── utils/              # Structured logger
│   │   └── main.py             # FastAPI entrypoint
│   ├── tests/
│   │   ├── unit/               # Isolated unit tests
│   │   ├── integration/        # API and end-to-end memory loop tests
│   │   └── fixtures/           # Mock data and test fixtures
│   ├── requirements.txt        # Python backend dependencies
│   ├── .env.example            # Backend environment template
│   └── README.md
│
├── data/                       # Synthetic cybersecurity datasets
│   ├── incidents/              # Raw incident logs and dumps
│   ├── scenarios/              # Primary demo scenarios (SSH Brute Force, Credential Stuffing)
│   └── README.md
│
├── docs/                       # Architectural & design documentation
│   ├── ARCHITECTURE.md         # Detailed system design & component separation
│   ├── API.md                  # Frontend ↔ Backend contract specification
│   ├── HINDSIGHT.md            # Memory architecture, TEMPR recall, adapter pattern
│   ├── DEMO.md                 # 2-3 minute official demonstration script
│   ├── DECISIONS.md            # Architecture Decision Records (ADR-001 to ADR-007)
│   └── TEAM_OWNERSHIP.md       # 4-member parallel workstream breakdown
│
├── scripts/
│   └── run_milestone1_demo.py  # Standalone CLI demo of the central learning loop
│
├── .gitignore                  # Git exclusions (.env, node_modules, dist, *.db)
├── .env.example                # Root environment template
├── CONTRIBUTING.md             # Git branch and commit standards
├── LICENSE                     # MIT License
└── package.json                # Root convenience scripts
```

---

## Running Locally

### 1. Terminal 1: Backend
```bash
# Navigate to backend and install requirements:
cd backend
pip install -r requirements.txt

# Start FastAPI server:
python -m uvicorn app.main:app --reload --port 8000
```
- Health check: [http://localhost:8000/health](http://localhost:8000/health)
- Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Terminal 2: Frontend
```bash
# Navigate to frontend and install dependencies:
cd frontend
npm install

# Start Vite development server:
npm run dev
```
- Frontend application: [http://localhost:5173](http://localhost:5173)

### 3. Verify the Core Milestone 1 Memory Loop
Run the standalone end-to-end learning loop in your terminal:
```bash
python scripts/run_milestone1_demo.py
```

### 4. Run Automated Tests
```bash
python -m pytest backend/tests -v
```

---

## Team Structure (Four Workstreams)

To allow four developers to build simultaneously without merge conflicts:

| Member | Focus Area | Primary Directories | Feature Branch |
| :--- | :--- | :--- | :--- |
| **Member 1** | AI + Hindsight | `backend/app/agents/`, `backend/app/hindsight/` | `feature/hindsight-agent` |
| **Member 2** | Backend & Database | `backend/app/api/`, `backend/app/services/`, `backend/app/models/`, `backend/app/db/` | `feature/backend-api` |
| **Member 3** | Frontend & UX | `frontend/` | `feature/soc-dashboard` |
| **Member 4** | Data + Testing + Eval | `data/`, `backend/tests/`, `frontend/tests/`, `docs/` | `feature/data-testing` |

---

## Current Status

**FOUNDATION / INITIAL SETUP**

- The clean frontend/backend architecture is established and runs independently.
- The Hindsight abstraction layer is implemented with both Mock and Client adapters.
- The Milestone 1 central loop (*Incident JSON → Analysis → Retain → Incident 2 → Recall → Enriched Recommendation*) is verified and tested.
- Authentication, complex autonomous SIEM features, and production Kubernetes deployments are intentionally deferred to future milestones to preserve focus on core memory learning.
