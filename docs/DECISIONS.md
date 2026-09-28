# Architecture Decision Records (ADRs)

## ADR-001: FastAPI for Backend Services
- **Status**: Accepted
- **Context**: Incident response workflows require rapid async I/O, strict JSON data validation, automatic OpenAPI documentation, and Python-native AI integration.
- **Decision**: Use FastAPI with Pydantic v2.
- **Consequences**: Python allows direct integration with Hindsight SDK, Groq/OpenAI clients, and data science tooling.

---

## ADR-002: React with Vite and TypeScript for Frontend
- **Status**: Accepted
- **Context**: The SOC analyst dashboard requires responsive interaction, real-time inspection of incident timelines, and clear visualization of memory associations.
- **Decision**: Use React 18 + Vite + TypeScript + Tailwind CSS.
- **Consequences**: Fast build cycles, strong type safety sharing domain types with the backend, and rapid component development.

---

## ADR-003: Hindsight as the Persistent Agent-Memory Layer
- **Status**: Accepted
- **Context**: Standard RAG only recalls text fragments by vector similarity and lacks concept networks (World Facts, Experiences, Observations, Opinions) and biomimetic multi-strategy recall (TEMPR).
- **Decision**: Treat Hindsight as the primary agent memory engine.
- **Consequences**: Retain structured experience capsules (incident context + root cause + actions + outcome + lessons) rather than unstructured chunks.

---

## ADR-004: Adapter Pattern for Hindsight Service
- **Status**: Accepted
- **Context**: Developers need to run tests and develop features offline without requiring an active Hindsight cloud key or local Docker service running. Furthermore, hackathon evaluation may run in environments with varying connectivity.
- **Decision**: Decouple `HindsightService` via `BaseHindsightAdapter`, offering both `HindsightClientAdapter` and `MockHindsightAdapter`.
- **Consequences**: Immediate developer onboarding and 100% test reliability with zero external dependencies, while fully supporting live Hindsight deployments via configuration.

---

## ADR-005: Outcome-Oriented Memory over Raw Event Logging
- **Status**: Accepted
- **Context**: Remembering raw alerts creates noisy, low-value memory. Effective SOC knowledge is centered around what caused the incident, what fixed it, and what should be prevented.
- **Decision**: Store structured capsules encompassing Root Cause, Action, Outcome, and Post-Mortem.
- **Consequences**: Future recommendations directly address known root causes and prevent recurring mistakes.

---

## ADR-006: Recommendation-First (No Autonomous Remediation in MVP)
- **Status**: Accepted
- **Context**: Automated execution of firewall rules or system shutdowns carries severe operational risk.
- **Decision**: The agent provides structured recommendations, evidence, and confidence scores for human analyst approval.
- **Consequences**: Safe for enterprise cybersecurity contexts; fulfills hackathon requirements without uncontrolled destructive side-effects.

---

## ADR-007: SQLite Default with PostgreSQL Compatibility
- **Status**: Accepted
- **Context**: Developers need instant local spin-up with zero Docker setup, while production environments require PostgreSQL with async drivers.
- **Decision**: Use SQLAlchemy with async engines (`sqlite+aiosqlite` for local dev, `postgresql+asyncpg` for production).
- **Consequences**: Zero setup friction for new contributors; seamless production upgrade path.
