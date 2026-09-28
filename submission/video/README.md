# Sentinel Memory Demo Video

Demonstration video assets and recording documentation for the Sentinel Memory hackathon submission.

---

## Final Recording

- **Filename**: `sentinel-memory-demo.mp4`
- **Target Path**: `submission/video/sentinel-memory-demo.mp4`
- **Target Resolution**: 1080p (`1920x1080` at 30/60 fps)
- **Container / Codec**: MP4 (`H.264 / AAC`)

---

## Duration

- **Planned Duration**: `02:30` (Target: 2–3 minutes; Maximum allowed: 5 minutes)
- **Pacing**: 135 words per minute (335 words total voiceover)

---

## Demo Flow

```
Incident 1 (INC-2026-001)
  ↓
Threat Analysis (MITRE ATT&CK T1110.001)
  ↓
Analyst Response & Root Cause Discovery (Password auth enabled by OS update)
  ↓
Hindsight Retention (Experience capsule committed to 'sentinel-incident-memory')
  ↓
Incident 2 (INC-2026-002)
  ↓
Hindsight Recall (84.8% Cosine Similarity match against INC-2026-001)
  ↓
Memory-Informed Recommendation (CRITICAL AUDIT & PREVENTION RUNBOOK Injected)
  ↓
Analyst Execution & Learning Evolution (68% MTTR reduction)
```

---

## Recording Assets

All recording guides, teleprompter scripts, and verification tools are maintained in this directory:

- **[SCRIPT.md](SCRIPT.md)**: Second-by-second teleprompter voiceover aligned to on-screen UI actions.
- **[SHOT_LIST.md](SHOT_LIST.md)**: Visual choreography and visibility requirements for all 9 demo shots.
- **[RECORDING_CHECKLIST.md](RECORDING_CHECKLIST.md)**: Complete pre-flight, live recording, and post-flight quality checks.
- **[RECORDING_REQUIRED.md](RECORDING_REQUIRED.md)**: Step-by-step instructions for performing the manual screen capture.
- **[CUE_CARDS.md](CUE_CARDS.md)**: Quick-reference 8-click cheatsheet for error-free one-take recording.
- **[verify_video.py](verify_video.py)**: Automated verification script validating video file presence, size, resolution, and duration.
- **`assets/title_card.svg`**: 1080p SVG title card for video intro.
- **`assets/conclusion_card.svg`**: 1080p SVG impact metric card for video outro.

---

## Recording Status

**MANUAL RECORDING REQUIRED**

Antigravity operates in a sandboxed developer environment without physical display pixel grabbers, sound cards, or microphone inputs. In accordance with the hackathon submission rules (**"DO NOT create a fake video file"**), the real 2m 30s screen capture must be recorded by the presenter following [RECORDING_REQUIRED.md](RECORDING_REQUIRED.md) and saved as `submission/video/sentinel-memory-demo.mp4`.
