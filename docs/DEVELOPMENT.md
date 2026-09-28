# Sentinel Memory - Developer Onboarding & Quickstart

This guide gets developers up and running with Sentinel Memory in under 5 minutes.

---

## Prerequisites

- **Python**: 3.10+ (tested with Python 3.10 through 3.14)
- **Node.js**: 18+ (tested with Node v20 / v22)
- **Git**

---

## 1. Quickstart

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/siddharthg-7/Incident-Response-Agent.git
cd Incident-Response-Agent

# Copy the configuration template
cp .env.example .env
```

### Step 2: Install Backend Dependencies
```bash
cd apps/api
pip install -r requirements.txt
cd ../..
```

### Step 3: Run the Milestone 1 Demo (Verify Everything Works!)
```bash
python scripts/run_milestone1_demo.py
```
This runs the full **Incident 1 → Analysis → Retain → Incident 2 → Recall → Improved Recommendation** loop right in your terminal.

---

## 2. Running the Full Stack

### Running Backend API Server
```bash
# From workspace root:
npm run dev:api
# Or directly via uvicorn:
python -m uvicorn app.main:app --app-dir apps/api --reload --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### Running Frontend Dashboard
```bash
# Install frontend dependencies (first time only)
cd apps/web
npm install
cd ../..

# Start Vite dev server:
npm run dev:web
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 3. Running Automated Tests

Run the test suite:
```bash
pytest apps/api/tests -v
```

All tests run using the decoupled `MockHindsightAdapter`, ensuring 100% offline test reliability with zero external service requirements.

---

## 4. Switching from Mock to Live Hindsight

To connect to a live Hindsight instance (Hindsight Cloud or self-hosted Docker):

1. Install the official client:
   ```bash
   pip install hindsight-client
   ```
2. Update `.env`:
   ```ini
   HINDSIGHT_MODE=client
   HINDSIGHT_BASE_URL=http://localhost:8888  # or your Hindsight Cloud endpoint
   HINDSIGHT_API_KEY=your_hindsight_api_key_if_cloud
   ```
3. Restart the backend API.
