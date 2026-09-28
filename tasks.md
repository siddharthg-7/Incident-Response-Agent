You are now handling SUBMISSION TASK 2 for Sentinel Memory.

# TASK 2 — FINAL DEMO VIDEO

Your objective is to prepare and, where technically possible, record the final demonstration video showing Sentinel Memory working end-to-end.

IMPORTANT:

This is NOT a development phase.

Do NOT add product features.

Do NOT redesign the application.

Do NOT modify the Hindsight architecture.

Do NOT change working backend logic just for the video.

Do NOT create fake results.

The video must demonstrate the ACTUAL WORKING PRODUCT.

==================================================
1. FIRST READ THE EXISTING DEMO MATERIAL
==================================================

Before doing anything, inspect:

docs/DEMO.md
README.md
docs/HINDSIGHT.md
docs/ARCHITECTURE.md

Also inspect:

scripts/verify_final_demo.py
scripts/verify_phase4_evaluation.py
scripts/run_milestone1_demo.py

Inspect the current frontend and backend implementation.

The repository has already passed its Golden Path and Phase 4 evaluation.

Use the actual verified implementation as the basis for the recording.

Do NOT invent a different demo scenario.

==================================================
2. PRIMARY DEMO STORY
==================================================

The video must demonstrate:

INC-2026-001
→ SSH brute-force incident
→ Analyze
→ Response
→ Resolution
→ Post-mortem
→ Hindsight Retention

THEN:

INC-2026-002
→ Similar SSH brute-force incident
→ Analyze
→ Hindsight Recall
→ Previous Incident
→ Previous Response
→ Previous Outcome
→ Memory-informed Recommendation

The core message is:

The system does not merely analyze each incident independently.

It learns from resolved incidents and uses previous experience when handling a later similar incident.

==================================================
3. VIDEO LENGTH
==================================================

Target:

2–3 minutes.

Maximum:

5 minutes.

Do NOT make the video unnecessarily long.

The evaluator should understand the product quickly.

==================================================
4. RECORDING FOLDER
==================================================

CREATE THIS DIRECTORY IF IT DOES NOT EXIST:

submission/
└── video/

All recording-related assets for this task MUST be stored inside:

submission/video/

Do NOT save recordings to:

Downloads
Desktop
Documents
Temp folders
random project directories
system recording folders

The repository should contain the final recording assets in:

submission/video/

==================================================
5. REQUIRED VIDEO OUTPUT
==================================================

The preferred final output is:

submission/video/sentinel-memory-demo.mp4

If the recording tool/environment supports direct MP4 recording:

SAVE THE ACTUAL RECORDING THERE.

If MP4 recording is not supported directly:

Save the available recording format inside:

submission/video/

For example:

submission/video/sentinel-memory-demo.webm

Then document the format in:

submission/video/README.md

If conversion to MP4 is possible using tools already available in the environment, convert the final recording to:

submission/video/sentinel-memory-demo.mp4

Do NOT download random video conversion software.

Do NOT introduce unnecessary dependencies.

==================================================
6. RECORDING ASSETS
==================================================

Also create:

submission/video/

├── sentinel-memory-demo.mp4
├── SCRIPT.md
├── SHOT_LIST.md
├── RECORDING_CHECKLIST.md
└── README.md

If the actual MP4 cannot be created because the environment does not provide screen recording capability:

DO NOT create a fake video file.

Instead create all other assets and clearly report:

"Screen capture requires manual recording."

The final repository must never contain a fake placeholder video pretending to be the actual demo.

==================================================
7. RECORDING SCRIPT
==================================================

Create:

submission/video/SCRIPT.md

The script must contain:

- timestamp
- screen/action
- voiceover
- expected result

Use approximately this structure:

--------------------------------------------------
0:00–0:15
INTRO
--------------------------------------------------

Show:

Sentinel Memory dashboard.

Voiceover should explain:

"Sentinel Memory is an incident response agent for SOC analysts that learns from previous security incidents using Hindsight."

Keep it concise.

--------------------------------------------------
0:15–0:40
INCIDENT 1
--------------------------------------------------

Open:

INC-2026-001

Show:

- SSH brute-force detection
- severity
- evidence
- affected asset
- analysis

Voiceover explains what happened.

Do NOT explain every field.

--------------------------------------------------
0:40–1:00
RESPONSE
--------------------------------------------------

Show:

- recommendation
- analyst-controlled response
- resolution

