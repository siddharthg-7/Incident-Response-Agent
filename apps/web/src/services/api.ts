import { Incident, SystemHealth, RecalledExperience } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<SystemHealth>(res);
  },

  async listIncidents(status?: string, severity?: string): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    const res = await fetch(`${API_BASE}/api/incidents?${params.toString()}`);
    return handleResponse<Incident[]>(res);
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}`);
    return handleResponse<Incident>(res);
  },

  async analyzeIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/analyze`, {
      method: 'POST',
    });
    return handleResponse<Incident>(res);
  },

  async recommendIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/recommend`, {
      method: 'POST',
    });
    return handleResponse<Incident>(res);
  },

  async getMemoryMatches(id: string): Promise<RecalledExperience[]> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/memory`);
    return handleResponse<RecalledExperience[]>(res);
  },

  async resolveIncident(id: string, actions: string[], outcome: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions_taken: actions, outcome, resolved_by: 'soc_analyst' }),
    });
    return handleResponse<Incident>(res);
  },

  async submitPostMortem(id: string, rootCause: string, lessonsLearned: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/postmortem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ root_cause: rootCause, lessons_learned: lessonsLearned }),
    });
    return handleResponse<Incident>(res);
  },

  async learnIncident(id: string): Promise<{ status: string; detail: string }> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/learn`, {
      method: 'POST',
    });
    return handleResponse(res);
  },
};
