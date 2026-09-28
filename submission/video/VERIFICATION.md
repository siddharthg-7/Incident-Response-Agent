# Sentinel Memory - Video Submission Verification Checklist

Prior to submitting `submission/video/sentinel-memory-demo.mp4` to the hackathon judges, verify every item below:

---

## 1. Compliance Criteria

| Requirement | Target Standard | Status |
| :--- | :--- | :--- |
| **Filename** | `submission/video/sentinel-memory-demo.mp4` | [ ] Required |
| **Duration** | Between `02:00` and `03:00` (Target: `02:30`) | [ ] Hard limit: max 3m00s |
| **Container / Codec** | MP4 (`H.264 / AVC` video + `AAC` audio) | [ ] Maximum device compatibility |
| **Resolution** | 1080p (`1920x1080`) or 720p minimum | [ ] 16:9 standard aspect ratio |
| **Framerate** | 30 fps or 60 fps | [ ] Smooth UI transitions |
| **File Size** | Between 15 MB and 150 MB | [ ] Safe for GitHub and judge downloads |
| **Audio** | Clear spoken voiceover; no clipping or harsh buzz | [ ] Easily audible narration |

---

## 2. Storyline Checkpoints (Judges' Scoring Rubric)

- [ ] **Problem Stated (0:00 - 0:25)**: Explains SOC amnesia and why stateless AI/RAG fails.
- [ ] **Incident 1 Ingested (0:25 - 0:40)**: Shows SSH brute force on `bastion-01` and MITRE ATT&CK T1110.
- [ ] **Root Cause Found (0:40 - 0:58)**: Highlights package upgrade enabling password auth.
- [ ] **Hindsight Retain (0:58 - 1:12)**: Shows `Post-Mortem & Retain` button clicked and committed to `sentinel-incident-memory`.
- [ ] **Incident 2 Ingested (1:12 - 1:28)**: Shows new attack hitting `app-prod-04` from a different IP.
- [ ] **Hindsight Recall (1:28 - 1:48)**: Recalls `INC-2026-001` with **84.8% similarity score**, displaying past root cause and outcome.
- [ ] **Memory-Informed Recommendation (1:48 - 2:08)**: Shows purple provenance banner, `CRITICAL AUDIT`, and `PREVENTION RUNBOOK`.
- [ ] **Analyst Action (2:08 - 2:22)**: Shows one-click approval and execution tracking.
- [ ] **Learning Evolution (2:22 - 2:40)**: Shows MTTR reduction and Before vs After comparison.

---

## 3. Automated Video Verification Script

To automatically validate your finished video against all hackathon parameters, run:

```bash
python submission/video/verify_video.py
```
