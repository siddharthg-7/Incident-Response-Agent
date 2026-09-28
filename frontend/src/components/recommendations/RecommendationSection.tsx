import React from 'react';
import { Sparkles, Brain, Check, Clock, AlertTriangle } from 'lucide-react';
import { IncidentRecommendation, ActionStatus } from '../../types';

interface Props {
  recommendation: IncidentRecommendation;
  onUpdateActionStatus?: (actionId: string, status: ActionStatus) => void;
}

export const RecommendationSection: React.FC<Props> = ({
  recommendation,
  onUpdateActionStatus,
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-6">
      {/* Header with Memory-Informed Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Adaptive Response Recommendation</h2>
            <p className="text-xs text-slate-400">Synthesized from telemetry evidence and Hindsight memory bank</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-purple-950/70 text-purple-300 border border-purple-800/60 shadow-sm">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            Memory-informed recommendation
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {(recommendation.confidence * 100).toFixed(0)}% Confidence
          </span>
        </div>
      </div>

      {/* Strategic Rationale Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Recommended Response:</span>
            <p className="text-slate-200 leading-relaxed font-medium">{recommendation.recommended_response}</p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-accent block font-semibold mb-1">Why this response?</span>
            <p className="text-slate-300 leading-relaxed">{recommendation.why_this_response}</p>
          </div>
        </div>

        <div className="space-y-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <div>
            <span className="text-primary-light block font-semibold mb-1">Expected Objective:</span>
            <p className="text-slate-300 leading-relaxed">{recommendation.expected_objective}</p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1 text-warning font-semibold mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Potential Operational Risks:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{recommendation.potential_risks}</p>
          </div>
        </div>
      </div>

      {/* Detailed Response Actions Table / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase font-semibold text-slate-300">
            Actionable Response Directives
          </h3>
          <span className="text-[11px] text-slate-400">
            Human-in-the-loop: Analyst approval required for containment actions
          </span>
        </div>

        {recommendation.detailed_actions && recommendation.detailed_actions.length > 0 ? (
          <div className="divide-y divide-border/60 border border-border/80 rounded-lg overflow-hidden bg-slate-900/40">
            {recommendation.detailed_actions.map((act) => (
              <div key={act.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/80 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {act.id}
                    </span>
                    <span className="font-semibold text-slate-200">{act.action}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold ${
                      act.risk_level === 'HIGH'
                        ? 'bg-danger/20 text-danger border border-danger/30'
                        : act.risk_level === 'MEDIUM'
                        ? 'bg-warning/20 text-warning border border-warning/30'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    }`}>
                      Risk: {act.risk_level}
                    </span>
                    {act.requires_approval ? (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                        Approval Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400">
                        Auto-Permitted
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">{act.reason}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded font-medium flex items-center gap-1.5 ${
                    act.status === 'EXECUTED'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      : act.status === 'APPROVED'
                      ? 'bg-primary/20 text-primary-light border border-primary/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {act.status === 'EXECUTED' && <Check className="w-3 h-3 text-emerald-400" />}
                    {act.status === 'APPROVED' && <Clock className="w-3 h-3 text-primary-light" />}
                    {act.status}
                  </span>

                  {onUpdateActionStatus && act.status === 'RECOMMENDED' && (
                    <button
                      onClick={() => onUpdateActionStatus(act.id, 'APPROVED')}
                      className="px-2.5 py-1 text-[11px] bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 rounded transition"
                    >
                      Approve
                    </button>
                  )}

                  {onUpdateActionStatus && act.status === 'APPROVED' && (
                    <button
                      onClick={() => onUpdateActionStatus(act.id, 'EXECUTED')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-600/50 rounded transition"
                    >
                      Mark Executed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2 text-xs">
            {recommendation.recommended_actions.map((act, i) => (
              <li key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-start gap-2">
                <span className="font-mono text-primary-light font-bold">{i + 1}.</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
