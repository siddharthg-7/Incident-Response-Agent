# Synthetic Incident Scenarios

This directory contains synthetic security incident datasets engineered for SOC response evaluation and Hindsight memory training.

## Scenarios Overview

### 1. `incident_01_ssh_brute_force.json`
- **Scenario**: High-volume SSH brute force on `bastion-prod-01`.
- **Role in Demo**: Serves as the historical baseline. Includes full investigation, resolution steps, root cause (accidental re-enabling of password auth), and post-mortem lessons learned.
- **Hindsight Action**: Retained into Hindsight's memory bank as a past experience capsule.

### 2. `incident_02_ssh_brute_force_variant.json`
- **Scenario**: SSH brute force on `app-prod-04` from a different IP and time window.
- **Role in Demo**: Trigger incident for memory recall. When processed, Sentinel Agent queries Hindsight, retrieves Incident 1's experience, and recommends auditing password authentication immediately rather than just blocking the source IP.

### 3. `incident_03_credential_stuffing.json`
- **Scenario**: Distributed web API credential stuffing attack on authentication endpoint.
- **Role in Demo**: Demonstrates domain extensibility beyond SSH to web application security incidents.
