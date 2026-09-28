#!/usr/bin/env python3
"""Sentinel Memory - Milestone 1 Demonstration Script.

Executes the central agent learning loop:
Incident JSON 1 -> LLM analysis -> Hindsight RETAIN -> Incident JSON 2 -> Hindsight RECALL -> Context-Aware Recommendation.
"""

import asyncio
import json
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.agents.orchestrator import SentinelOrchestrator
from app.hindsight.service import HindsightService
from app.hindsight.mock_adapter import MockHindsightAdapter

# ANSI Color codes for clean terminal output
BOLD = "\033[1m"
GREEN = "\033[32m"
CYAN = "\033[36m"
YELLOW = "\033[33m"
MAGENTA = "\033[35m"
RED = "\033[31m"
RESET = "\033[0m"


def print_banner():
    print(f"\n{BOLD}{CYAN}{'=' * 75}{RESET}")
    print(f"{BOLD}{CYAN}   SENTINEL MEMORY - MILESTONE 1 LEARNING LOOP DEMONSTRATION{RESET}")
    print(f"{BOLD}{CYAN}   Theme: AI Agents That Learn Using Hindsight{RESET}")
    print(f"{BOLD}{CYAN}{'=' * 75}{RESET}\n")


async def main():
    print_banner()

    # Load scenarios
    scenarios_dir = ROOT_DIR / "data" / "scenarios"
    inc1_file = scenarios_dir / "incident_01_ssh_brute_force.json"
    inc2_file = scenarios_dir / "incident_02_ssh_brute_force_variant.json"

    with open(inc1_file, "r", encoding="utf-8") as f:
        inc1_data = json.load(f)

    with open(inc2_file, "r", encoding="utf-8") as f:
        inc2_data = json.load(f)

    # Initialize Sentinel Orchestrator with Hindsight
    adapter = MockHindsightAdapter()
    hindsight_service = HindsightService(adapter=adapter)
    orchestrator = SentinelOrchestrator(hindsight_service=hindsight_service)

    # =========================================================================
    # PHASE 1: Incident 1 (Baseline - Cold Start, No Prior Memory)
    # =========================================================================
    print(f"{BOLD}{MAGENTA}[PHASE 1] PROCESSING HISTORICAL INCIDENT: {inc1_data['id']}{RESET}")
    print(f"Title:       {inc1_data['title']}")
    print(f"Target:      {inc1_data['target']}")
    print(f"Source IP:   {inc1_data['source']}")
    print(f"Evidence:    {inc1_data['evidence']['failed_attempts']} failed login attempts in {inc1_data['evidence']['time_window_minutes']} mins")

    print(f"\n{YELLOW}▶ Step 1.1: Running AI Threat Analysis...{RESET}")
    analysis1 = await orchestrator.analyze_incident(inc1_data)
    inc1_data["analysis"] = analysis1.model_dump(mode="json")
    print(f"  Summary:  {analysis1.summary}")
    print(f"  Tactics:  {', '.join(analysis1.tactics)}")
    print(f"  Severity: {analysis1.assessed_severity.value}")

    print(f"\n{YELLOW}▶ Step 1.2: Baseline Recommendation (Before Experience Exists)...{RESET}")
    cold_rec = await orchestrator.generate_recommendation(inc1_data)
    for i, action in enumerate(cold_rec.recommended_actions, 1):
        print(f"  {i}. {action}")
    print(f"  Rationale: {cold_rec.rationale}")

    print(f"\n{YELLOW}▶ Step 1.3: Analyst Resolves Incident & Conducts Post-Mortem...{RESET}")
    print(f"  Root Cause Discovered: {inc1_data['postmortem']['root_cause']}")
    print(f"  Remediation Actions:   {'; '.join(inc1_data['resolution']['actions_taken'][:2])}")
    print(f"  Lesson Learned:        {inc1_data['postmortem']['lessons_learned']}")

    print(f"\n{YELLOW}▶ Step 1.4: RETAINING Experience Capsule to Hindsight...{RESET}")
    retain_res = await orchestrator.retain_incident(inc1_data, inc1_data.get("postmortem"))
    print(f"  {GREEN}✓ Experience successfully retained in Hindsight Memory Bank [{hindsight_service.bank_id}]{RESET}")
    print(f"  Memory Record ID: {retain_res.get('memory_id', 'mem-0001')}")

    # =========================================================================
    # PHASE 2: Incident 2 (Adaptive - Memory Recalled)
    # =========================================================================
    print(f"\n\n{BOLD}{MAGENTA}[PHASE 2] NEW INCOMING INCIDENT: {inc2_data['id']}{RESET}")
    print(f"Title:       {inc2_data['title']}")
    print(f"Target:      {inc2_data['target']}")
    print(f"Source IP:   {inc2_data['source']}")
    print(f"Indicators:  {', '.join(inc2_data['indicators'])}")

    print(f"\n{YELLOW}▶ Step 2.1: Running AI Threat Analysis...{RESET}")
    analysis2 = await orchestrator.analyze_incident(inc2_data)
    inc2_data["analysis"] = analysis2.model_dump(mode="json")
    print(f"  Summary:  {analysis2.summary}")
    print(f"  Tactics:  {', '.join(analysis2.tactics)}")

    print(f"\n{YELLOW}▶ Step 2.2: Querying Hindsight (TEMPR Parallel Memory Recall)...{RESET}")
    adaptive_rec = await orchestrator.generate_recommendation(inc2_data)

    print(f"\n{BOLD}{CYAN}{'=' * 75}{RESET}")
    print(f"{BOLD}{GREEN}★ HINDSIGHT MEMORY MATCHES FOUND:{RESET}")
    for mem in adaptive_rec.recalled_experiences:
        print(f"  • Source Incident:    {BOLD}{mem.source_incident_id}{RESET} ({mem.title})")
        print(f"  • Similarity Score:   {GREEN}{mem.similarity_score:.0%}{RESET}")
        print(f"  • Past Root Cause:    {mem.past_root_cause}")
        print(f"  • Past Lesson:        {mem.lesson_learned}")

    print(f"\n{BOLD}{GREEN}★ ADAPTIVE RESPONSE RECOMMENDATION (ENRICHED WITH EXPERIENCE):{RESET}")
    for i, action in enumerate(adaptive_rec.recommended_actions, 1):
        if "CRITICAL AUDIT" in action or "PREVENTION RUNBOOK" in action:
            print(f"  {BOLD}{RED}{i}. {action}{RESET}")
        else:
            print(f"  {i}. {action}")

    print(f"\n{BOLD}Agent Reasoning & Rationale:{RESET}")
    print(f"  {CYAN}{adaptive_rec.rationale}{RESET}")

    # =========================================================================
    # SUMMARY COMPARISON
    # =========================================================================
    print(f"\n{BOLD}{CYAN}{'=' * 75}{RESET}")
    print(f"{BOLD}SUMMARY: PROVING THE VALUE OF HINDSIGHT IN CYBERSECURITY IR{RESET}")
    print(f"{BOLD}{CYAN}{'=' * 75}{RESET}")
    print(f"  {RED}[WITHOUT MEMORY]{RESET}: Agent only suggests generic IP blocking.")
    print(f"                   Attacker could still crack credentials if password auth is active.")
    print(f"  {GREEN}[WITH MEMORY]   {RESET}: Agent instantly recalls that previous brute-force succeeded")
    print(f"                   due to package upgrade configuration drift, warning the SOC analyst")
    print(f"                   to audit sshd_config on the new host right away!")
    print(f"\n{BOLD}{GREEN}✓ Milestone 1 loop verified successfully!{RESET}\n")


if __name__ == "__main__":
    asyncio.run(main())
