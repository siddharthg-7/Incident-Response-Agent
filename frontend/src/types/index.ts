export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentSeverity = Severity;

export type IncidentStatus = 
  | 'OPEN'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'RECOMMENDATION_READY'
  | 'INVESTIGATING'
  | 'ACTION_REQUIRED'
  | 'RESOLVED'
  | 'POSTMORTEM_COMPLETE';

export type ActionStatus = 'RECOMMENDED' | 'APPROVED' | 'EXECUTED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IncidentEvidence {
  log_source?: string;
  source_ip?: string;
  destination_host?: string;
  attempted_usernames?: string[];
  failed_attempts?: number;
  time_window?: string;
  authentication_method?: string;
  geo_origin?: string;
  raw_payload?: Record<string, any>;
  [key: string]: any;
}
export type Evidence = IncidentEvidence;

export interface IncidentAnalysis {
  classification: string;
  assessed_severity: Severity;
  confidence: number;
  suspected_root_cause: string;
  investigation_summary: string;
  evidence_summary: string[];
  tactics: string[];
  extracted_iocs: string[];
  analyzed_at: string;
}

export interface PastResponse {
  actions_taken: string[];
  outcome: string;
  resolved_by?: string;
}

export interface RecalledExperience {
  source_incident_id: string;
  title: string;
  incident_pattern: string;
  similarity_score: number;
  relevance_label: string; // e.g. "Relevant past experience" or "High Match"
  what_happened: string;
  past_root_cause: string;
  past_actions_taken: string[];
  past_outcome: string;
  lesson_learned: string;
  timestamp: string;
}
export type MemoryMatch = RecalledExperience;

export interface ResponseAction {
  id: string;
  action: string;
  reason: string;
  status: ActionStatus;
  risk_level: RiskLevel;
  requires_approval: boolean;
  category?: 'containment' | 'eradication' | 'recovery' | 'audit';
}

export interface IncidentRecommendation {
  recommended_response: string;
  why_this_response: string;
  memory_influence: string; // e.g. "Memory-informed recommendation based on INC-001"
  expected_objective: string;
  potential_risks: string;
  recommended_actions: string[];
  detailed_actions?: ResponseAction[];
  confidence: number;
  recalled_experiences: RecalledExperience[];
  generated_at: string;
}
export type Recommendation = IncidentRecommendation;

export interface IncidentResolution {
  status: IncidentStatus;
  actions_taken: string[];
  outcome: string;
  notes?: string;
  resolved_by: string;
  resolved_at: string;
}
export type Resolution = IncidentResolution;

export interface IncidentPostMortem {
  what_happened: string;
  root_cause: string;
  what_was_done: string;
  what_worked: string;
  what_did_not_work: string;
  final_outcome: string;
  lessons_learned: string;
  completed_at: string;
}
export type Postmortem = IncidentPostMortem;

export interface LearningEvent {
  id: string;
  incident_id: string;
  title: string;
  attack_type: string;
  trigger_event: string;
  retained_memory_id: string;
  timestamp: string;
  root_cause: string;
  outcome_summary: string;
  lessons_learned: string;
  matched_subsequent_incidents?: string[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  incident_type: string;
  severity: Severity;
  status: IncidentStatus;
  source?: string;
  target?: string;
  indicators: string[];
  evidence: IncidentEvidence;
  detected_at: string;
  created_at: string;
  updated_at: string;
  analyst_assigned?: string;
  analysis?: IncidentAnalysis;
  recommendation?: IncidentRecommendation;
  resolution?: IncidentResolution;
  postmortem?: IncidentPostMortem;
}

export interface SystemHealth {
  status: string;
  version: string;
  database: string;
  hindsight: {
    status: string;
    mode: string;
    bank_id?: string;
    banks_active?: number;
    total_memories_indexed?: number;
  };
}

