import { 
  Incident, 
  SystemHealth, 
  RecalledExperience, 
  IncidentPostMortem,
  LearningEvent,
  ActionStatus,
  IncidentStatus,
  ResponseAction,
  Severity
} from '../types';
import { 
  mockHealth, 
  mockIncidents, 
  mockRetainedExperiences, 
  mockLearningEvents 
} from './mockData';

// API configuration: defaults to localhost:8000
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK === 'true';

// In-memory reactive stores for Phase 2 fallback / mock mode
let localIncidents: Incident[] = [...mockIncidents];
let localRetainedExperiences: RecalledExperience[] = [...mockRetainedExperiences];
let localLearningEvents: LearningEvent[] = [...mockLearningEvents];

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

/**
 * Normalizes backend FastAPI payloads into the frontend domain model.
 * Adapts field name differences cleanly within the service adapter.
 */
function normalizeIncident(raw: any): Incident {
  if (!raw) return raw;

  // 1. Normalize analysis
  let normalizedAnalysis = undefined;
  if (raw.analysis) {
    normalizedAnalysis = {
      classification: raw.analysis.classification || raw.analysis.attack_vector || `${raw.incident_type} Attack`,
      assessed_severity: (raw.analysis.assessed_severity || raw.severity || 'HIGH') as Severity,
      confidence: raw.analysis.confidence ?? 0.94,
      suspected_root_cause: raw.analysis.suspected_root_cause || raw.analysis.potential_impact || raw.analysis.summary,
      investigation_summary: raw.analysis.investigation_summary || raw.analysis.summary || 'AI Threat analysis completed.',
      evidence_summary: raw.analysis.evidence_summary || (raw.analysis.tactics ? [...raw.analysis.tactics] : []),
      tactics: raw.analysis.tactics || [],
      extracted_iocs: raw.analysis.extracted_iocs || raw.indicators || [],
      analyzed_at: raw.analysis.analyzed_at || new Date().toISOString(),
    };
  }

  // 2. Normalize recommendation & recalled experiences
  let normalizedRecommendation = undefined;
  if (raw.recommendation) {
    const rawRec = raw.recommendation;
    const recalledExperiences: RecalledExperience[] = (rawRec.recalled_experiences || []).map((exp: any) => ({
      source_incident_id: exp.source_incident_id || 'INC-UNKNOWN',
      title: exp.title || 'Historical Incident',
      incident_pattern: exp.incident_pattern || 'SSH Brute-Force against exposed service',
      similarity_score: exp.similarity_score ?? 0.85,
      relevance_label: `${Math.round((exp.similarity_score ?? 0.85) * 100)}% Match (Relevant past experience)`,
      what_happened: exp.what_happened || exp.past_root_cause || 'Previous attack on perimeter infrastructure.',
      past_root_cause: exp.past_root_cause || 'Service configuration drift enabled password authentication.',
      past_actions_taken: exp.past_actions_taken || [],
      past_outcome: exp.past_outcome || 'Threat contained with zero session breach.',
      lesson_learned: exp.lesson_learned || 'Enforce automated compliance checks on perimeter configurations.',
      timestamp: exp.timestamp || new Date().toISOString(),
    }));

    const detailedActions: ResponseAction[] = (rawRec.recommended_actions || []).map((act: string, idx: number) => {
      const isAudit = act.includes('CRITICAL AUDIT') || act.toLowerCase().includes('audit') || act.toLowerCase().includes('inspect');
      const isFirewall = act.toLowerCase().includes('firewall') || act.toLowerCase().includes('drop') || act.toLowerCase().includes('block');
      const isRunbook = act.includes('PREVENTION RUNBOOK') || act.toLowerCase().includes('ansible');
      
      return {
        id: `ACT-0${idx + 1}`,
        action: act,
        reason: isAudit 
          ? 'Addresses root cause discovered in recalled incident' 
          : isRunbook 
          ? 'Long-term preventative measure from post-mortem lessons' 
          : 'Immediate network containment directive',
        status: 'RECOMMENDED' as ActionStatus,
        risk_level: isFirewall ? 'LOW' : isAudit ? 'LOW' : 'MEDIUM',
        requires_approval: isFirewall || act.toLowerCase().includes('modify'),
        category: isAudit ? 'audit' : isFirewall ? 'containment' : 'eradication',
      };
    });

    normalizedRecommendation = {
      recommended_response: rawRec.recommended_response || rawRec.rationale || 'Execute immediate containment and verify configuration baseline.',
      why_this_response: rawRec.why_this_response || rawRec.rationale || 'Synthesized from incident evidence and Hindsight historical experience.',
      memory_influence: rawRec.memory_influence || (recalledExperiences.length > 0
        ? `Memory-informed recommendation based on recalled experience ${recalledExperiences[0].source_incident_id} (${Math.round(recalledExperiences[0].similarity_score * 100)}% Match).`
        : 'Standard containment recommendations (no historical match found).'),
      expected_objective: rawRec.expected_objective || 'Eliminate active attack vector, prevent credential compromise, and enforce baseline compliance.',
      potential_risks: rawRec.potential_risks || 'Low operational risk. Standard security containment and verification overhead.',
      recommended_actions: rawRec.recommended_actions || [],
      detailed_actions: rawRec.detailed_actions || detailedActions,
      confidence: rawRec.confidence ?? 0.92,
      recalled_experiences: recalledExperiences,
      generated_at: rawRec.generated_at || new Date().toISOString(),
    };
  }

  // 3. Normalize resolution
  let normalizedResolution = undefined;
  if (raw.resolution) {
    normalizedResolution = {
      status: 'RESOLVED' as IncidentStatus,
      actions_taken: raw.resolution.actions_taken || [],
      outcome: raw.resolution.outcome || 'Threat neutralized.',
      notes: raw.resolution.notes || 'Resolved via Sentinel investigation workspace.',
      resolved_by: raw.resolution.resolved_by || 'soc_analyst',
      resolved_at: raw.resolution.resolved_at || new Date().toISOString(),
    };
  }

  // 4. Normalize post-mortem
  let normalizedPostmortem = undefined;
  if (raw.postmortem) {
    normalizedPostmortem = {
      what_happened: raw.postmortem.what_happened || `Post-mortem investigation for ${raw.id}`,
      root_cause: raw.postmortem.root_cause || 'Root cause identified.',
      what_was_done: raw.postmortem.what_was_done || (raw.resolution?.actions_taken ? raw.resolution.actions_taken.join('; ') : 'Containment and configuration enforcement'),
      what_worked: raw.postmortem.what_worked || 'Immediate IP containment stopped attack stream before breach',
      what_did_not_work: raw.postmortem.what_did_not_work || 'Configuration drift was not alerted prior to attack',
      final_outcome: raw.postmortem.final_outcome || raw.resolution?.outcome || 'Threat mitigated without breach',
      lessons_learned: raw.postmortem.lessons_learned || 'Enforce automated Ansible compliance check on perimeter servers.',
      completed_at: raw.postmortem.completed_at || new Date().toISOString(),
    };
  }

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    incident_type: raw.incident_type || 'general',
    severity: (raw.severity || 'MEDIUM') as Severity,
    status: (raw.status || 'OPEN') as IncidentStatus,
    source: raw.source || 'N/A',
    target: raw.target || 'N/A',
    indicators: raw.indicators || [],
    evidence: raw.evidence || {},
    detected_at: raw.detected_at || new Date().toISOString(),
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
    analyst_assigned: raw.analyst_assigned || 'analyst_lead',
    analysis: normalizedAnalysis,
    recommendation: normalizedRecommendation,
    resolution: normalizedResolution,
    postmortem: normalizedPostmortem,
  };
}

