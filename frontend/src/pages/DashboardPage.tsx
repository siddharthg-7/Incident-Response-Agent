import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Brain, CheckCircle2, Clock, ArrowRight, Play } from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const DashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listIncidents()
      .then(setIncidents)
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'POSTMORTEM_COMPLETE');
  const resolved = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'POSTMORTEM_COMPLETE');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Operations Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Hindsight-accelerated triage, memory-enriched investigation, and continuous post-mortem retention.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Alerts</span>
            <ShieldAlert className="w-5 h-5 text-warning" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{pending.length}</div>
          <p className="text-xs text-slate-400 mt-1">Requiring SOC analyst triage</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Hindsight Memories</span>
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{resolved.length > 0 ? resolved.length : 1}</div>
          <p className="text-xs text-slate-400 mt-1">Retained experience capsules</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Resolved Incidents</span>
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{resolved.length}</div>
          <p className="text-xs text-slate-400 mt-1">Post-mortems completed</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Avg Response Time</span>
            <Clock className="w-5 h-5 text-primary-light" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">12 min</div>
          <p className="text-xs text-slate-400 mt-1">Accelerated by memory recall</p>
        </div>
      </div>

      {/* Quick Action: Milestone 1 Demo Banner */}
      <div className="p-6 bg-gradient-to-r from-primary/15 via-purple-900/10 to-surface border border-primary/30 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-mono font-semibold">MILESTONE 1</span>
            <h3 className="text-base font-semibold text-white">Central Hindsight Loop Active</h3>
          </div>
          <p className="text-sm text-slate-300">
            Incident JSON → AI Analysis → Hindsight RETAIN → Second Incident → Hindsight RECALL → Contextual Recommendation
          </p>
        </div>
        <Link
          to="/incidents"
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Inspect Incident Queue
        </Link>
      </div>

      {/* Recent Incidents Overview */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Active Queue & Past Experiences</h2>
          <Link to="/incidents" className="text-xs text-primary-light hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No incidents loaded yet. Seed scenarios from <code className="text-slate-300">data/scenarios/</code> or trigger the API.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {incidents.slice(0, 5).map((inc) => (
              <div key={inc.id} className="p-4 hover:bg-surfaceHover/50 transition flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">{inc.id}</span>
                    <span className="font-medium text-slate-200">{inc.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                      inc.severity === 'HIGH' || inc.severity === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-warning/20 text-warning border border-warning/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{inc.description}</p>
                </div>
                <Link
                  to={`/incidents/${inc.id}`}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                >
                  Investigate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
