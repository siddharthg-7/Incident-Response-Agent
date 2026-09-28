#!/usr/bin/env python3
"""Seed the local database with initial scenario incidents."""

import asyncio
import json
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend to path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.db.session import init_db, AsyncSessionLocal
from app.models.incident import IncidentModel
from sqlalchemy import select


async def seed():
    print("[*] Initializing database tables...")
    await init_db()

    scenarios_dir = ROOT_DIR / "data" / "scenarios"
    scenario_files = [
        scenarios_dir / "incident_01_ssh_brute_force.json",
        scenarios_dir / "incident_02_ssh_brute_force_variant.json",
        scenarios_dir / "incident_03_credential_stuffing.json",
    ]

    async with AsyncSessionLocal() as session:
        for s_file in scenario_files:
            if not s_file.exists():
                continue
            with open(s_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            inc_id = data["id"]
            # Check if exists
            stmt = select(IncidentModel).where(IncidentModel.id == inc_id)
            res = await session.execute(stmt)
            existing = res.scalar_one_or_none()

            if existing:
                print(f"[-] Incident {inc_id} already exists, skipping.")
                continue

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
            print(f"[+] Seeded incident: {inc_id} ({data['title']})")

        await session.commit()
    print("[✓] Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed())
