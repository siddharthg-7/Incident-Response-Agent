import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Layers, 
  History
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';
import { LoadingState, EmptyState } from '../components/common';

export const DashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listIncidents()
      .then(setIncidents)
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'POSTMORTEM_COMPLETE'
  );
  const resolvedIncidents = incidents.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'POSTMORTEM_COMPLETE'
  );

  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = incidents.filter((i) => i.severity === 'MEDIUM').length;
  const lowCount = incidents.filter((i) => i.severity === 'LOW').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Operations Dashboard</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              SOC Threat Level: ELEVATED
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time incident monitoring, Hindsight-accelerated triage, and adaptive experience retention.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            Mock API Mode Active
          </span>
        </div>
      </div>

      {/* Primary KPI & Memory Summary Cards (Section 2.D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Incidents</span>
            <ShieldAlert className="w-5 h-5 text-warning" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{activeIncidents.length}</div>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-danger font-semibold">{criticalCount} Critical</span>, {highCount} High priority
          </p>
        </div>

        <div className="bg-surface border border-purple-900/40 rounded-xl p-5 hover:border-purple-800/60 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300 uppercase">Past Incidents Retained</span>
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {resolvedIncidents.length > 0 ? resolvedIncidents.length : 2}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experience capsules in <code className="text-purple-300 font-mono text-[10px]">sentinel-incident-memory</code>
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-accent uppercase">Similar Incidents Available</span>
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">4 Patterns</div>
          <p className="text-xs text-slate-400 mt-1">SSH Brute Force, PowerShell, C2 Beaconing</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-primary-light uppercase">Memory Influence Rate</span>
            <Sparkles className="w-5 h-5 text-primary-light" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">100%</div>
          <p className="text-xs text-slate-400 mt-1">
            Recommendations enriched by prior post-mortems
          </p>
        </div>
      </div>

      {/* Severity Summary Breakdown (Section 2.B) */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-sm font-semibold text-white">Incident Queue Severity Breakdown</h2>
          <span className="text-xs font-mono text-slate-400">Total Cases: {incidents.length}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-danger/10 border border-danger/25 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-danger font-semibold uppercase block">Critical</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{criticalCount}</span>
            </div>
            <span className="text-xs text-danger/80">Immediate</span>
          </div>

          <div className="p-3 bg-amber-950/20 border border-warning/25 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-warning font-semibold uppercase block">High</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{highCount}</span>
            </div>
            <span className="text-xs text-warning/80">Urgent</span>
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-blue-400 font-semibold uppercase block">Medium</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{mediumCount}</span>
            </div>
            <span className="text-xs text-blue-400/80">Standard</span>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase block">Low</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{lowCount}</span>
            </div>
            <span className="text-xs text-slate-400">Informational</span>
          </div>
        </div>
      </div>

      {/* Quick Actions (Section 2.E) */}
      <div className="p-6 bg-gradient-to-r from-primary/15 via-purple-950/20 to-surface border border-primary/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-mono font-semibold">
              PRIMARY DEMO SCENARIO
            </span>
            <h3 className="text-base font-semibold text-white">Investigate SSH Brute-Force (INC-009)</h3>
          </div>
          <p className="text-sm text-slate-300">
            Follow the complete loop: Telemetry Evidence → AI Analysis → Hindsight Recall (INC-001) → Contextual Recommendation → Resolution & Retain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/incidents/INC-009"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Investigate INC-009
          </Link>
          <Link
            to="/memory"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            View Memory Bank
          </Link>
          <Link
            to="/learning"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-accent" />
            Learning Timeline
          </Link>
        </div>
      </div>

      {/* Active Incidents Table (Section 2.A) */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Active Incidents Requiring Triage</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live detections under investigation by SOC team</p>
          </div>
          <Link to="/incidents" className="text-xs text-primary-light hover:underline flex items-center gap-1 font-medium">
            View full incident queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading SOC operational telemetry..." />
        ) : activeIncidents.length === 0 ? (
          <EmptyState
            title="All Clear: No Active Incidents"
            description="There are currently no active alerts requiring triage."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-900/60 font-mono uppercase text-slate-400">
                  <th className="py-3 px-6">Incident ID</th>
                  <th className="py-3 px-6">Type & Description</th>
                  <th className="py-3 px-6">Severity</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Source / Target</th>
                  <th className="py-3 px-6">Detection Time</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-surfaceHover/50 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-primary-light whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3.5 px-6 max-w-sm">
                      <div className="font-semibold text-slate-200">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{inc.description}</div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-danger/20 text-danger border border-danger/30'
                          : inc.severity === 'HIGH'
                          ? 'bg-amber-950/40 text-warning border border-warning/30'
                          : 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <div>Src: {inc.source || 'N/A'}</div>
                      <div>Tgt: {inc.target || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(inc.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 rounded font-medium transition inline-flex items-center gap-1"
                      >
                        Investigate <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Incidents (Active & Resolved) (Section 2.C) */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-white">Recently Handled & Resolved Cases</h2>
          </div>
          <span className="text-xs text-slate-400">Retained in Sentinel Memory</span>
        </div>

        {resolvedIncidents.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No resolved incidents recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {resolvedIncidents.map((res) => (
              <div
                key={res.id}
                className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-400 font-bold">{res.id}</span>
                    <span className="font-medium text-slate-200">{res.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1 text-[11px]">
                    <strong>Outcome:</strong> {res.resolution?.outcome || res.postmortem?.final_outcome || 'Threat neutralized.'}
                  </p>
                </div>
                <Link
                  to={`/incidents/${res.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition shrink-0 self-start sm:self-auto"
                >
                  Review Post-Mortem
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
