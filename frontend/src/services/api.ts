import { 
  Incident, 
  SystemHealth, 
  RecalledExperience, 
  IncidentPostMortem,
  LearningEvent,
  ActionStatus,
  IncidentStatus
} from '../types';
import { 
  mockHealth, 
  mockIncidents, 
  mockRetainedExperiences, 
  mockLearningEvents 
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK === 'true';

// In-memory reactive stores for Phase 2 mock mode
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

export const api = {
  isMockMode(): boolean {
    return USE_MOCK;
  },

  // GET /health
  async getHealth(): Promise<SystemHealth> {
    if (USE_MOCK) return mockHealth;
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse<SystemHealth>(res);
    } catch {
      console.warn('Backend unavailable, falling back to mock health');
      return mockHealth;
    }
  },

  // GET /api/incidents
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
      return await handleResponse<Incident[]>(res);
    } catch {
      console.warn('Backend unavailable, falling back to mock incidents');
      return localIncidents;
    }
  },

  // GET /api/incidents/{incident_id}
  async getIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      // Direct match
      const found = localIncidents.find((i) => i.id === id);
      if (found) return { ...found };

      // Route fallback: map test-incident or unknown IDs to primary demo INC-009
      if (id === 'test-incident' || id.toLowerCase().includes('demo')) {
        const demo = localIncidents.find((i) => i.id === 'INC-009') || localIncidents[0];
        return { ...demo };
      }

      // Synthetic fallback for any arbitrary ID
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
      return await handleResponse<Incident>(res);
    } catch (err) {
      const found = localIncidents.find((i) => i.id === id);
      if (found) return found;
      throw err;
    }
  },

  // POST /api/incidents
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
    const res = await fetch(`${API_BASE}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Incident>(res);
  },

  // POST /api/incidents/{incident_id}/analyze
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
      // Update in local array
      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/analyze`, { method: 'POST' });
    return handleResponse<Incident>(res);
  },

  // GET /api/incidents/{incident_id}/memory
  async getIncidentMemory(id: string): Promise<RecalledExperience[]> {
    if (USE_MOCK) {
      const inc = await this.getIncident(id);
      if (inc.recommendation?.recalled_experiences && inc.recommendation.recalled_experiences.length > 0) {
        return inc.recommendation.recalled_experiences;
      }
      return localRetainedExperiences;
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/memory`);
    return handleResponse<RecalledExperience[]>(res);
  },

  // POST /api/incidents/{incident_id}/recommend
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
    return handleResponse<Incident>(res);
  },

  // Update response action status (Approve / Execute) in mock mode
  async updateActionStatus(incidentId: string, actionId: string, newStatus: ActionStatus): Promise<Incident> {
    if (USE_MOCK) {
      const inc = await this.getIncident(incidentId);
      if (inc.recommendation?.detailed_actions) {
        const act = inc.recommendation.detailed_actions.find((a) => a.id === actionId);
        if (act) act.status = newStatus;
      }
      const idx = localIncidents.findIndex((i) => i.id === inc.id);
      if (idx !== -1) localIncidents[idx] = { ...inc };
      return { ...inc };
    }
    // Phase 3 backend endpoint hook
    return this.getIncident(incidentId);
  },

  // POST /api/incidents/{incident_id}/resolve
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
    const res = await fetch(`${API_BASE}/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Incident>(res);
  },

  // POST /api/incidents/{incident_id}/postmortem
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

      // Automatically retain as an experience capsule in Hindsight memory
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

      // Automatically register into the learning timeline
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
    const res = await fetch(`${API_BASE}/api/incidents/${id}/postmortem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Incident>(res);
  },

  // POST /api/incidents/{incident_id}/learn
  async recordLearning(id: string): Promise<{ status: string; detail: string }> {
    if (USE_MOCK) {
      return { status: 'success', detail: `Experience for ${id} retained in sentinel-incident-memory` };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/learn`, { method: 'POST' });
    return handleResponse(res);
  },

  // GET /api/memory - Get all retained experiences
  async getMemoryItems(): Promise<RecalledExperience[]> {
    if (USE_MOCK) {
      return [...localRetainedExperiences];
    }
    try {
      const res = await fetch(`${API_BASE}/api/memory`);
      return await handleResponse<RecalledExperience[]>(res);
    } catch {
      return localRetainedExperiences;
    }
  },

  // GET /api/learning - Get learning timeline
  async getLearningTimeline(): Promise<LearningEvent[]> {
    if (USE_MOCK) {
      return [...localLearningEvents];
    }
    try {
      const res = await fetch(`${API_BASE}/api/learn`);
      return await handleResponse<LearningEvent[]>(res);
    } catch {
      return localLearningEvents;
    }
  },
};
