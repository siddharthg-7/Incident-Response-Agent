import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Brain, 
  CheckCircle, 
  ArrowLeft, 
  Cpu, 
  Sparkles, 
  Terminal,
  AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIncident = () => {
    if (!id) return;
    setLoading(true);
    api.getIncident(id)
      .then(setIncident)
      .catch(() => setIncident(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleAnalyze = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const updated = await api.analyzeIncident(id);
      setIncident(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecommend = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const updated = await api.recommendIncident(id);
      setIncident(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveAndRetain = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const actions = [
        "Applied edge firewall DROP rule for malicious IP",
        "Audited /etc/ssh/sshd_config and enforced PasswordAuthentication no",
        "Restarted sshd service"
      ];
      await api.resolveIncident(id, actions, "Threat mitigated successfully. No breach.");
      await api.submitPostMortem(
        id,
        "Package upgrade inadvertently reverted sshd_config defaults enabling password auth.",
        "Automate Ansible compliance checks on edge hosts every 15 minutes."
      );
      await api.learnIncident(id);
      fetchIncident();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading incident details...</div>;
  }

  if (!incident) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
        <p className="text-slate-300">Incident {id} not found in database.</p>
        <Link to="/incidents" className="text-primary-light hover:underline text-sm inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to incident queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/incidents" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Queue
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            Status: {incident.status}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded font-mono font-semibold ${
            incident.severity === 'HIGH' || incident.severity === 'CRITICAL'
              ? 'bg-danger/20 text-danger border border-danger/30'
              : 'bg-warning/20 text-warning border border-warning/30'
          }`}>
            {incident.severity}
          </span>
        </div>
      </div>

      {/* Incident Header */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-primary-light">{incident.id}</span>
            <h1 className="text-xl font-bold text-white mt-1">{incident.title}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">{incident.description}</p>
          </div>

          {/* Action trigger buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAnalyze}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5 text-primary-light" />
              1. Analyze Threat
            </button>
            <button
              onClick={handleRecommend}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-medium flex items-center gap-2 transition disabled:opacity-50 shadow-sm"
            >
              <Brain className="w-3.5 h-3.5" />
              2. Recall & Recommend
            </button>
            <button
              onClick={handleResolveAndRetain}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition disabled:opacity-50 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              3. Resolve & Retain
            </button>
          </div>
        </div>

        {/* Telemetry metadata tags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/60 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Source IP:</span>
            <span className="text-slate-200 font-mono mt-0.5 block">{incident.source || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono">Target Host:</span>
            <span className="text-slate-200 font-mono mt-0.5 block">{incident.target || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono">Detected At:</span>
            <span className="text-slate-200 mt-0.5 block">{new Date(incident.detected_at).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono">Indicators (IOCs):</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {incident.indicators?.map((ioc, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 rounded">
                  {ioc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Analysis & Evidence */}
        <div className="space-y-6">
          {/* Analysis Card */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Cpu className="w-4 h-4 text-primary-light" />
              <h2 className="text-sm font-semibold text-white">AI Threat Analysis</h2>
            </div>
            {incident.analysis ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">{incident.analysis.summary}</p>
                <div>
                  <span className="text-slate-400 font-mono block mb-1">MITRE ATT&CK Tactics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {incident.analysis.tactics.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary-light rounded font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Threat analysis has not been executed yet. Click "1. Analyze Threat" above.
              </p>
            )}
          </div>

          {/* Raw Evidence / Logs */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Terminal className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Log Evidence & Telemetry</h2>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto">
              {JSON.stringify(incident.evidence, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Column: Hindsight Memory & Adaptive Recommendations */}
        <div className="space-y-6">
          {/* Hindsight Memory Recall Card */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Hindsight Memory Recall</h2>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
                TEMPR Parallel Search
              </span>
            </div>

            {incident.recommendation?.recalled_experiences && incident.recommendation.recalled_experiences.length > 0 ? (
              <div className="space-y-3">
                {incident.recommendation.recalled_experiences.map((mem, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900/80 border border-purple-900/30 rounded-lg space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-purple-300 font-semibold">{mem.source_incident_id}</span>
                      <span className="px-2 py-0.5 bg-accent/20 text-accent border border-accent/30 rounded text-[10px] font-mono">
                        {(mem.similarity_score * 100).toFixed(0)}% Similarity
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{mem.title}</p>
                    {mem.past_root_cause && (
                      <div className="text-[11px] bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                        <span className="text-warning font-semibold block">Discovered Root Cause:</span>
                        {mem.past_root_cause}
                      </div>
                    )}
                    {mem.lesson_learned && (
                      <div className="text-[11px] text-slate-400">
                        <span className="text-primary-light font-semibold">Lesson Learned:</span> {mem.lesson_learned}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No past experiences recalled yet. Click "2. Recall & Recommend" to query Hindsight.
              </p>
            )}
          </div>

          {/* Adaptive Recommendation Card */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-white">Recommended Response Actions</h2>
            </div>

            {incident.recommendation ? (
              <div className="space-y-4 text-xs">
                <ol className="space-y-2">
                  {incident.recommendation.recommended_actions.map((act, i) => {
                    const isMemoryEnriched = act.includes('CRITICAL AUDIT') || act.includes('PREVENTION RUNBOOK');
                    return (
                      <li
                        key={i}
                        className={`p-2.5 rounded-lg border leading-relaxed ${
                          isMemoryEnriched
                            ? 'bg-amber-950/20 border-warning/40 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2 text-slate-400">{i + 1}.</span>
                        {act}
                      </li>
                    );
                  })}
                </ol>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] leading-relaxed">
                  <span className="font-semibold text-slate-300 block mb-0.5">Agent Rationale:</span>
                  {incident.recommendation.rationale}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No recommendation generated yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
