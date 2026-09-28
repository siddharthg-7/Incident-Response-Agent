import React from 'react';
import { Brain, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { RecalledExperience } from '../../types';

interface Props {
  match: RecalledExperience;
}

export const MemoryMatchCard: React.FC<Props> = ({ match }) => {
  const percentage = Math.round(match.similarity_score * 100);

  return (
    <div className="bg-surface border border-purple-900/40 hover:border-purple-800/60 rounded-xl p-5 space-y-4 transition shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-purple-300 font-bold">{match.source_incident_id}</span>
              <span className="text-xs text-slate-300 font-medium">{match.title}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{match.incident_pattern}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
            {match.relevance_label || 'Relevant past experience'}
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
            {percentage}% Match
          </span>
        </div>
      </div>

      {/* Narrative grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* What Happened & Root Cause */}
        <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-slate-400 block font-semibold mb-1">What Happened Previously:</span>
            <p className="text-slate-300 leading-relaxed">{match.what_happened}</p>
          </div>
          {match.past_root_cause && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-warning font-semibold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Identified Root Cause:</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">{match.past_root_cause}</p>
            </div>
          )}
        </div>

        {/* Previous Response & Outcome */}
        <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Previous Response Taken:</span>
            <ul className="space-y-1 text-slate-300">
              {match.past_actions_taken.map((action, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-primary-light font-mono font-bold">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
          {match.past_outcome && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-accent font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Historical Outcome:</span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed">{match.past_outcome}</p>
            </div>
          )}
        </div>
      </div>

      {/* Retained Lesson Callout */}
      {match.lesson_learned && (
        <div className="p-3 bg-gradient-to-r from-purple-950/30 to-slate-950 border border-purple-800/30 rounded-lg flex items-start gap-2.5 text-xs">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-purple-300 font-semibold block mb-0.5">Lesson Retained in Memory:</span>
            <p className="text-slate-300 leading-relaxed">{match.lesson_learned}</p>
          </div>
        </div>
      )}
    </div>
  );
};
