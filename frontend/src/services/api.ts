import { Incident, SystemHealth, RecalledExperience } from '../types';
import { mockHealth, mockIncidents } from './mockData';

// VITE_API_URL as specified in system prompt
const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// In-memory store for frontend mock mode
let localIncidents: Incident[] = [...mockIncidents];

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

  async getHealth(): Promise<SystemHealth> {
    if (USE_MOCK) return mockHealth;
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse<SystemHealth>(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock health status');
      return mockHealth;
    }
  },

  async listIncidents(status?: string, severity?: string): Promise<Incident[]> {
    if (USE_MOCK) {
      return localIncidents.filter((inc) => {
        if (status && inc.status !== status) return false;
        if (severity && inc.severity !== severity) return false;
        return true;
      });
    }
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (severity) params.append('severity', severity);
      const res = await fetch(`${API_BASE}/api/incidents?${params.toString()}`);
      return await handleResponse<Incident[]>(res);
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock incidents');
      return localIncidents;
    }
  },

  async getIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const found = localIncidents.find((i) => i.id === id);
      if (!found) throw new Error(`Incident ${id} not found in mock store`);
      return found;
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

  async analyzeIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = localIncidents.find((i) => i.id === id);
      if (!inc) throw new Error(`Incident ${id} not found`);
      inc.status = 'ANALYZED';
      inc.analysis = {
        summary: `Mock AI threat analysis for ${inc.title}. High-volume authentication anomalies detected.`,
        tactics: ['MITRE ATT&CK T1110.001 - Password Guessing'],
        extracted_iocs: inc.indicators || [],
        assessed_severity: inc.severity,
        confidence: 0.95,
        analyzed_at: new Date().toISOString(),
      };
      return { ...inc };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/analyze`, { method: 'POST' });
    return handleResponse<Incident>(res);
  },

  async recommendIncident(id: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = localIncidents.find((i) => i.id === id);
      if (!inc) throw new Error(`Incident ${id} not found`);
      inc.status = 'RECOMMENDATION_READY';
      inc.recommendation = {
        recommended_actions: [
          `Apply firewall DROP rule for ${inc.source || 'external IP'}`,
          `CRITICAL AUDIT: Check service configuration on ${inc.target || 'target host'} immediately for configuration drift`,
          'Enforce automated Ansible compliance check on edge hosts',
        ],
        rationale: 'Mock recommendation synthesized from historical incident experiences.',
        confidence: 0.92,
        recalled_experiences: [
          {
            source_incident_id: 'INC-2026-001',
            title: 'High Volume SSH Authentication Failure on Bastion-01',
            similarity_score: 0.88,
            past_root_cause: 'Password authentication was inadvertently enabled after OS update',
            past_actions_taken: ['Blocked IP', 'Disabled PasswordAuthentication in sshd_config'],
            past_outcome: 'Contained successfully in 12 min',
            lesson_learned: 'Enforce automated Ansible compliance check on sshd_config',
          },
        ],
        generated_at: new Date().toISOString(),
      };
      return { ...inc };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/recommend`, { method: 'POST' });
    return handleResponse<Incident>(res);
  },

  async getMemoryMatches(id: string): Promise<RecalledExperience[]> {
    if (USE_MOCK) {
      return [
        {
          source_incident_id: 'INC-2026-001',
          title: 'High Volume SSH Authentication Failure on Bastion-01',
          similarity_score: 0.88,
          past_root_cause: 'Password authentication was inadvertently enabled after OS update',
          past_actions_taken: ['Blocked IP', 'Disabled PasswordAuthentication in sshd_config'],
          past_outcome: 'Contained successfully in 12 min',
          lesson_learned: 'Enforce automated Ansible compliance check on sshd_config',
        },
      ];
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/memory`);
    return handleResponse<RecalledExperience[]>(res);
  },

  async resolveIncident(id: string, actions: string[], outcome: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = localIncidents.find((i) => i.id === id);
      if (!inc) throw new Error(`Incident ${id} not found`);
      inc.status = 'RESOLVED';
      inc.resolution = {
        actions_taken: actions,
        outcome,
        resolved_by: 'soc_analyst',
        resolved_at: new Date().toISOString(),
      };
      return { ...inc };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions_taken: actions, outcome, resolved_by: 'soc_analyst' }),
    });
    return handleResponse<Incident>(res);
  },

  async submitPostMortem(id: string, rootCause: string, lessonsLearned: string): Promise<Incident> {
    if (USE_MOCK) {
      const inc = localIncidents.find((i) => i.id === id);
      if (!inc) throw new Error(`Incident ${id} not found`);
      inc.status = 'POSTMORTEM_COMPLETE';
      inc.postmortem = {
        root_cause: rootCause,
        lessons_learned: lessonsLearned,
        completed_at: new Date().toISOString(),
      };
      return { ...inc };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/postmortem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ root_cause: rootCause, lessons_learned: lessonsLearned }),
    });
    return handleResponse<Incident>(res);
  },

  async learnIncident(id: string): Promise<{ status: string; detail: string }> {
    if (USE_MOCK) {
      return { status: 'success', detail: 'Experience retained in mock memory bank' };
    }
    const res = await fetch(`${API_BASE}/api/incidents/${id}/learn`, { method: 'POST' });
    return handleResponse(res);
  },
};