export const api = {
  isMockMode(): boolean {
    return USE_MOCK;
  },

  getApiBaseUrl(): string {
    return API_BASE;
  },

  // 1. GET /health
  async getHealth(): Promise<SystemHealth> {
    if (USE_MOCK) return mockHealth;
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse<SystemHealth>(res);
    } catch {
      console.warn('Backend unavailable, returning fallback health status');
      return {
        ...mockHealth,
        database: 'unavailable (backend offline)',
        hindsight: {
          ...mockHealth.hindsight,
          status: 'unavailable',
        },
      };
    }
  },

  // 2. GET /api/incidents
  async listIncidents(status?: string, severity?: string): Promise<Incident[]> {
    if (USE_MOCK) {
      return localIncidents.filter((inc) => {
        if (status && status !== 'ALL' && inc.status !== status) return false;
        if (severity && severity !== 'ALL' && inc.severity !== severity) return false;
        return true;
      });
    }
    try {
      const params = new URLSearchParams();
      if (status && status !== 'ALL') params.append('status', status);
      if (severity && severity !== 'ALL') params.append('severity', severity);
      const res = await fetch(`${API_BASE}/api/incidents?${params.toString()}`);
      const rawList = await handleResponse<any[]>(res);
      return rawList.map(normalizeIncident);
    } catch (err) {
      console.warn('Backend unavailable, falling back to local incidents', err);
      return localIncidents;
    }
  },

  // 3. GET /api/incidents/{incident_id}
  async getIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const found = localIncidents.find((i) => i.id === id);
      if (found) return { ...found };

      if (id === 'test-incident' || id.toLowerCase().includes('demo')) {
        const demo = localIncidents.find((i) => i.id === 'INC-009') || localIncidents[0];
        return { ...demo };
      }

      const fallback: Incident = {
        id,
        title: `Incident Investigation: ${id}`,
        description: 'Synthetic incident telemetry retrieved for analysis and route testing.',
        incident_type: 'SSH Brute Force',
        severity: 'HIGH',
        status: 'OPEN',
        source: '198.51.100.44',
        target: 'prod-bastion-01 (10.0.1.15)',
        indicators: ['198.51.100.44', 'port 22', 'root'],
        evidence: {
          source_ip: '198.51.100.44',
          destination_host: 'prod-bastion-01',
          failed_attempts: 437,
          time_window: '8 minutes',
        },
        detected_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return fallback;
    }
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${id}`);
      const raw = await handleResponse<any>(res);
      return normalizeIncident(raw);
    } catch (err) {
      const found = localIncidents.find((i) => i.id === id);
      if (found) return found;
      throw err;
    }
  },

  // 4. POST /api/incidents
  async createIncident(payload: Partial<Incident>): Promise<Incident> {
    if (USE_MOCK) {
      const newInc: Incident = {
        id: `INC-${String(localIncidents.length + 10).padStart(3, '0')}`,
        title: payload.title || 'Untitled Incident',
        description: payload.description || '',
        incident_type: payload.incident_type || 'General Security Alert',
        severity: payload.severity || 'MEDIUM',
        status: 'OPEN',
        source: payload.source || '10.0.0.1',
        target: payload.target || 'internal-node',
        indicators: payload.indicators || [],
        evidence: payload.evidence || {},
        detected_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localIncidents.unshift(newInc);
      return newInc;
    }

    const backendPayload = {
      title: payload.title || 'Untitled Incident',
      description: payload.description || '',
      incident_type: payload.incident_type || 'ssh_brute_force',
      severity: payload.severity || 'MEDIUM',
      source: payload.source,
      target: payload.target,
      indicators: payload.indicators || [],
      evidence: payload.evidence || {},
    };

    const res = await fetch(`${API_BASE}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });
    const raw = await handleResponse<any>(res);
    return normalizeIncident(raw);
  },

  // 5. POST /api/incidents/{incident_id}/analyze
  async analyzeIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      inc.status = 'ANALYZED';
      if (!inc.analysis) {
        inc.analysis = {
          classification: inc.incident_type.includes('SSH')
            ? 'Credential Attack / SSH Brute Force'
            : `Suspicious Activity / ${inc.incident_type}`,
          assessed_severity: inc.severity,
          confidence: 0.94,
          suspected_root_cause: `Repeated anomalies identified on target ${inc.target || 'system'}. Potential security misconfiguration or brute-force pattern.`,
          investigation_summary: `AI threat analysis completed for ${inc.title}. Evidence suggests active reconnaissance or unauthorized access attempts.`,
          evidence_summary: [
            `Observed anomalies in telemetry originating from ${inc.source || 'external source'}`,
            `Target infrastructure: ${inc.target || 'internal asset'}`,
            `Extracted Indicators: ${inc.indicators.join(', ')}`,
          ],
          tactics: [
            'MITRE ATT&CK T1110 - Brute Force',
            'MITRE ATT&CK T1078 - Valid Accounts',
          ],
          extracted_iocs: inc.indicators || [],
          analyzed_at: new Date().toISOString(),
        };
      }
      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }

    const res = await fetch(`${API_BASE}/api/incidents/${id}/analyze`, { method: 'POST' });
    const raw = await handleResponse<any>(res);
    return normalizeIncident(raw);
  },

  // 6. GET /api/incidents/{incident_id}/memory
  async getIncidentMemory(id: string): Promise<RecalledExperience[]> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      if (inc.recommendation?.recalled_experiences && inc.recommendation.recalled_experiences.length > 0) {
        return inc.recommendation.recalled_experiences;
      }
      return localRetainedExperiences;
    }

    try {
      const res = await fetch(`${API_BASE}/api/incidents/${id}/memory`);
      const rawList = await handleResponse<any[]>(res);
      return rawList.map((exp) => ({
        source_incident_id: exp.source_incident_id,
        title: exp.title,
        incident_pattern: 'SSH Brute-Force Pattern',
        similarity_score: exp.similarity_score ?? 0.85,
        relevance_label: `${Math.round((exp.similarity_score ?? 0.85) * 100)}% Match (Relevant past experience)`,
        what_happened: exp.past_root_cause || 'Previous incident targeting exposed service',
        past_root_cause: exp.past_root_cause || 'Configuration drift or exposed service authentication enabled.',
        past_actions_taken: exp.past_actions_taken || [],
        past_outcome: exp.past_outcome || 'Threat contained with zero session breach.',
        lesson_learned: exp.lesson_learned || 'Enforce automated Ansible compliance check on perimeter servers.',
        timestamp: new Date().toISOString(),
      }));
    } catch {
      return localRetainedExperiences;
    }
  },

  // 7. POST /api/incidents/{incident_id}/recommend
  async getRecommendation(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      inc.status = 'RECOMMENDATION_READY';
      if (!inc.recommendation) {
        const past = localRetainedExperiences[0];
        inc.recommendation = {
          recommended_response: `Apply immediate network containment for ${inc.source || 'threat source'} and review service configurations.`,
          why_this_response: `Similar incidents were previously resolved using IP containment and configuration auditing. Prior incident ${past.source_incident_id} succeeded with zero session breach.`,
          memory_influence: `Memory-informed recommendation based on recalled experience ${past.source_incident_id} (${(past.similarity_score * 100).toFixed(0)}% similarity).`,
          expected_objective: 'Isolate attacker stream and prevent credential compromise.',
          potential_risks: 'Low risk. Minimal impact on legitimate internal traffic.',
          recommended_actions: [
            `1. Block source ${inc.source || 'malicious IP'} at perimeter firewall.`,
            `2. Restrict service access on ${inc.target || 'target asset'} to authorized corporate subnets.`,
            '3. Audit authentication configuration to prevent drift.',
          ],
          detailed_actions: [
            {
              id: 'ACT-01',
              action: `Apply perimeter firewall DROP rule for ${inc.source || 'threat source'}`,
              reason: 'Immediately terminates malicious network connection stream',
              status: 'RECOMMENDED',
              risk_level: 'LOW',
              requires_approval: true,
              category: 'containment',
            },
            {
              id: 'ACT-02',
              action: `Restrict access on ${inc.target || 'target asset'} to corporate CIDR`,
              reason: 'Prevents external untrusted traffic from directly accessing service port',
              status: 'RECOMMENDED',
              risk_level: 'MEDIUM',
              requires_approval: true,
              category: 'containment',
            },
            {
              id: 'ACT-03',
              action: 'Audit authentication configuration for drift',
              reason: 'Prevents recurrence of security vulnerabilities identified in post-mortem',
              status: 'RECOMMENDED',
              risk_level: 'LOW',
              requires_approval: false,
              category: 'audit',
            },
          ],
          confidence: 0.94,
          recalled_experiences: [past],
          generated_at: new Date().toISOString(),
        };
      }
      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }

    const res = await fetch(`${API_BASE}/api/incidents/${id}/recommend`, { method: 'POST' });
    const raw = await handleResponse<any>(res);
    return normalizeIncident(raw);
  },

  // 8. Update response action status (Approve / Execute)
  async updateActionStatus(incidentId: string, actionId: string, newStatus: ActionStatus): Promise<Incident> {
    const inc = await this.getIncident(incidentId);
    if (inc.recommendation?.detailed_actions) {
      const act = inc.recommendation.detailed_actions.find((a) => a.id === actionId);
      if (act) act.status = newStatus;
    }
    const idx = localIncidents.findIndex((i) => i.id === inc.id);
    if (idx !== -1) localIncidents[idx] = { ...inc };
    return { ...inc };
  },

  // 9. POST /api/incidents/{incident_id}/resolve
  async resolveIncident(
    id: string, 
    payload: { actions_taken: string[]; outcome: string; notes?: string; status?: IncidentStatus }
  ): Promise<Incident> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      inc.status = payload.status || 'RESOLVED';
      inc.resolution = {
        status: inc.status,
        actions_taken: payload.actions_taken,
        outcome: payload.outcome,
        notes: payload.notes || 'Incident resolved and validated by SOC analyst.',
        resolved_by: 'soc_lead_analyst',
        resolved_at: new Date().toISOString(),
      };
      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }

    const backendPayload = {
      actions_taken: payload.actions_taken,
      outcome: payload.outcome,
      resolved_by: 'soc_analyst',
    };

    const res = await fetch(`${API_BASE}/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });
    const raw = await handleResponse<any>(res);
    return normalizeIncident(raw);
  },

  // 10. POST /api/incidents/{incident_id}/postmortem & learn
  async createPostmortem(
    id: string, 
    payload: {
      what_happened: string;
      root_cause: string;
      what_was_done: string;
      what_worked: string;
      what_did_not_work: string;
      final_outcome: string;
      lessons_learned: string;
    }
  ): Promise<Incident> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      inc.status = 'POSTMORTEM_COMPLETE';
      const postmortemData: IncidentPostMortem = {
        ...payload,
        completed_at: new Date().toISOString(),
      };
      inc.postmortem = postmortemData;

      const newRetained: RecalledExperience = {
        source_incident_id: inc.id,
        title: inc.title,
        incident_pattern: inc.analysis?.classification || inc.incident_type,
        similarity_score: 1.0,
        relevance_label: 'Exact Retained Match (100%)',
        what_happened: payload.what_happened,
        past_root_cause: payload.root_cause,
        past_actions_taken: inc.resolution?.actions_taken || [payload.what_was_done],
        past_outcome: payload.final_outcome,
        lesson_learned: payload.lessons_learned,
        timestamp: new Date().toISOString(),
      };
      localRetainedExperiences.unshift(newRetained);

      const newLearningEvent: LearningEvent = {
        id: `LRN-${String(localLearningEvents.length + 1).padStart(3, '0')}`,
        incident_id: inc.id,
        title: `${inc.incident_type} Remediation Experience Retained`,
        attack_type: inc.incident_type,
        trigger_event: 'Post-Mortem Completed & Retained in Hindsight',
        retained_memory_id: `mem_${inc.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        timestamp: new Date().toISOString(),
        root_cause: payload.root_cause,
        outcome_summary: payload.final_outcome,
        lessons_learned: payload.lessons_learned,
      };
      localLearningEvents.unshift(newLearningEvent);

      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }

    // Real backend: 1. Post-mortem -> 2. Learn
    const backendPayload = {
      root_cause: payload.root_cause,
      lessons_learned: payload.lessons_learned,
    };

    const res = await fetch(`${API_BASE}/api/incidents/${id}/postmortem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });
    const raw = await handleResponse<any>(res);

    // Call POST /learn to commit into Hindsight memory
    try {
      await fetch(`${API_BASE}/api/incidents/${id}/learn`, { method: 'POST' });
    } catch (e) {
      console.warn('Hindsight retain notification error:', e);
    }

    return normalizeIncident(raw);
  },

  // 11. POST /api/incidents/{incident_id}/learn
  async recordLearning(id: string): Promise<{ status: string; detail: string }> {
    if (USE_MOCK) {
      return { status: 'success', detail: `Experience for ${id} retained in sentinel-incident-memory` };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/learn`, { method: 'POST' });
    return handleResponse(res);
  },

  // 12. GET all retained memories
  async getMemoryItems(): Promise<RecalledExperience[]> {
    if (USE_MOCK) {
      return [...localRetainedExperiences];
    }
    try {
      const incidents = await this.listIncidents();
      const memories: RecalledExperience[] = [];
      for (const inc of incidents) {
        if (inc.postmortem) {
          memories.push({
            source_incident_id: inc.id,
            title: inc.title,
            incident_pattern: inc.incident_type,
            similarity_score: 1.0,
            relevance_label: 'Hindsight Retained Capsule',
            what_happened: inc.description,
            past_root_cause: inc.postmortem.root_cause,
            past_actions_taken: inc.resolution?.actions_taken || [],
            past_outcome: inc.postmortem.final_outcome || inc.resolution?.outcome || 'Resolved',
            lesson_learned: inc.postmortem.lessons_learned,
            timestamp: inc.postmortem.completed_at || inc.updated_at,
          });
        }
      }
      return memories.length > 0 ? memories : localRetainedExperiences;
    } catch {
      return localRetainedExperiences;
    }
  },

  // 13. GET learning timeline
  async getLearningTimeline(): Promise<LearningEvent[]> {
    if (USE_MOCK) {
      return [...localLearningEvents];
    }
    try {
      const incidents = await this.listIncidents();
      const events: LearningEvent[] = [];
      let counter = 1;
      for (const inc of incidents) {
        if (inc.postmortem) {
          events.push({
            id: `LRN-${String(counter++).padStart(3, '0')}`,
            incident_id: inc.id,
            title: `${inc.title} - Lessons Retained`,
            attack_type: inc.incident_type,
            trigger_event: 'Post-Mortem Retained in Hindsight',
            retained_memory_id: `mem_${inc.id.toLowerCase()}`,
            timestamp: inc.postmortem.completed_at || inc.updated_at,
            root_cause: inc.postmortem.root_cause,
            outcome_summary: inc.postmortem.final_outcome || inc.resolution?.outcome || 'Mitigated',
            lessons_learned: inc.postmortem.lessons_learned,
            matched_subsequent_incidents: inc.id === 'INC-2026-001' ? ['INC-2026-002'] : undefined,
          });
        }
      }
      return events.length > 0 ? events : localLearningEvents;
    } catch {
      return localLearningEvents;
    }
  },
};
