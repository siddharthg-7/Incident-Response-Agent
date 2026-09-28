# Sentinel Memory - Backend API Service

FastAPI-powered asynchronous backend implementing the Sentinel Memory agent and REST API.

## Directory Layout

```
apps/api/
├── app/
│   ├── api/            # Route controllers (/health, /api/incidents)
│   ├── agents/         # AI Threat Analyzer, Response Planner, Orchestrator
│   ├── core/           # Pydantic Settings and configurations
│   ├── db/             # SQLAlchemy async engine, sessionmaker, table init
│   ├── models/         # SQLAlchemy ORM models
│   ├── schemas/        # Pydantic domain models and validation schemas
│   ├── services/       # Incident lifecycle service
│   ├── hindsight/      # Hindsight memory adapter and service abstraction
│   └── main.py         # Application entry point and lifespan
├── tests/              # Pytest test suite
└── requirements.txt    # Python dependencies
```

## Running the API Server

```bash
# From workspace root:
npm run dev:api

# Or directly:
python -m uvicorn app.main:app --app-dir apps/api --reload --port 8000
```

- Swagger API Explorer: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

## Running Backend Tests

```bash
pytest apps/api/tests -v
```
