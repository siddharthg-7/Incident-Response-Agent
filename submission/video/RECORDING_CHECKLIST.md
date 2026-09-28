# Sentinel Memory - Video Recording Checklist

Use this pre- and post-recording checklist to ensure the demonstration video meets all hackathon standards on the first take.

---

## BEFORE RECORDING

- [ ] **Backend Running**: FastAPI is active on `http://127.0.0.1:8000` (`GET /health` returns `healthy`).
- [ ] **Frontend Running**: Vite dev server is active on `http://localhost:5173`.
- [ ] **Database Available**: SQLite database (`sentinel_memory.db`) tables initialized.
- [ ] **Hindsight Available**: Memory bank `sentinel-incident-memory` ready (`HINDSIGHT_MODE=mock` or `client`).
- [ ] **LLM Available**: Provider initialized (`LLM_PROVIDER=mock`, `groq`, or `openai`).
- [ ] **Demo Data Seeded**: Executed `python scripts/seed_demo.py` for a clean reset.
- [ ] **INC-2026-001 Available**: SSH brute-force on `bastion-01` (`status: NEW`).
- [ ] **INC-2026-002 Available**: SSH brute-force on `app-prod-04` (`status: NEW`).
- [ ] **Golden Path Verified**: `python scripts/verify_final_demo.py` passes 100%.
- [ ] **Browser Clean**: Browser window maximized, extraneous tabs closed, clean profile.
- [ ] **No Unnecessary Tabs**: Only `http://localhost:5173` is open.
- [ ] **No Personal Information Visible**: Bookmarks bar hidden (`Ctrl + Shift + B`), no personal folders or emails visible.
- [ ] **Browser Zoom Appropriate**: Set zoom to **110%** (`Ctrl + Plus` once) for crisp font rendering.
- [ ] **Terminal/Debug Windows Hidden**: Minimize PowerShell/terminal windows; recording window must show only the web app.
- [ ] **Notifications Disabled**: Windows Focus Assist / Do Not Disturb enabled to prevent notification popups.
- [ ] **Recording Resolution Checked**: Resolution set to 1920x1080 (16:9).
- [ ] **Microphone Checked**: Input volume level verified; no background hiss or clipping.

---

## DURING RECORDING

- [ ] **Keep Cursor Controlled**: Move cursor smoothly between buttons; avoid erratic or rapid mouse movements.
- [ ] **Avoid Unnecessary Scrolling**: Scroll only when moving to sections (Resolution, Recommendations).
- [ ] **Do Not Expose Credentials**: Keep password, API key, or terminal environment inputs off-screen.
- [ ] **Do Not Expose Local File Paths**: Do not bring Windows Explorer or local file paths into the frame.
- [ ] **Pause Briefly on Hindsight Recall**: Hold on the **Relevant Past Incidents** card and the 84.8% match for 2–3 seconds.
- [ ] **Clearly Show Previous Incident**: Point cursor to the past root cause (package update enabled password auth) and historical outcome.
- [ ] **Clearly Show Recommendation Provenance**: Highlight the purple `CRITICAL AUDIT` and `PREVENTION RUNBOOK` tags.
- [ ] **Keep Within 2–3 Minutes**: Follow the timing cues in `TIMECODED_SCRIPT.md` (target: 02:30).

---

## AFTER RECORDING

- [ ] **Video Plays Correctly**: Open recording in media player and check playback from 0:00 to end.
- [ ] **Audio is Understandable**: Voiceover is clear, well-leveled, and synchronized with screen actions.
- [ ] **No Accidental Personal Information**: Verified that no taskbar notifications, usernames, or emails appeared.
- [ ] **No API Keys Visible**: No secret tokens or keys visible on screen.
- [ ] **No Terminal Credentials Visible**: No backend terminal passwords or tokens shown.
- [ ] **Hindsight Recall is Visible**: 84.8% match score and historical precedent are clearly legible.
- [ ] **Recommendation is Visible**: Memory-informed directives are prominent.
- [ ] **Final File Saved in `submission/video/`**: File is placed at `submission/video/sentinel-memory-demo.mp4`.
- [ ] **Filename is Correct**: Exact name: `sentinel-memory-demo.mp4`.
- [ ] **Verification Script Passed**: `python submission/video/verify_video.py` passes with zero errors.