Explain briefly:

"The analyst reviews the recommendation and records the actual outcome."

--------------------------------------------------
1:00–1:15
LEARNING
--------------------------------------------------

Show:

- post-mortem
- outcome
- learning/retention

Voiceover:

"The important step is that the resolved incident becomes reusable experience."

--------------------------------------------------
1:15–1:35
INCIDENT 2
--------------------------------------------------

Open:

INC-2026-002

Show the similar SSH attack.

Explain:

"This incident looks similar, but the system now has experience from the previous incident."

--------------------------------------------------
1:35–1:55
HINDSIGHT RECALL
--------------------------------------------------

Trigger the actual memory recall.

Show:

INC-2026-001

Then show:

- previous response
- previous outcome
- lesson learned

This is the most important section of the video.

Do NOT rush this section.

--------------------------------------------------
1:55–2:20
MEMORY-INFORMED RECOMMENDATION
--------------------------------------------------

Generate the recommendation.

Show:

Current incident evidence

+

Recalled previous experience

↓

Recommendation

If the backend provides provenance, show it.

Explain:

"The recommendation now incorporates relevant experience from the previous incident."

Do not claim unsupported metrics.

--------------------------------------------------
2:20–2:40
CLOSING
--------------------------------------------------

Show the overall learning loop:

Incident
→ Response
→ Outcome
→ Hindsight Memory
→ Future Recommendation

Voiceover:

"Sentinel Memory turns incident history into operational experience, allowing future incidents to benefit from what the system has already learned."

==================================================
8. SHOT LIST
==================================================

Create:

submission/video/SHOT_LIST.md

For every shot document:

SHOT 1
Page:
Dashboard

Action:
Open dashboard

What must be visible:
Active incident / system status

SHOT 2
Page:
Incident Detail

Action:
Open INC-2026-001

What must be visible:
SSH brute-force evidence

Continue this for the entire demo.

The shot list must make recording repeatable.

==================================================
9. RECORDING CHECKLIST
==================================================

Create:

submission/video/RECORDING_CHECKLIST.md

Include:

BEFORE RECORDING

[ ] Backend running
[ ] Frontend running
[ ] Database available
[ ] Hindsight available
[ ] LLM available
[ ] Demo data seeded
[ ] INC-2026-001 available
[ ] INC-2026-002 available
[ ] Golden Path verified
[ ] Browser clean
[ ] No unnecessary tabs
[ ] No personal information visible
[ ] Browser zoom appropriate
[ ] Terminal/debug windows hidden
[ ] Notifications disabled
[ ] Recording resolution checked
[ ] Microphone checked

DURING RECORDING

[ ] Keep cursor controlled
[ ] Avoid unnecessary scrolling
[ ] Do not expose credentials
[ ] Do not expose local file paths
[ ] Pause briefly on Hindsight recall
[ ] Clearly show previous incident
[ ] Clearly show recommendation provenance
[ ] Keep within 2–3 minutes

AFTER RECORDING

[ ] Video plays correctly
[ ] Audio is understandable
[ ] No accidental personal information
[ ] No API keys visible
[ ] No terminal credentials visible
[ ] Hindsight recall is visible
[ ] Recommendation is visible
[ ] Final file saved in submission/video/
[ ] Filename is correct

==================================================
10. RECORDING ENVIRONMENT
==================================================

Before recording:

Run the existing verification:

python scripts/verify_final_demo.py

Then:

python scripts/verify_phase4_evaluation.py

Do not record if the Golden Path is broken.

If the backend is not running:

start it using the documented project command.

If frontend is not running:

start it using the documented project command.

Do NOT modify application code merely because the demo environment is not started.

==================================================
11. SCREEN RECORDING
==================================================

If the current Antigravity environment provides a screen-recording capability:

USE IT.

Record the actual running application.

Save the recording directly to:

submission/video/sentinel-memory-demo.mp4

If the recording tool requires a different format:

save it in submission/video/

and convert only if a reliable existing tool is available.

If no screen recording capability is available:

DO NOT pretend to record.

Create:

submission/video/RECORDING_REQUIRED.md

containing:

- exact command/startup instructions
- exact browser URL
- exact recording sequence
- exact expected result
- final output filename

Then clearly state that manual screen capture is required.

==================================================
12. VIDEO QUALITY
==================================================

Target:

1080p if available.

Otherwise use the highest practical resolution.

