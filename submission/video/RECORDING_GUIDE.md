# Sentinel Memory - Screen Recording Guide

Follow this guide to record the official 2m 30s demonstration video and save it to:
`submission/video/sentinel-memory-demo.mp4`

---

## 1. Optimal Recording Setup

### Display & Browser Configuration
- **Resolution**: 1920x1080 (16:9 widescreen)
- **Browser**: Google Chrome, Edge, or Brave
- **Browser Zoom**: **110%** (`Ctrl + Plus` once) — ensures typography and IOC indicators are razor-sharp on judges' screens.
- **Bookmarks Bar**: Press `Ctrl + Shift + B` to hide the bookmarks bar for a clean UI.
- **Full Screen**: Press `F11` if you want a borderless view, or keep the window maximized at 1080p.

### Audio Configuration
- Use an external USB microphone, headset, or clean laptop microphone.
- Speak with a confident, deliberate pace (130–140 words per minute).
- Background music is **not** recommended; clear voiceover delivers maximum technical clarity.

---

## 2. Choosing Your Recording Tool

### Option A: Built-in Windows Game Bar (Zero Install Required)
Windows has a built-in screen and microphone recorder:
1. Open your browser on `http://localhost:5173/dashboard`.
2. Press **`Win + Alt + R`** to start recording immediately.
   *(Or press `Win + G` to open the overlay, verify the microphone icon is ON, and click Record)*.
3. Deliver the 8 clicks following **[CUE_CARDS.md](CUE_CARDS.md)**.
4. Press **`Win + Alt + R`** again to stop recording.
5. The video is saved to `C:\Users\<Username>\Videos\Captures\`.

### Option B: OBS Studio (Best Quality & Flexibility)
1. In OBS, add a **Display Capture** or **Window Capture** source targeting your browser.
2. Under Settings → Output:
   - Output Mode: Simple
   - Recording Quality: High Quality, Medium File Size
   - Recording Format: **mp4**
   - Video Encoder: Software (x264) or Hardware (NVENC / AMD)
3. Set Base Canvas and Output Resolution to **1920x1080**.
4. Click **Start Recording**.

### Option C: Clipchamp / Loom
- **Clipchamp**: Built into Windows 11 (`Start` → `Clipchamp` → `Record screen and audio`).
- **Loom**: Record "Screen + Mic", 1080p. Download the MP4 file after recording.

---

## 3. Pre-Flight Verification Checklist

Before hitting record, run this 10-second check:

```bash
# 1. Seed pristine demo data
python scripts/seed_demo.py

# 2. Check that both terminals are active
curl http://127.0.0.1:8000/health
# Should return: {"status": "healthy", ...}
```

In your browser:
- [x] Dashboard shows green `FastAPI: Connected` pill in navbar
- [x] Three incidents are visible in the queue: `INC-2026-001`, `INC-2026-002`, `INC-2026-003`
- [x] [CUE_CARDS.md](CUE_CARDS.md) is open on your second screen or phone

---

## 4. Saving & Finalizing the MP4

Once your recording is finished:

1. Copy or move your recording into the repository:
   ```bash
   # Example path:
   copy "C:\Users\Siddharth\Videos\Captures\Incident Response Agent 2026.mp4" "submission\video\sentinel-memory-demo.mp4"
   ```

2. *(Optional)* Optimize file size and compatibility with FFmpeg:
   ```bash
   ffmpeg -i "path/to/raw_recording.mp4" -c:v libx264 -crf 20 -preset fast -c:a aac -b:a 192k "submission/video/sentinel-memory-demo.mp4"
   ```

3. Run the automated verification script:
   ```bash
   python submission/video/verify_video.py
   ```
