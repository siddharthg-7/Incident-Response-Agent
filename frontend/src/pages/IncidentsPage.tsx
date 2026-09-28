import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Brain, 
  AlertTriangle, 
  Plus 
} from 'lucide-react';
import { api } from '../services/api';
import { Incident, Severity } from '../types';
import { LoadingState, ErrorState, EmptyState } from '../components/common';
import { IncidentCreateModal } from '../components/incidents/IncidentCreateModal';

export const IncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'detected_at' | 'severity'>('detected_at');

  const loadData = () => {
    setLoading(true);
    setError(null);
    api.listIncidents()
      .then(setIncidents)
      .catch((err: any) => setError(err?.message || 'Failed to load incidents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches = 
          inc.id.toLowerCase().includes(query) ||
          inc.title.toLowerCase().includes(query) ||
          inc.description.toLowerCase().includes(query) ||
          (inc.source && inc.source.toLowerCase().includes(query)) ||
          (inc.target && inc.target.toLowerCase().includes(query)) ||
          inc.incident_type.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Severity filter
      if (severityFilter !== 'ALL' && inc.severity !== severityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && inc.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && !inc.incident_type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'severity') {
        const rank: Record<Severity, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return rank[b.severity] - rank[a.severity];
      }
      return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
    });
  }, [incidents, searchTerm, severityFilter, statusFilter, typeFilter, sortBy]);

  const handleCreateIncident = async (payload: any) => {
    const created = await api.createIncident(payload);
    loadData();
    navigate(`/incidents/${created.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Incident Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time security telemetry, active threat investigations, and retained historical response cases.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + Ingest Incident
          </button>
          <Link
            to="/incidents/INC-2026-002"
            className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            Demo Case (INC-002)
          </Link>
          <button
            onClick={loadData}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, keyword, IP, host, or attack pattern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ANALYZING">Analyzing</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RECOMMENDATION_READY">Recommendation Ready</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="RESOLVED">Resolved</option>
              <option value="POSTMORTEM_COMPLETE">Post-Mortem Complete</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
            >
              <option value="detected_at">Detection Time</option>
              <option value="severity">Severity Rank</option>
            </select>
          </div>
        </div>

        {/* Quick filter pill buttons for Attack Types */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Type Filter:</span>
          {['ALL', 'SSH', 'PowerShell', 'Outbound', 'Authentication', 'Privilege'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                typeFilter === t
                  ? 'bg-primary text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 font-mono">
            Showing {filteredIncidents.length} of {incidents.length} cases
          </span>
        </div>
      </div>

      {/* Incidents Queue Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <LoadingState message="Loading incident telemetry queue..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            title="No Incidents Match Selected Filters"
            description="Try relaxing your search terms or clearing active severity and status filters."
            icon={<AlertTriangle className="w-6 h-6 text-slate-400" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-900/60 font-mono uppercase text-slate-400">
                  <th className="py-3.5 px-6">ID & Classification</th>
                  <th className="py-3.5 px-6">Severity</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Affected Asset / IP</th>
                  <th className="py-3.5 px-6">Hindsight Recall</th>
                  <th className="py-3.5 px-6">Detection Time</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredIncidents.map((inc) => {
                  const hasMemory = 
                    inc.recommendation?.recalled_experiences && 
                    inc.recommendation.recalled_experiences.length > 0;

                  return (
                    <tr key={inc.id} className="hover:bg-surfaceHover/50 transition">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary-light">{inc.id}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {inc.incident_type}
                          </span>
                        </div>
                        <div className="font-medium text-slate-200 mt-1">{inc.title}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{inc.description}</div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-semibold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-danger/20 text-danger border border-danger/30'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-950/40 text-warning border border-warning/30'
                            : 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {inc.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        <div className="font-medium text-slate-200">{inc.target || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">Src: {inc.source || 'N/A'}</div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {hasMemory ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-300 font-medium bg-purple-950/50 border border-purple-800/50 px-2 py-0.5 rounded">
                            <Brain className="w-3 h-3 text-purple-400" />
                            {inc.recommendation!.recalled_experiences.length} Past Match
                          </span>
                        ) : inc.status === 'POSTMORTEM_COMPLETE' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-accent font-medium bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                            <Shield className="w-3 h-3" />
                            Retained Experience
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">No recall yet</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(inc.detected_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Link
                          to={`/incidents/${inc.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 rounded transition"
                        >
                          Investigate <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Ingestion Modal (Phase 3) */}
      <IncidentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIncident}
      />
    </div>
  );
};

export default IncidentsPage;
