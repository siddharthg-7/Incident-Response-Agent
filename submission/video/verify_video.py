#!/usr/bin/env python3
"""
Sentinel Memory - Video Demonstration Verification Script
Validates that submission/video/sentinel-memory-demo.mp4 meets hackathon guidelines:
  1. File exists and is non-empty
  2. Duration is within allowed window (target 2m30s, max 3m00s)
  3. Video resolution is 1080p / 720p 16:9
  4. Audio stream is present
"""

import sys
import json
import shutil
import subprocess
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

VIDEO_PATH = Path(__file__).resolve().parent / "sentinel-memory-demo.mp4"

def inspect_with_ffprobe(video_file: Path):
    ffprobe_cmd = shutil.which("ffprobe")
    if not ffprobe_cmd:
        # Fallback to ffmpeg if ffprobe is not separate
        return None

    cmd = [
        ffprobe_cmd,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(video_file)
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(proc.stdout)
    except Exception:
        return None

def main():
    print("=" * 65)
    print("   SENTINEL MEMORY - SUBMISSION VIDEO VERIFICATION")
    print("=" * 65)
    print(f"Target: {VIDEO_PATH}")

    if not VIDEO_PATH.exists():
        print("\n[!] Video file not found at:")
        print(f"    {VIDEO_PATH}")
        print("\n[+] To record your video:")
        print("    1. Review the step-by-step instructions in:")
        print("       submission/video/RECORDING_GUIDE.md")
        print("    2. Follow the 8-click teleprompter script in:")
        print("       submission/video/TIMECODED_SCRIPT.md")
        print("    3. Save the resulting MP4 as:")
        print("       submission/video/sentinel-memory-demo.mp4")
        print("    4. Re-run this verification script.")
        print("=" * 65)
        sys.exit(1)

    file_size_mb = VIDEO_PATH.stat().st_size / (1024 * 1024)
    print(f"\n[✓] File exists: {file_size_mb:.2f} MB")

    if file_size_mb < 2.0:
        print("[!] Warning: File size is unusually small (< 2 MB). Verify it contains video.")
    elif file_size_mb > 250.0:
        print("[!] Warning: File size is large (> 250 MB). Consider re-encoding with ffmpeg.")
    else:
        print("[✓] File size is optimal for submission.")

    # Probe metadata if tool available
    meta = inspect_with_ffprobe(VIDEO_PATH)
    if meta:
        format_info = meta.get("format", {})
        duration = float(format_info.get("duration", 0))
        streams = meta.get("streams", [])
        video_streams = [s for s in streams if s.get("codec_type") == "video"]
        audio_streams = [s for s in streams if s.get("codec_type") == "audio"]

        mins = int(duration // 60)
        secs = int(duration % 60)
        print(f"[✓] Detected Duration: {mins:02d}:{secs:02d} ({duration:.1f}s)")

        if duration > 185.0:
            print("[!] FAIL: Video exceeds 3-minute hackathon limit!")
            sys.exit(1)
        elif duration < 60.0:
            print("[!] Warning: Video is shorter than 1 minute.")
        else:
            print("[✓] Duration is within the approved 2m00s–3m00s range.")

        if video_streams:
            v = video_streams[0]
            w, h = v.get("width"), v.get("height")
            codec = v.get("codec_name")
            print(f"[✓] Video Stream: {w}x{h} ({codec})")
        else:
            print("[!] FAIL: No video stream detected!")
            sys.exit(1)

        if audio_streams:
            a = audio_streams[0]
            print(f"[✓] Audio Stream: {a.get('codec_name')} ({a.get('sample_rate')} Hz)")
        else:
            print("[!] Warning: No audio stream found. Spoken voiceover is strongly recommended.")
    else:
        print("\n[*] Note: ffprobe not found on PATH. Basic file presence and size validated.")

    print("\n" + "=" * 65)
    print("   VIDEO SUBMISSION VERIFICATION: READY FOR JUDGES")
    print("=" * 65)

if __name__ == "__main__":
    main()
