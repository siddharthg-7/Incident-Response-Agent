import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, History } from 'lucide-react';
import { Incident, RecalledExperience } from '../../types';

interface Props {
  currentIncident: Incident;
  matchedExperience: RecalledExperience;
}

export const MemoryComparisonView: React.FC<Props> = ({ currentIncident, matchedExperience }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Experience Juxtaposition: Current Evidence vs. Past Outcome</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Match Confidence: {(matchedExperience.similarity_score * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Current Incident Evidence Side */}
        <div className="bg-slate-900/80 border border-border/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-warning font-semibold border-b border-slate-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span>CURRENT INCIDENT EVIDENCE ({currentIncident.id})</span>
          </div>

          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-mono text-warning font-bold">•</span>
              <span><strong>Attack Pattern:</strong> {currentIncident.analysis?.classification || currentIncident.incident_type}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-warning font-bold">•</span>
              <span><strong>Targeted Asset:</strong> {currentIncident.target || 'Perimeter Gateway'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-warning font-bold">•</span>
              <span><strong>Observed Telemetry:</strong> {currentIncident.evidence.failed_attempts || 400}+ attempts from {currentIncident.source || 'external IP'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-warning font-bold">•</span>
              <span><strong>Suspected Vulnerability:</strong> Exposed service responding to unauthorized authentication methods</span>
            </li>
          </ul>

          <div className="p-2.5 rounded bg-amber-950/20 border border-amber-900/30 text-amber-200/90 text-[11px]">
            Active ongoing threat. Rapid remediation required to prevent brute-force breach.
          </div>
        </div>

        {/* Remembered Experience & Proven Outcome Side */}
        <div className="bg-slate-900/80 border border-purple-900/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-semibold border-b border-purple-900/50 pb-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>PAST EXPERIENCE & PROVEN OUTCOME ({matchedExperience.source_incident_id})</span>
          </div>

          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-bold">•</span>
              <span><strong>Discovered Root Cause:</strong> {matchedExperience.past_root_cause}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-bold">•</span>
              <span><strong>Validated Response:</strong> {matchedExperience.past_actions_taken[0]} & {matchedExperience.past_actions_taken[1]}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-bold">•</span>
              <span><strong>Historical Outcome:</strong> {matchedExperience.past_outcome}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-purple-400 font-bold">•</span>
              <span><strong>Retained Lesson:</strong> {matchedExperience.lesson_learned}</span>
            </li>
          </ul>

          <div className="p-2.5 rounded bg-purple-950/25 border border-purple-800/30 text-purple-200 text-[11px] flex items-center justify-between">
            <span>Enriches response recommendation</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
