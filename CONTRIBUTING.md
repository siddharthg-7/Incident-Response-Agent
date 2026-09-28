# Contributing to Sentinel Memory

Welcome to Sentinel Memory! We follow structured Git and code-quality workflows to enable four developers to collaborate without architectural or merge conflicts.

---

## 1. Branch Strategy

We maintain a protected `main` branch. Individual workstreams operate on designated feature branches:

| Branch Name | Primary Owner | Focus Area |
| :--- | :--- | :--- |
| `feature/hindsight-agent` | Member 1 (AI / Memory) | Hindsight adapter, agent orchestration, recall/retain pipeline |
| `feature/backend-api` | Member 2 (Backend) | FastAPI endpoints, DB schema, data models, validation |
| `feature/soc-dashboard` | Member 3 (Frontend) | React dashboard, investigation UI, memory graph visualization |
| `feature/data-evaluation` | Member 4 (Data / Eval) | Scenarios, automated testing, demo flow, benchmarks |

### Creating a Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/<branch-name>
```

---

## 2. Commit Message Convention

We follow standard Conventional Commits:

```
<type>(<scope>): <short description>
```

### Types:
- `feat`: A new feature or capability
- `fix`: A bug fix
- `refactor`: Code reorganization with no functional change
- `test`: Adding or updating test cases
- `docs`: Documentation updates
- `chore`: Dependency updates, tooling, config

### Examples:
- `feat(hindsight): implement mock memory adapter with semantic scoring`
- `feat(api): add /api/incidents/{id}/recommend endpoint`
- `test(orchestrator): add end-to-end memory recall validation test`
- `docs(demo): record step-by-step SSH brute force demo script`

---

## 3. Pull Request Guidelines

1. **Keep PRs atomic and focused** on a single functional task.
2. **Ensure all tests pass** locally before pushing:
   ```bash
   pytest apps/api/tests
   ```
3. **No secrets in commits**: Verify `.env` is never added.
4. **Draft PRs early** for architectural visibility among teammates.

---

## 4. Code Quality Standards

- **Python**: Follow PEP 8 guidelines. Type hints are mandatory on all public interfaces and service methods.
- **TypeScript**: Strict mode enabled. No `any` types for domain objects—use interfaces from `@/types`.
- **Security Baseline**:
  - LLM outputs are treated as untrusted data.
  - Never execute arbitrary commands or shell scripts from model outputs.
  - Separate AI recommendations from automated execution; analyst review is mandatory for MVP.
