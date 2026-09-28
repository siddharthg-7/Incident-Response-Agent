import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.listIncidents()
      .then(setIncidents)
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Incident Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            Incoming security telemetry and retained historical response cases.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading incident queue...</div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-slate-300 font-medium">No incidents currently registered in DB</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Run <code className="bg-slate-900 px-2 py-0.5 rounded text-primary-light">python scripts/run_milestone1_demo.py</code> or POST to <code className="bg-slate-900 px-2 py-0.5 rounded text-primary-light">/api/incidents</code>.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-slate-900/60 text-xs font-mono uppercase text-slate-400">
                <th className="py-3.5 px-6">ID & Title</th>
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Target</th>
                <th className="py-3.5 px-6">Hindsight Memory</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-surfaceHover/50 transition">
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs text-slate-400 block">{inc.id}</span>
                    <span className="font-medium text-slate-200">{inc.title}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold ${
                      inc.severity === 'HIGH' || inc.severity === 'CRITICAL'
                        ? 'bg-danger/20 text-danger border border-danger/30'
                        : 'bg-warning/20 text-warning border border-warning/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-mono text-slate-400">
                    {inc.target || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    {inc.recommendation?.recalled_experiences && inc.recommendation.recalled_experiences.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-accent font-medium bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                        <Shield className="w-3 h-3" />
                        {inc.recommendation.recalled_experiences.length} Past Match
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 rounded transition"
                    >
                      Investigate <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
