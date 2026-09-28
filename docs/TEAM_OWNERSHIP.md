# Sentinel Memory - Team Ownership & Workstreams

To allow four engineers to develop in parallel without stepping on each other's work, the repository is divided into four distinct workstreams with explicit ownership boundaries.

---

## Member 1: AI + Memory Orchestration Lead
- **Primary Branch**: `feature/hindsight-agent`
- **Ownership Scope**:
  - `backend/app/hindsight/` (Hindsight SDK integration, client adapter, memory banks)
  - `backend/app/agents/` (Incident Analyzer, Response Planner, Orchestrator)
  - Memory extraction: translating raw alerts and post-mortems into Hindsight experiences
  - Prompt engineering and LLM provider interfaces (Groq, OpenAI, etc.)
  - Similarity thresholds, recall strategies, and reflection logic

---

## Member 2: Backend Core & Database Lead
- **Primary Branch**: `feature/backend-api`
- **Ownership Scope**:
  - `backend/app/api/` (FastAPI route controllers, query params, error handling)
  - `backend/app/models/` & `backend/app/db/` (SQLAlchemy ORM models, migrations, DB session management)
  - `backend/app/schemas/` (Pydantic validation models, request/response contracts)
  - `backend/app/services/` (Incident service, persistence, lifecycle state transitions)
  - Backend integration tests and API performance

---

## Member 3: Frontend & SOC Experience Lead
- **Primary Branch**: `feature/soc-dashboard`
- **Ownership Scope**:
  - `frontend/src/pages/` (Dashboard, Incident Investigation, Memory Bank, Learning screens)
  - `frontend/src/components/` (SOC timeline, severity badges, IOC chips, memory comparison views)
  - `frontend/src/services/api.ts` (Typed API client integration)
  - UI state management, responsiveness, accessibility, and analyst workflow UX

---

## Member 4: Data, Evaluation, & Integration Lead
- **Primary Branch**: `feature/data-evaluation`
- **Ownership Scope**:
  - `data/scenarios/` (Realistic synthetic incident datasets: SSH brute force, credential stuffing, DDoS)
  - `scripts/` (Milestone 1 demo script, data seeder, automated benchmark scripts)
  - End-to-end integration tests (`backend/tests/integration/test_milestone1_loop.py`)
  - Evaluation framework: measuring recommendation quality "WITH Memory" vs "WITHOUT Memory"
  - CI/CD automation and containerized deployment configs

---

## Shared Responsibilities
- **Integration**: All team members participate in cross-branch PR reviews.
- **Contract Adherence**: Schema changes in `backend/app/schemas/` must be synchronized with `frontend/src/types/`.
- **Security Baseline**: No secrets in Git; untrusted LLM outputs must never trigger unvalidated system commands.
