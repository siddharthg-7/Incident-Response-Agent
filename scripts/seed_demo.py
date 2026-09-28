#!/usr/bin/env python3
"""
Sentinel Memory - Demo Seed & Reset Utility
Restores the database to a deterministic, clean state for the Golden Path demonstration.

Golden Path:
  1. INC-2026-001: SSH Brute Force on Bastion-01 (dmz-bastion-01)
  2. INC-2026-002: Spike in Failed SSH Logins on App-Prod-04 (app-prod-04)
  3. INC-2026-003: Distributed Credential Stuffing on Customer Portal API

Usage:
  python scripts/seed_demo.py
"""

import asyncio
import json
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.db.session import init_db, AsyncSessionLocal
from app.models.incident import IncidentModel
from sqlalchemy import select, delete


async def reset_and_seed_demo():
    print("=" * 65)
    print("  SENTINEL MEMORY - DEMO DATA RESET & SEED PROCEDURE")
    print("=" * 65)
    
    # 1. Initialize schema tables
    print("[*] Initializing SQLite database schema...")
    await init_db()

    scenarios_dir = ROOT_DIR / "data" / "scenarios"
    scenario_files = [
        scenarios_dir / "incident_01_ssh_brute_force.json",
        scenarios_dir / "incident_02_ssh_brute_force_variant.json",
        scenarios_dir / "incident_03_credential_stuffing.json",
    ]

    async with AsyncSessionLocal() as session:
        # Clear existing demo incidents to ensure deterministic reset
        print("[*] Resetting demo records (INC-2026-001, INC-2026-002, INC-2026-003)...")
        demo_ids = ["INC-2026-001", "INC-2026-002", "INC-2026-003"]
        await session.execute(delete(IncidentModel).where(IncidentModel.id.in_(demo_ids)))
        await session.commit()

        # Seed scenarios
        print("[*] Seeding clean scenario fixtures...")
        for s_file in scenario_files:
            if not s_file.exists():
                print(f"[!] Warning: Scenario file missing: {s_file}")
                continue

            with open(s_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            inc_id = data["id"]
            incident = IncidentModel(
                id=inc_id,
                title=data["title"],
                description=data["description"],
                incident_type=data.get("incident_type", "general"),
                severity=data.get("severity", "MEDIUM"),
                status=data.get("status", "NEW"),
                source=data.get("source"),
                target=data.get("target"),
                indicators=data.get("indicators", []),
                evidence=data.get("evidence", {}),
                analysis=data.get("analysis"),
                recommendation=data.get("recommendation"),
                resolution=data.get("resolution"),
                postmortem=data.get("postmortem"),
            )
            session.add(incident)
            print(f"  [+] Seeded: {inc_id} - '{data['title']}' [{data.get('severity')}]")

        await session.commit()

    # If backend/sentinel_memory.db exists, sync it for consistency across any startup CWD
    root_db = ROOT_DIR / "sentinel_memory.db"
    backend_db = ROOT_DIR / "backend" / "sentinel_memory.db"
    if root_db.exists():
        import shutil
        try:
            shutil.copy2(str(root_db), str(backend_db))
        except Exception:
            pass

    print("\n[✓] Demo reset successfully completed!")
    print("  Ready for Golden Path live presentation:")
    print("    • Step 1: Open INC-2026-001 -> Resolve -> Post-Mortem -> Retain")
    print("    • Step 2: Open INC-2026-002 -> Analyze -> Recall -> Memory-Informed Recommendation")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(reset_and_seed_demo())
