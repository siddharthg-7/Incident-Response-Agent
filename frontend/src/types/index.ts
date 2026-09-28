export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentSeverity = Severity;

export type IncidentStatus = 
  | 'NEW'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'RECOMMENDATION_READY'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'POSTMORTEM_COMPLETE';

export interface RecalledExperience {
  source_incident_id: string;
  title: string;
  similarity_score: number;
  past_root_cause?: string;
  past_actions_taken: string[];
  past_outcome?: string;
  lesson_learned?: string;
}
export type MemoryMatch = RecalledExperience;

export interface IncidentAnalysis {
  summary: string;
  attack_vector?: string;
  potential_impact?: string;
  tactics: string[];
  extracted_iocs: string[];
  assessed_severity: Severity;
  confidence: number;
  analyzed_at: string;
}

export interface ResponseAction {
  action: string;
  category?: 'containment' | 'eradication' | 'recovery' | 'audit';
  priority?: number;
  is_automated?: boolean;
}

export interface IncidentRecommendation {
  recommended_actions: string[];
  rationale: string;
  confidence: number;
  recalled_experiences: RecalledExperience[];
  generated_at: string;
}
export type Recommendation = IncidentRecommendation;

export interface IncidentResolution {
  actions_taken: string[];
  outcome: string;
  resolved_by: string;
  resolved_at: string;
}
export type Resolution = IncidentResolution;

export interface IncidentPostMortem {
  root_cause: string;
  lessons_learned: string;
  completed_at: string;
}
export type Postmortem = IncidentPostMortem;

export interface LearningEvent {
  id: string;
  incident_id: string;
  title: string;
  trigger_event: string;
  retained_memory_id: string;
  timestamp: string;
  root_cause: string;
  lessons_learned: string;
  outcome_summary: string;
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
  evidence: Record<string, any>;
  detected_at: string;
  created_at: string;
  updated_at: string;
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
