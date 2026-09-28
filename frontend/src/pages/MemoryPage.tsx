import React, { useEffect, useState, useMemo } from 'react';
import { 
  Brain, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RecalledExperience } from '../types';
import { LoadingState, EmptyState } from '../components/common';

export const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<RecalledExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patternFilter, setPatternFilter] = useState('ALL');

  useEffect(() => {
    api.getMemoryItems()
      .then(setMemories)
      .catch(() => setMemories([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches = 
          mem.source_incident_id.toLowerCase().includes(q) ||
          mem.title.toLowerCase().includes(q) ||
          mem.incident_pattern.toLowerCase().includes(q) ||
          mem.what_happened.toLowerCase().includes(q) ||
          mem.past_root_cause.toLowerCase().includes(q) ||
          mem.lesson_learned.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (patternFilter !== 'ALL' && !mem.incident_pattern.toLowerCase().includes(patternFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [memories, searchTerm, patternFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Hindsight Incident Memory Bank</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Persistent experience repository retaining real incident outcomes, root causes, and prevention lessons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/50">
            Bank: <code className="font-bold">sentinel-incident-memory</code>
          </span>
        </div>
      </div>

      {/* Core Mission Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-950/30 via-slate-900 to-surface border border-purple-900/40 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Experience-Driven Cybersecurity</h3>
          </div>
          <p className="text-xs text-slate-300">
            "The system remembers what happened and what worked." Every post-mortem resolution transforms into future defense capability.
          </p>
        </div>
        <Link
          to="/learning"
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0"
        >
          View Learning Timeline <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Memory Bank Biomimetic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-purple-400 uppercase">Retained Experience Capsules</span>
          <div className="text-2xl font-bold text-white">{memories.length} Capsules</div>
          <p className="text-xs text-slate-400">Validated resolutions, root causes, and containment runbooks</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-accent uppercase">Outcome Retention Rate</span>
          <div className="text-2xl font-bold text-white">100%</div>
          <p className="text-xs text-slate-400">All retained cases have confirmed, documented outcomes</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-primary-light uppercase">Active Memory Bank</span>
          <div className="text-2xl font-bold text-white">sentinel-memory</div>
          <p className="text-xs text-slate-400">Queried during triage via semantic + pattern recall</p>
        </div>
      </div>

      {/* Search & Pattern Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search memory bank by attack type, root cause, or lessons learned..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Pattern:</span>
            <select
              value={patternFilter}
              onChange={(e) => setPatternFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
            >
              <option value="ALL">All Attack Patterns</option>
              <option value="SSH">SSH Brute Force</option>
              <option value="PowerShell">PowerShell Execution</option>
            </select>
          </div>
        </div>
      </div>

      {/* Retained Memory Capsules Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Retained Incident Experience Capsules</h2>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredMemories.length} of {memories.length} retained memories
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading Hindsight experience capsules..." />
        ) : filteredMemories.length === 0 ? (
          <EmptyState
            title="No Retained Memories Found"
            description="No experience capsules match your search criteria."
          />
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((mem, idx) => (
              <div
                key={idx}
                className="bg-surface border border-purple-900/40 hover:border-purple-800/70 rounded-xl p-5 space-y-4 transition shadow-sm"
              >
                {/* Capsule Top Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800/60">
                      {mem.source_incident_id}
                    </span>
                    <span className="text-sm font-semibold text-white">{mem.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-purple-900/40 text-purple-300 font-mono border border-purple-800/40">
                      RETAINED
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono">{mem.incident_pattern}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(mem.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Structured Experience Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: What Happened & Root Cause */}
                  <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Incident Scenario:</span>
                      <p className="text-slate-300 leading-relaxed">{mem.what_happened}</p>
                    </div>
                    {mem.past_root_cause && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-warning font-semibold mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Discovered Root Cause:</span>
                        </div>
                        <p className="text-amber-200/90 leading-relaxed">{mem.past_root_cause}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions & Historical Outcome */}
                  <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Response Actions Executed:</span>
                      <ul className="space-y-1 text-slate-300">
                        {mem.past_actions_taken.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-accent font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {mem.past_outcome && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-accent font-semibold mb-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Historical Outcome:</span>
                        </div>
                        <p className="text-emerald-200/90 leading-relaxed">{mem.past_outcome}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Retained Lesson Callout */}
                {mem.lesson_learned && (
                  <div className="p-3.5 bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-800/40 rounded-lg flex items-start gap-2.5 text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-purple-300 font-semibold block mb-0.5">Lesson Retained for Future Incidents:</span>
                      <p className="text-slate-200 leading-relaxed">{mem.lesson_learned}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPage;
