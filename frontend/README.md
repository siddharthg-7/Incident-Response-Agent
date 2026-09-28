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
| `VITE_USE_MOCK_API` | `true` | When `true`, enables completely offline mock data mode |

## Installation & Setup

```bash
cd frontend
npm install
```

## Running Locally

To start the Vite development server:

```bash
npm run dev
```

The application will be accessible at:
[http://localhost:5173](http://localhost:5173)

### Routes Available

- `/dashboard` — SOC Overview, active incidents, memory bank statistics.
- `/incidents` — Incident queue with severity filters, statuses, and recall markers.
- `/incidents/:id` (e.g. `/incidents/test-incident`) — Detailed incident investigation workspace, root-cause analysis, recalled memories, and response recommendations.
- `/memory` — Retained experience capsules in Sentinel Incident Memory.
- `/learning` — Evolution matrix demonstrating agent performance without memory vs. with memory.

## Mock Mode Behavior

When `VITE_USE_MOCK_API=true`:
- The frontend operates **100% offline** without requiring the Python FastAPI backend or external databases.
- Synthetic incidents, recalled memory items, response recommendations, and resolution workflows load deterministically.
- Arbitrary route IDs such as `/incidents/test-incident` or custom incident IDs automatically resolve to realistic investigation workspace data.
- Safe toggling: Set `VITE_USE_MOCK_API=false` to route all calls directly to the live backend REST API at `VITE_API_URL`.

## Quality & Build Verification

```bash
# Typecheck and production bundle build:
npm run build

# Lint verification:
npm run lint
```
