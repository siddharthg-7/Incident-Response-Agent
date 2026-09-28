# Sentinel Memory - SOC Web Dashboard

React 18 + Vite + TypeScript frontend dashboard for Security Operations Center (SOC) analysts.

## Features

- **SOC Dashboard**: Real-time KPI cards for pending incidents, retained Hindsight memories, and response performance.
- **Incident Investigation Queue**: Visual breakdown of incoming security alerts and historical response cases.
- **Investigation Workspace**: Detailed IOC telemetry, AI attack classification (MITRE ATT&CK), and Hindsight memory match visualization with similarity scoring.
- **Memory Bank Explorer**: Deep-dive into retained outcome-oriented experience capsules (Root Cause, Containment Actions, Post-Mortem lessons).
- **Learning & Evolution**: Side-by-side comparison of agent recommendations *Before* vs *After* memory retention.

## Running the Web Dashboard

```bash
# Install dependencies:
cd apps/web
npm install

# Start local Vite development server:
npm run dev
```

The application runs on [http://localhost:5173](http://localhost:5173) by default.