The application text must be readable.

Avoid:

- excessive zoom
- tiny UI
- rapidly moving cursor
- unnecessary scrolling
- terminal windows
- code editor windows
- browser bookmarks containing personal information

The video should focus on the product.

==================================================
13. AUDIO / VOICEOVER
==================================================

If the environment supports voice recording:

record the planned voiceover.

If not:

prepare the exact voiceover script.

Do NOT generate robotic filler narration.

The narration should be:

- concise
- technical
- understandable
- confident
- focused on the Hindsight learning loop

Do not over-explain implementation details.

==================================================
14. HINDSIGHT MUST BE OBVIOUS
==================================================

The video MUST visibly demonstrate:

1. An incident happens.
2. The incident is resolved.
3. The experience is retained.
4. A later similar incident happens.
5. Hindsight recalls the previous experience.
6. The previous response/outcome/lesson is shown.
7. The recommendation uses that experience.

Do not make Hindsight a background detail.

The evaluator must be able to identify the memory loop from the video alone.

==================================================
15. NO FAKE DEMO
==================================================

IMPORTANT:

Do NOT:

- hard-code a fake memory result
- manually edit screenshots to look like recall
- fake API responses
- fabricate recommendation provenance
- create a video using static mock screens when the live application is available
- claim Hindsight performed an action that it did not perform

Use the actual application.

The demo must be truthful to the implementation.

==================================================
16. VIDEO FINAL REVIEW
==================================================

After recording:

Watch the entire video from beginning to end.

Check:

- Does the story make sense without explanation?
- Is the Hindsight recall visible?
- Is the previous incident visible?
- Is the previous outcome visible?
- Is the recommendation visible?
- Is the learning loop clear?
- Is the video under 5 minutes?
- Is the audio understandable?
- Is the application readable?
- Are there any credentials or personal details visible?
- Are there accidental dead screens/loading screens?

If the recording contains a serious mistake:

record it again.

Do not edit around a broken core demo.

==================================================
17. VIDEO README
==================================================

Create:

submission/video/README.md

Include:

# Sentinel Memory Demo Video

## Final Recording

Filename:
sentinel-memory-demo.mp4

## Duration

Actual duration after recording.

## Demo Flow

Incident 1
→ Resolution
→ Hindsight Retention
→ Incident 2
→ Hindsight Recall
→ Memory-informed Recommendation

## Recording Assets

List:

SCRIPT.md
SHOT_LIST.md
RECORDING_CHECKLIST.md

## Recording Status

Use exactly one:

RECORDED AND VERIFIED

or:

MANUAL RECORDING REQUIRED

Do not claim recorded if no recording exists.

==================================================
18. GIT SAFETY
==================================================

Before finishing:

git status

Ensure:

- no secrets
- no temporary recordings outside submission/video/
- no random screen captures
- no debug artifacts
- no personal information

The video assets may be large.

If the repository has a file-size limitation or Git LFS is already configured, inspect the existing setup before committing the video.

Do NOT blindly commit a huge binary if the repository cannot handle it.

If GitHub storage is unsuitable:

keep the recording locally in:

submission/video/

and document the final submission/upload location in README.md.

Do not upload the video to an unrelated external service without instruction.

==================================================
19. FINAL REPORT
==================================================

At the end report:

# Demo Video Submission Task

## Recording Status
RECORDED AND VERIFIED
or
MANUAL RECORDING REQUIRED

## Recording Location

Exact repository-relative path.

## Duration

Actual duration.

## Resolution

Actual resolution if available.

## Hindsight Demonstration

Explain exactly where the video shows:

Incident 1
→ retention
→ Incident 2
→ recall
→ recommendation

## Assets Created

List every file in:

submission/video/

## Verification

State whether:

verify_final_demo.py

passed.

State whether:

verify_phase4_evaluation.py

passed.

## Remaining Action

If recording was not possible:

Give the exact manual action required.

If recording succeeded:

State:

"No further recording action required."

==================================================
FINAL RULE
==================================================

This task is ONLY the Demo Video.

Do not start:

- Article
- Social Media Post
- Team Content
- Individual Member Content

Those are separate submission tasks.

The final objective is:

CREATE AND VERIFY A REAL, CLEAR, 2–3 MINUTE DEMO VIDEO OF THE ACTUAL SENTINEL MEMORY APPLICATION, WITH ALL RECORDING ASSETS SAVED UNDER:

submission/video/