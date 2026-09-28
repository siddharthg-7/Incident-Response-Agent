# Sentinel Memory - Frontend Web Application

A high-performance, dark-themed SOC analyst investigation interface built for **Sentinel Memory** (Hindsight-powered Incident Response Agent).

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Lucide Icons (`lucide-react`)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: Native Fetch with Mock Mode fallback

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/         # LoadingState, ErrorState, EmptyState
│   │   ├── layout/         # Navbar, Sidebar
│   │   └── ui/             # Badges, status pills
│   ├── pages/
│   │   ├── DashboardPage.tsx       # SOC overview & metrics
│   │   ├── IncidentsPage.tsx       # Incident queue with search/filter
│   │   ├── IncidentDetailPage.tsx  # Investigation workspace, recall & recommendations
│   │   ├── MemoryPage.tsx          # Hindsight memory capsules & bank
│   │   └── LearningPage.tsx        # Before vs After memory comparison
│   ├── layouts/
│   │   └── Layout.tsx              # Shell layout with top nav & sidebar
│   ├── services/
│   │   ├── api.ts                  # Centralized API service with mock fallback
│   │   └── mockData.ts             # Deterministic synthetic SOC data
│   ├── types/
│   │   └── index.ts                # TypeScript domain models and API contracts
│   ├── App.tsx                     # Top-level client route definitions
│   ├── main.tsx                    # React DOM entrypoint
│   └── vite-env.d.ts               # Vite environment typing declarations
├── public/                         # Static assets
├── tests/                          # Frontend tests
├── .env.example                    # Environment configuration template
├── package.json                    # Dependencies & build scripts
├── tsconfig.json                   # Strict TypeScript compiler options
└── vite.config.ts                  # Vite build configuration
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8000` | URL of the Sentinel Memory FastAPI backend |
| `VITE_USE_MOCK_API` | `false` | When `false`, connects to real backend; when `true`, operates in standalone mock mode |

## Installation & Setup

```bash
cd frontend
npm install
```

## Running Locally

### Option A: Connected to Live FastAPI Backend (Phase 3 Mode)

1. Start the FastAPI backend:
```bash
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

2. In a separate terminal, launch the frontend:
```bash
cd frontend
npm run dev
```

The top navigation bar will display **FastAPI: Connected** (green pulsing badge) and live SQLite incidents (`INC-2026-001`, `INC-2026-002`, `INC-2026-003`).

### Option B: Standalone Mock Mode

Set `VITE_USE_MOCK_API=true` in `frontend/.env` to run 100% offline with zero external dependencies.

---

## Phase 3 End-to-End Loop Demonstration

Sentinel Memory's core value is proven through the complete memory retention & recall cycle:

1. **Step 1 — Ingest / Select Incident 1 (`INC-2026-001`)**:
   - Navigate to `/incidents/INC-2026-001`.
   - Execute **Resolve**: Record containment actions (IP firewall drop, credential revocation).
   - Execute **Post-Mortem**: Document root cause and preventive lessons.
   - Click **Learn & Retain in Memory**: The resolution and post-mortem are retained into Hindsight memory.
2. **Step 2 — Investigate Incident 2 (`INC-2026-002`)**:
   - Navigate to `/incidents/INC-2026-002` (a subsequent SSH brute force on `app-prod-04`).
   - Click **Analyze Incident**: Evaluates threat tactics and observables.
   - Click **Generate Recommendations**: Hindsight automatically recalls the experience from `INC-2026-001` (84%+ similarity match).
   - Observe **Memory-Informed Recommendations**: Notice the direct injection of previous outcomes, `CRITICAL AUDIT` warning, and `PREVENTION RUNBOOK` derived from `INC-2026-001`.
3. **Step 3 — Inspect Memory Bank & Timeline**:
   - Navigate to `/memory` to view live memory capsules.
   - Navigate to `/learning` to view the chronological learning timeline and Before vs. After metrics.

---

## Quality & Build Verification

```bash
# Typecheck TypeScript code:
npm run typecheck

# Production bundle build:
npm run build

# Run automated end-to-end backend validation script:
python scripts/verify_phase3_loop.py
```
