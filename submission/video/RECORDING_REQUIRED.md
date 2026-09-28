# Screen Capture Action: Manual Recording Required

> **Notice**: Antigravity's headless execution environment cannot capture physical display pixels, sound cards, or microphone inputs. In accordance with the project instructions (**"DO NOT create a fake video file"**), the actual 2–3 minute video capture must be recorded directly on your machine following this verified runbook.

---

## 1. Exact Startup Instructions

Open two terminal windows (or verify your existing running background processes):

### Terminal 1: Backend API Service
```bash
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### Terminal 2: Frontend Dashboard
```bash
cd frontend
npm run dev
```

### Deterministic Pre-Recording Reset
Before hitting record, run this command to seed the clean Golden Path state:
```bash
python scripts/seed_demo.py
```

---

## 2. Exact Browser URL

Open your browser to:
**`http://localhost:5173/dashboard`**

- **Display Settings**: Maximize the browser window at 1920x1080 (16:9).
- **Zoom**: Set browser zoom to **110%** (`Ctrl + Plus` once) for crisp font clarity.
- **Bookmarks**: Hide the bookmarks bar (`Ctrl + Shift + B`).

---

## 3. Exact Recording Sequence (8 Clicks)

Press **`Win + Alt + R`** (Windows Game Bar) or click **Start Recording** in OBS / Loom:

1. **`0:00–0:15` | Dashboard**:
   - Begin on `/dashboard`.
   - Voiceover: *"Welcome to Sentinel Memory. An autonomous cybersecurity Incident Response Agent powered by Hindsight—an agent that learns from previous security incidents rather than investigating every alert from scratch."*
2. **`0:15–0:40` | Incident 1 (`INC-2026-001`)**:
   - Click **INC-2026-001** (`High Volume SSH Authentication Failure on Bastion-01`).
   - Voiceover: *"Here is Incident 1: 14,200 failed SSH logins hitting our DMZ bastion. Threat analysis classifies this as a MITRE ATT&CK T1110 password guessing attack. A standard agent would merely say 'block the IP'."*
3. **`0:40–1:00` | Resolution & Root Cause**:
   - Scroll to Resolution and click **Record Resolution**.
   - Voiceover: *"The analyst blocks the IP, but discovers the true root cause: an OS package update had overwritten sshd_config, enabling password authentication."*
4. **`1:00–1:15` | Hindsight Retention**:
   - Click the green **Post-Mortem & Retain** button.
   - Voiceover: *"The critical step is that the resolved incident becomes reusable experience. We click 'Post-Mortem & Retain', and Hindsight commits this complete capsule into our memory bank."*
5. **`1:15–1:35` | Incident 2 (`INC-2026-002`)**:
   - Navigate to `/incidents`, click **INC-2026-002**, then click **Analyze Threat Telemetry**.
   - Voiceover: *"Weeks later, a completely different external IP hits internal server app-prod-04. This incident looks similar, but the system now has experience from the previous incident."*
6. **`1:35–1:55` | Hindsight Recall**:
   - Click the purple **Recall & Recommend** button. Highlight the recall card.
   - Voiceover: *"Watch Hindsight in action. The agent retrieves from our memory bank and matches INC-2026-001 with an 84.8% similarity score! The analyst sees the exact historical precedent: the package upgrade root cause and the zero-breach outcome."*
7. **`1:55–2:20` | Memory-Informed Recommendation & Action**:
   - Scroll to the purple **Memory Influence Provenance** banner. Click **Approve Action** on Directive 2 (CRITICAL AUDIT), then click **Mark Executed**.
   - Voiceover: *"Alongside standard firewall drops, the agent injects a CRITICAL AUDIT to inspect sshd_config on app-prod-04 immediately, plus the PREVENTION RUNBOOK. The analyst approves and executes the directive before the attacker breaches the system."*
8. **`2:20–2:40` | Learning & Evolution**:
   - Click **Learning** in the left sidebar (`/learning`).
   - Voiceover: *"Sentinel Memory turns incident history into operational experience. As memories accumulate, organizational MTTR drops by 68%. Sentinel Memory: powered by Hindsight. Thank you."*

Press **`Win + Alt + R`** (or Stop in OBS) to conclude recording.

---

## 4. Exact Expected Result

1. `INC-2026-001` transitions from `NEW` → `RESOLVED` → `POSTMORTEM_COMPLETE` with experience retained in bank `sentinel-incident-memory`.
2. `INC-2026-002` recalls `INC-2026-001` with **84.8% cosine similarity**.
3. Recommendation directives clearly exhibit memory provenance (`CRITICAL AUDIT` & `PREVENTION RUNBOOK`).
4. Learning page demonstrates MTTR drop and timeline evolution.

---

## 5. Final Output Filename & Location

Save or copy the resulting MP4 file to:
**`submission/video/sentinel-memory-demo.mp4`**

Example command to copy from default Windows Game Bar capture folder:
```bash
copy "$HOME\Videos\Captures\*.mp4" "submission\video\sentinel-memory-demo.mp4"
```

Verify your completed video:
```bash
python submission/video/verify_video.py
```
