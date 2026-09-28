# Sentinel Memory - Frontend Web Application

React 18 + Vite + TypeScript + Tailwind CSS frontend dashboard for SOC analysts.

## Directory Layout

```
frontend/
├── src/
│   ├── components/     # Reusable UI components (Navbar, Sidebar, Badges)
│   ├── pages/          # Dashboard, Incident Queue, Investigation, Memory Bank, Learning
│   ├── layouts/        # Application layout shells
│   ├── features/       # Feature-specific modules
│   ├── services/       # API abstraction (api.ts with Mock Mode & Real Mode)
│   ├── hooks/          # Custom React hooks (e.g. useIncidents)
│   ├── types/          # Shared domain TypeScript interfaces
│   ├── lib/            # Utility helpers (cn, formatting)
│   ├── assets/         # Static imagery and branding assets
│   ├── config/         # Constants and theme tokens
│   ├── App.tsx         # Route definitions
│   └── main.tsx        # React entrypoint
├── public/             # Static public assets
├── tests/              # Frontend smoke and routing tests
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript compiler options
├── .env.example        # Environment variable template
└── README.md
```

## Running Independently

The frontend can run completely independently with mock data or connect to the live backend.

```bash
cd frontend
npm install

# Start development server:
npm run dev
```

The application runs on [http://localhost:5173](http://localhost:5173).

### Mock Mode vs Real API Mode

Controlled in `frontend/.env`:
- `VITE_USE_MOCK=true`: Runs completely offline using rich built-in incident scenarios.
- `VITE_USE_MOCK=false`: Connects to `VITE_API_URL` (default `http://localhost:8000`).
