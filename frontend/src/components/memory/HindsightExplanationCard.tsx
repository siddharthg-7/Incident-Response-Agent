import React from 'react';
import { Brain, Cpu, Database, CheckCircle2, Shield, Info, ArrowRight } from 'lucide-react';
import { RecalledExperience, Incident } from '../../types';

interface Props {
  match?: RecalledExperience;
  incident: Incident;
}

export const HindsightExplanationCard: React.FC<Props> = ({ match, incident }) => {
  const percentage = match ? Math.round(match.similarity_score * 100) : 0;

  return (
    <div className="bg-surface border border-purple-900/50 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-800/60 text-purple-300">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Hindsight Cognitive Engine Explanation
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800/40">
                Experiential Memory
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Why and how this past incident was recalled from memory bank <code className="text-purple-300 font-mono text-[11px]">sentinel-incident-memory</code>
            </p>
          </div>
        </div>

        {match && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Semantic Overlap</span>
              <span className="text-xs font-mono font-bold text-accent">{percentage}% Match Confidence</span>
            </div>
            <div className="w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-accent rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Semantic Matching Breakdown */}
      {match ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-purple-300 font-mono font-semibold flex items-center gap-1.5 text-[11px]">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              1. Vector Similarity
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cosine similarity over threat telemetry and attack characteristics matched previous case <strong className="text-white font-mono">{match.source_incident_id}</strong>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-amber-300 font-mono font-semibold flex items-center gap-1.5 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-warning" />
              2. Matched Attack Vector
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Target asset (<code className="text-slate-200">{incident.target || 'Linux DMZ'}</code>) and telemetry pattern align with past brute-force credential stuffing.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-emerald-300 font-mono font-semibold flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              3. Outcome Relevance
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              The historical resolution (<strong className="text-white">{match.past_outcome}</strong>) provides actionable precedent that prevents repeating prior missteps.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <Info className="w-5 h-5 text-purple-400 shrink-0" />
          <span>
            Hindsight evaluates incoming incident telemetry against embeddings of prior resolved incidents. Run "Recall & Recommend" to query the memory bank.
          </span>
        </div>
      )}

      {/* Difference from Stateless RAG Callout */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-950 border border-purple-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2">
          <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <strong className="text-purple-300">Why this is not generic search:</strong> Hindsight recalls what your specific organization <em>did</em>, what <em>worked</em>, and what <em>failed</em>—not just static documentation.
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-purple-300 font-semibold shrink-0">
          <span>Target: Zero Recurrence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
