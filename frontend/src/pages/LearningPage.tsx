import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  ArrowDown, 
  History, 
  Brain, 
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LearningEvent } from '../types';
import { LoadingState } from '../components/common';

export const LearningPage: React.FC = () => {
  const [timeline, setTimeline] = useState<LearningEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLearningTimeline()
      .then(setTimeline)
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Agent Learning & Evolution</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirical evidence of continuous improvement: How retained incident experiences transform into future defensive reflexes.
          </p>
        </div>

        <Link
          to="/incidents/INC-009"
          className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          Test Experience on INC-009
        </Link>
      </div>

      {/* Side-by-Side Architectural Comparison: Without Memory vs With Memory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Without Memory Card */}
        <div className="bg-surface border border-red-900/40 rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger" />
              <h2 className="text-base font-bold text-white">WITHOUT MEMORY (Stateless / Basic RAG)</h2>
            </div>
            <span className="text-[10px] font-mono text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">
              Zero Evolution
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              When an SSH brute-force attack strikes <code className="text-slate-300">prod-bastion-01</code>, a generic stateless LLM only looks up generic textbooks:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-300 block">Generic AI Output:</span>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-slate-500">•</span>
                  <span>Block the offending IP address at the firewall.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-500">•</span>
                  <span>Check server logs for successful logins.</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-lg text-red-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-red-200">
                <X className="w-4 h-4 text-danger" />
                <span>Critical Vulnerability Missed:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                The agent has no memory of the past incident where automated OS package upgrades reverted <code className="text-red-200 font-mono">sshd_config</code> to enable password authentication. The team only blocks the IP, leaving the underlying configuration flaw exposed for the next botnet.
              </p>
            </div>
          </div>
        </div>

        {/* With Memory Card */}
        <div className="bg-surface border border-emerald-900/40 rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h2 className="text-base font-bold text-white">WITH HINDSIGHT MEMORY (Sentinel Memory)</h2>
            </div>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              Continuous Learning
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Sentinel recalls previous experience <code className="text-purple-300 font-mono font-bold">INC-001</code> (92% similarity) and injects the retained post-mortem lesson:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-900/40 space-y-2">
              <span className="font-semibold text-accent block">Memory-Enriched Recommendation:</span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Apply perimeter edge firewall rule to block attacker IP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span className="text-amber-200 font-medium">
                    CRITICAL AUDIT: Check sshd_config on prod-bastion-01! In prior incident INC-001, root cause was password authentication enabled by routine package upgrade.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-light">•</span>
                  <span>PREVENTION RUNBOOK: Enforce automated Ansible compliance check from INC-001 lesson.</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-emerald-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                <Check className="w-4 h-4 text-accent" />
                <span>Outcome-Oriented Protection:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                The agent proactively prevents repeated mistakes, alerting the analyst to inspect configuration drift and permanently eliminating the vulnerability before a breach occurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Learning Timeline (Section 12) */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-base font-semibold text-white">Chronological Memory Evolution Timeline</h2>
              <p className="text-xs text-slate-400">
                Incident → Response → Outcome → Lesson Retained → Recalled in Subsequent Attacks
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded border border-purple-800/40">
            {timeline.length} Learning Milestones
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading learning timeline..." />
        ) : timeline.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No learning milestones recorded yet.</p>
        ) : (
          <div className="relative border-l-2 border-purple-900/60 ml-4 pl-6 space-y-8">
            {timeline.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-purple-300" />
                </div>

                <div className="bg-slate-900/70 border border-slate-800 group-hover:border-purple-800/60 rounded-xl p-5 space-y-3 text-xs transition">
                  {/* Event Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-light">{evt.id}</span>
                      <span className="font-semibold text-white text-sm">{evt.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
                        {evt.attack_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Flow Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {/* Trigger Event */}
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                      <span className="text-slate-400 font-semibold block text-[11px] mb-1">Trigger Event:</span>
                      <p className="text-slate-300">{evt.trigger_event}</p>
                    </div>

                    {/* Discovered Root Cause */}
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                      <span className="text-warning font-semibold block text-[11px] mb-1">Root Cause:</span>
                      <p className="text-slate-300">{evt.root_cause}</p>
                    </div>

                    {/* Outcome Summary */}
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                      <span className="text-accent font-semibold block text-[11px] mb-1">Outcome:</span>
                      <p className="text-slate-300">{evt.outcome_summary}</p>
                    </div>
                  </div>

                  {/* Retained Lesson Callout */}
                  <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/30 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-purple-300 font-semibold block text-[11px]">Lesson Retained into Memory Bank:</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{evt.lessons_learned}</p>
                    </div>
                  </div>

                  {/* Matched Subsequent Incidents */}
                  {evt.matched_subsequent_incidents && evt.matched_subsequent_incidents.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Subsequent incidents benefiting from this memory:</span>
                      <div className="flex items-center gap-1.5">
                        {evt.matched_subsequent_incidents.map((subId) => (
                          <Link
                            key={subId}
                            to={`/incidents/${subId}`}
                            className="font-mono text-accent hover:underline bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <span>{subId}</span>
                            <ArrowDown className="w-3 h-3 rotate-[-45deg]" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
