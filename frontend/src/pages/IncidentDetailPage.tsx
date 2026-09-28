import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Brain, 
  CheckCircle2, 
  ArrowLeft, 
  Cpu, 
  Sparkles, 
  Terminal,
  ShieldAlert,
  Server,
  Globe,
  Clock,
  UserCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Incident, ActionStatus, IncidentStatus } from '../types';
import { LoadingState, ErrorState } from '../components/common';
import { MemoryMatchCard } from '../components/memory/MemoryMatchCard';
import { MemoryComparisonView } from '../components/memory/MemoryComparisonView';
import { HindsightExplanationCard } from '../components/memory/HindsightExplanationCard';
import { RecommendationSection } from '../components/recommendations/RecommendationSection';
import { InvestigationPipelineStepper } from '../components/incidents/InvestigationPipelineStepper';
import { ResolutionModal } from '../components/incidents/ResolutionModal';
import { PostmortemModal } from '../components/incidents/PostmortemModal';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Modals
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [isPostmortemOpen, setIsPostmortemOpen] = useState(false);

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

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // 1. Analyze Incident
  const handleAnalyze = async () => {
    if (!incident) return;
    setActionLoading(true);
    try {
      const updated = await api.analyzeIncident(incident.id);
      setIncident(updated);
      showNotification('AI Threat Analysis completed successfully.');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Recall Memory & Generate Recommendation
  const handleRecallAndRecommend = async () => {
    if (!incident) return;
    setActionLoading(true);
    try {
      const updated = await api.getRecommendation(incident.id);
      setIncident(updated);
      showNotification('Hindsight recalled relevant historical incident experience and synthesized recommendation.');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Update Action status (e.g. Approve or Execute)
  const handleUpdateAction = async (actionId: string, newStatus: ActionStatus) => {
    if (!incident) return;
    const updated = await api.updateActionStatus(incident.id, actionId, newStatus);
    setIncident(updated);
    showNotification(`Action ${actionId} marked as ${newStatus}.`);
  };

  // 4. Submit Resolution
  const handleResolutionSubmit = async (data: {
    status: IncidentStatus;
    actions_taken: string[];
    outcome: string;
    notes: string;
  }) => {
    if (!incident) return;
    const updated = await api.resolveIncident(incident.id, data);
    setIncident(updated);
    showNotification(`Incident ${incident.id} marked as ${data.status}.`);
  };

  // 5. Submit Post-Mortem & Retain
  const handlePostmortemSubmit = async (data: {
    what_happened: string;
    root_cause: string;
    what_was_done: string;
    what_worked: string;
    what_did_not_work: string;
    final_outcome: string;
    lessons_learned: string;
  }) => {
    if (!incident) return;
    const updated = await api.createPostmortem(incident.id, data);
    setIncident(updated);
    showNotification(`Post-Mortem completed. Experience retained in sentinel-incident-memory!`);
  };

  if (loading) {
    return <LoadingState message="Loading incident telemetry and memory context..." />;
  }

  if (!incident) {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <ErrorState
          title="Incident Record Not Found"
          message={`Incident "${id}" could not be retrieved from the active data store.`}
          onRetry={fetchIncident}
        />
        <div className="text-center mt-4">
          <Link to="/incidents" className="text-primary-light hover:underline text-xs inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to incident queue
          </Link>
        </div>
      </div>
    );
  }

  const primaryMemoryMatch = incident.recommendation?.recalled_experiences?.[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link to="/incidents" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Queue
        </Link>

        {feedbackMsg && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* SECTION A: INCIDENT HEADER */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/20 text-primary-light border border-primary/30 font-bold">
                {incident.id}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {incident.incident_type}
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold ${
                incident.severity === 'CRITICAL'
                  ? 'bg-danger/20 text-danger border border-danger/30'
                  : incident.severity === 'HIGH'
                  ? 'bg-amber-950/40 text-warning border border-warning/30'
                  : 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
              }`}>
                {incident.severity} SEVERITY
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                Status: {incident.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {incident.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-4xl">
              {incident.description}
            </p>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleAnalyze}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5 text-primary-light" />
              1. Analyze Threat
            </button>

            <button
              onClick={handleRecallAndRecommend}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
            >
              <Brain className="w-3.5 h-3.5" />
              2. Recall & Recommend
            </button>

            <button
              onClick={() => setIsResolutionOpen(true)}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              3. Resolve Incident
            </button>

            <button
              onClick={() => setIsPostmortemOpen(true)}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              4. Post-Mortem & Retain
            </button>
          </div>
        </div>

        {/* Telemetry Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-xs">
          <div>
            <span className="text-slate-400 font-mono block">Attacker Source IP:</span>
            <span className="text-slate-200 font-mono font-semibold mt-0.5 block flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              {incident.source || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block">Target Infrastructure:</span>
            <span className="text-slate-200 font-mono font-semibold mt-0.5 block flex items-center gap-1">
              <Server className="w-3 h-3 text-slate-400" />
              {incident.target || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block">Detection Timestamp:</span>
            <span className="text-slate-200 mt-0.5 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {new Date(incident.detected_at).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono block">Assigned SOC Analyst:</span>
            <span className="text-slate-200 font-mono mt-0.5 block flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-slate-400" />
              {incident.analyst_assigned || 'analyst_lead'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Investigation Pipeline Stepper (Phase 4 Evaluator Journey) */}
      <InvestigationPipelineStepper incident={incident} />

      {/* SECTION B & C: EVIDENCE & AI ANALYSIS */}
      <div id="section-evidence" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-20">
        {/* SECTION B: INCIDENT EVIDENCE */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Incident Evidence & Telemetry</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              Log Source: {incident.evidence.log_source || 'Syslog'}
            </span>
          </div>

          {/* Structured Evidence Items */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">Failed Attempts:</span>
              <span className="text-base font-bold text-danger font-mono mt-0.5 block">
                {incident.evidence.failed_attempts || 437}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">Time Window:</span>
              <span className="text-xs font-semibold text-slate-200 font-mono mt-0.5 block">
                {incident.evidence.time_window || '8 minutes'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">Authentication Method:</span>
              <span className="text-xs text-amber-300 font-mono mt-0.5 block">
                {incident.evidence.authentication_method || 'PasswordAuthentication'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">Geo / Autonomous System:</span>
              <span className="text-xs text-slate-300 font-mono mt-0.5 block truncate">
                {incident.evidence.geo_origin || 'External Cloud Provider'}
              </span>
            </div>
          </div>

          {/* Targeted Usernames / Indicators */}
          <div className="space-y-2 text-xs">
            <span className="text-slate-400 font-mono block">Extracted Indicators & Targeted Usernames:</span>
            <div className="flex flex-wrap gap-1.5">
              {incident.indicators?.map((ioc, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 rounded">
                  {ioc}
                </span>
              ))}
            </div>
          </div>

          {/* Collapsible/Raw Telemetry Block */}
          <div className="space-y-1 text-xs">
            <span className="text-slate-400 font-mono block">Raw Evidence Payload:</span>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-40">
              {JSON.stringify(incident.evidence, null, 2)}
            </pre>
          </div>
        </div>

        {/* SECTION C: AI THREAT ANALYSIS */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary-light" />
              <h2 className="text-sm font-semibold text-white">AI Threat Analysis</h2>
            </div>
            {incident.analysis && (
              <span className="text-[11px] font-mono font-semibold text-primary-light px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                {(incident.analysis.confidence * 100).toFixed(0)}% Confidence
              </span>
            )}
          </div>

          {incident.analysis ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Threat Classification:</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 font-mono font-semibold text-slate-200">
                  {incident.analysis.classification}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Investigation Summary:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {incident.analysis.investigation_summary}
                </p>
              </div>

              {incident.analysis.suspected_root_cause && (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-200">
                  <div className="flex items-center gap-1.5 font-semibold mb-1 text-warning">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Suspected Root Cause:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">{incident.analysis.suspected_root_cause}</p>
                </div>
              )}

              {/* Evidence Bullets */}
              {incident.analysis.evidence_summary && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block mb-1">Key Supporting Evidence:</span>
                  <ul className="space-y-1 text-slate-300">
                    {incident.analysis.evidence_summary.map((ev, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-primary-light font-bold font-mono">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tactics */}
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
            <div className="p-8 text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                Threat analysis has not been executed yet.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={actionLoading}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <Cpu className="w-3.5 h-3.5 text-primary-light" />
                Analyze Threat Telemetry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION D: HINDSIGHT MEMORY SECTION ("Relevant Past Incidents") */}
      <div id="section-memory" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-semibold text-white">Relevant Past Incidents (Hindsight Recall)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical experiences recalled from memory bank <code className="text-purple-300 font-mono text-[11px]">sentinel-incident-memory</code>.
            </p>
          </div>

          <button
            onClick={handleRecallAndRecommend}
            disabled={actionLoading}
            className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            Query Hindsight Memory
          </button>
        </div>

        {/* Hindsight Cognitive Reasoning Breakdown (Phase 4 Explanation) */}
        <HindsightExplanationCard match={primaryMemoryMatch} incident={incident} />

        {incident.recommendation?.recalled_experiences && incident.recommendation.recalled_experiences.length > 0 ? (
          <div className="space-y-4">
            {incident.recommendation.recalled_experiences.map((exp, idx) => (
              <MemoryMatchCard key={idx} match={exp} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface border border-border rounded-xl text-center space-y-3">
            <Brain className="w-8 h-8 text-purple-400/50 mx-auto" />
            <p className="text-xs text-slate-400">
              No previous incident experience recalled yet for this telemetry pattern.
            </p>
            <button
              onClick={handleRecallAndRecommend}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5" />
              Recall & Recommend
            </button>
          </div>
        )}
      </div>

      {/* SECTION E: MEMORY COMPARISON VIEW (Section 6) */}
      {primaryMemoryMatch && (
        <div id="section-comparison" className="scroll-mt-20">
          <MemoryComparisonView
            currentIncident={incident}
            matchedExperience={primaryMemoryMatch}
          />
        </div>
      )}

      {/* SECTION F & G: RESPONSE RECOMMENDATION & RESPONSE ACTIONS */}
      <div id="section-recommendation" className="scroll-mt-20">
        {incident.recommendation ? (
          <RecommendationSection
            recommendation={incident.recommendation}
            onUpdateActionStatus={handleUpdateAction}
          />
        ) : (
          <div className="p-8 bg-surface border border-border rounded-xl text-center space-y-3">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">
              No recommendation generated yet.
            </p>
            <button
              onClick={handleRecallAndRecommend}
              disabled={actionLoading}
              className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Synthesize Recommendation
            </button>
          </div>
        )}
      </div>

      {/* SECTION H & I: RESOLUTION & POST-MORTEM SUMMARY (WHEN COMPLETED) */}
      {(incident.resolution || incident.postmortem) && (
        <div id="section-resolution" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-20">
          {/* Resolution Card */}
          {incident.resolution && (
            <div className="bg-surface border border-emerald-900/40 rounded-xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Recorded Resolution Details</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  Resolved by: {incident.resolution.resolved_by}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Actions Executed:</span>
                <ul className="space-y-1 text-slate-300">
                  {incident.resolution.actions_taken.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-accent font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Final Outcome:</span>
                <p className="text-emerald-200/90 font-medium">{incident.resolution.outcome}</p>
              </div>
            </div>
          )}

          {/* Post-Mortem Card */}
          {incident.postmortem && (
            <div id="section-learning" className="bg-surface border border-purple-900/40 rounded-xl p-5 space-y-3 text-xs scroll-mt-20">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Retained Post-Mortem Capsule</span>
                </div>
                <span className="font-mono text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 font-bold">
                  HINDSIGHT RETAINED
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Discovered Root Cause:</span>
                <p className="text-slate-300">{incident.postmortem.root_cause}</p>
              </div>
              <div>
                <span className="text-purple-300 block font-semibold mb-0.5">Lessons Learned:</span>
                <p className="text-purple-200/90 leading-relaxed bg-purple-950/20 p-2.5 rounded border border-purple-900/30">
                  {incident.postmortem.lessons_learned}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <ResolutionModal
        isOpen={isResolutionOpen}
        onClose={() => setIsResolutionOpen(false)}
        onSubmit={handleResolutionSubmit}
        incidentId={incident.id}
        defaultActions={
          incident.recommendation?.recommended_actions || [
            'Applied edge firewall DROP rule for attacker IP',
            'Audited sshd_config and enforced PasswordAuthentication no',
            'Restarted sshd service'
          ]
        }
      />

      <PostmortemModal
        isOpen={isPostmortemOpen}
        onClose={() => setIsPostmortemOpen(false)}
        onSubmit={handlePostmortemSubmit}
        incidentId={incident.id}
        incidentTitle={incident.title}
      />
    </div>
  );
};

export default IncidentDetailPage;
