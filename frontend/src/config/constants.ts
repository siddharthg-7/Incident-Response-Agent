export const APP_NAME = 'Sentinel Memory';
export const APP_SUBTITLE = 'Hindsight-Powered Incident Response Agent';

export const DEFAULT_API_URL = 'http://localhost:8000';

export const SEVERITY_COLORS = {
  LOW: 'bg-slate-800 text-slate-300 border-slate-700',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
} as const;
