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

      {/* Memory Influence Provenance Banner (Phase 4 Transparency) */}
      {recommendation.memory_influence && (
        <div className="p-3.5 rounded-lg bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-surface border border-purple-800/40 flex items-start gap-3 text-xs">
          <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-purple-300 font-semibold block font-mono text-[11px] uppercase tracking-wider">
              Memory Influence Provenance:
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {recommendation.memory_influence}
            </p>
          </div>
        </div>
      )}

      {/* Detailed Response Actions Table / List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-xs font-mono uppercase font-semibold text-slate-300 flex items-center gap-2">
            <span>Actionable Response Directives</span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              Interactive SOC Controls
            </span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Human-in-the-loop: SOC Analyst approval required for containment actions
          </span>
        </div>

        {(() => {
          // Normalize to detailed actions if detailed_actions is empty
          const actionsToRender = (recommendation.detailed_actions && recommendation.detailed_actions.length > 0)
            ? recommendation.detailed_actions
            : recommendation.recommended_actions.map((act, idx) => {
                const isAudit = act.includes('CRITICAL AUDIT') || act.toLowerCase().includes('audit');
                const isFirewall = act.toLowerCase().includes('firewall') || act.toLowerCase().includes('drop') || act.toLowerCase().includes('block');
                const isRunbook = act.includes('PREVENTION RUNBOOK');
                return {
                  id: `ACT-0${idx + 1}`,
                  action: act,
                  reason: isAudit 
                    ? 'Derived from root cause in recalled historical incident' 
                    : isRunbook 
                    ? 'Preventative guideline derived from historical post-mortem' 
                    : 'Immediate perimeter containment directive',
                  status: 'RECOMMENDED' as ActionStatus,
                  risk_level: isFirewall ? 'LOW' : isAudit ? 'LOW' : 'MEDIUM',
                  requires_approval: isFirewall,
                  category: isAudit ? 'audit' : isFirewall ? 'containment' : 'eradication',
                };
              });

          return (
            <div className="divide-y divide-border/60 border border-border/80 rounded-lg overflow-hidden bg-slate-900/40 shadow-inner">
              {actionsToRender.map((act) => {
                const isMemoryDerived = 
                  act.action.includes('CRITICAL AUDIT') || 
                  act.action.includes('PREVENTION RUNBOOK') || 
                  act.action.includes('INC-2026-001') || 
                  act.action.toLowerCase().includes('prior incident') ||
                  act.action.toLowerCase().includes('lesson learned');

                return (
                  <div 
                    key={act.id} 
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/80 transition ${
                      isMemoryDerived ? 'border-l-4 border-l-purple-500 bg-purple-950/10' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {act.id}
                        </span>
                        <span className="font-semibold text-slate-200">{act.action}</span>
                        
                        {isMemoryDerived && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/60 flex items-center gap-1 shadow-xs">
                            <Brain className="w-3 h-3 text-purple-400" />
                            Hindsight Precedent
                          </span>
                        )}

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
                      <p className="text-slate-400 text-[11px] font-mono">{act.reason}</p>
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
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
