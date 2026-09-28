# Sentinel Memory - Backend Service

FastAPI-powered asynchronous backend implementing the Sentinel Memory agent, REST API, and Hindsight abstraction.

## Directory Layout

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/             # REST Route handlers (/health, /api/incidents)
│   │   └── dependencies/       # FastAPI dependency injection (e.g. get_db)
│   ├── agents/
│   │   ├── incident_agent/     # Orchestrator coordinating full response loop
│   │   ├── analyzer/           # Threat classification and indicator extraction
│   │   └── response_planner/   # Response recommendation synthesizer
│   ├── hindsight/
│   │   ├── client.py           # Client factory & connection handling
│   │   ├── service.py          # Outcome-oriented experience management
│   │   └── schemas.py          # Memory record and recall request schemas
│   ├── services/
│   │   ├── incident_service.py # Persistence and lifecycle orchestration
│   │   ├── analysis_service.py # Analysis boundary
│   │   ├── recommendation_service.py # Memory-enriched response planner
│   │   └── learning_service.py # Hindsight retention coordinator
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic v2 schemas
│   ├── db/                     # Async engine & sessionmaker
│   ├── core/                   # Application settings (.env)
│   ├── utils/                  # Structured logger & helpers
│   └── main.py                 # FastAPI application entrypoint
├── tests/
│   ├── unit/                   # Isolated component tests
│   ├── integration/            # Full API & memory loop tests
│   └── fixtures/               # Test fixtures and scenario payloads
├── requirements.txt
├── .env.example
└── README.md
```

## Setup & Running

```bash
# From workspace root:
npm run dev:backend

# Or directly:
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

## Running Tests

```bash
python -m pytest backend/tests -v
```
