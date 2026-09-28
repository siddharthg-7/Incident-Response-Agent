import React from 'react';
import { 
  ShieldAlert, 
  Brain, 
  History, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap
} from 'lucide-react';
import { Incident } from '../../types';

interface Props {
  incident: Incident;
  onNavigateSection?: (sectionId: string) => void;
}

export const InvestigationPipelineStepper: React.FC<Props> = ({ incident, onNavigateSection }) => {
  const primaryMatch = incident.recommendation?.recalled_experiences?.[0];
  const hasAnalysis = Boolean(incident.analysis);
  const hasRecall = Boolean(primaryMatch);
  const hasRecommendation = Boolean(incident.recommendation);
  const hasResolution = Boolean(incident.resolution);
  const hasPostmortem = Boolean(incident.postmortem);

  const steps = [
    {
      id: 'section-evidence',
      num: '1',
      title: 'Current Incident',
      status: hasAnalysis ? 'ANALYZED' : 'DETECTED',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/50',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      highlight: incident.id,
      detail: hasAnalysis ? 'AI analysis complete' : `${incident.severity} • ${incident.incident_type}`,
      isDone: true,
      isActive: true,
    },
    {
      id: 'section-memory',
      num: '2',
      title: 'Past Experience',
      status: hasRecall ? 'RECALLED' : 'QUERYING',
      icon: Brain,
      iconColor: 'text-purple-400',
      bgColor: hasRecall ? 'bg-purple-950/40 border-purple-800/50' : 'bg-slate-900/60 border-slate-800',
      badgeColor: hasRecall ? 'bg-purple-950/80 text-purple-300 border-purple-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      highlight: primaryMatch ? primaryMatch.source_incident_id : 'Hindsight',
      detail: primaryMatch 
        ? `${Math.round(primaryMatch.similarity_score * 100)}% Similarity Match` 
        : 'Vector memory bank lookup',
      isDone: hasRecall,
      isActive: hasRecall,
    },
    {
      id: 'section-comparison',
      num: '3',
      title: 'Previous Outcome',
      status: hasRecall ? 'EVALUATED' : 'WAITING',
      icon: History,
      iconColor: 'text-blue-400',
      bgColor: hasRecall ? 'bg-blue-950/40 border-blue-800/50' : 'bg-slate-900/60 border-slate-800',
      badgeColor: hasRecall ? 'bg-blue-950/80 text-blue-300 border-blue-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      highlight: primaryMatch ? 'Zero Breach' : 'N/A',
      detail: primaryMatch 
        ? (primaryMatch.past_outcome.length > 36 ? primaryMatch.past_outcome.slice(0, 36) + '...' : primaryMatch.past_outcome)
        : 'Awaiting recalled context',
      isDone: hasRecall,
      isActive: hasRecall,
    },
    {
      id: 'section-recommendation',
      num: '4',
      title: 'Recommendation',
      status: hasRecommendation ? 'SYNTHESIZED' : 'PENDING',
      icon: Sparkles,
      iconColor: 'text-emerald-400',
      bgColor: hasRecommendation ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-slate-900/60 border-slate-800',
      badgeColor: hasRecommendation ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      highlight: hasRecommendation ? `${(incident.recommendation?.confidence! * 100).toFixed(0)}% Conf.` : 'Pending',
      detail: hasRecommendation ? 'Memory-enriched runbook' : 'Synthesize from memory',
      isDone: hasRecommendation,
      isActive: hasRecommendation,
    },
    {
      id: 'section-resolution',
      num: '5',
      title: 'Analyst Action',
      status: hasResolution ? 'EXECUTED' : 'REQUIRED',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgColor: hasResolution ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-slate-900/60 border-slate-800',
      badgeColor: hasResolution ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      highlight: hasResolution ? 'Contained' : 'Human-in-Loop',
      detail: hasResolution ? `${incident.resolution?.actions_taken.length || 0} Actions Taken` : 'Approve & execute directives',
      isDone: hasResolution,
      isActive: hasResolution,
    },
    {
      id: 'section-learning',
      num: '6',
      title: 'New Learning',
      status: hasPostmortem ? 'RETAINED' : 'PENDING',
      icon: GraduationCap,
      iconColor: 'text-purple-400',
      bgColor: hasPostmortem ? 'bg-purple-950/40 border-purple-800/50' : 'bg-slate-900/60 border-slate-800',
      badgeColor: hasPostmortem ? 'bg-purple-950/80 text-purple-300 border-purple-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      highlight: hasPostmortem ? 'Bank Updated' : 'Post-Mortem',
      detail: hasPostmortem ? 'Retained into Hindsight bank' : 'Commit lessons learned',
      isDone: hasPostmortem,
      isActive: hasPostmortem,
    },
  ];

  const handleStepClick = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="bg-surface/90 backdrop-blur-md border border-border rounded-xl p-4 shadow-md space-y-3">
      {/* Title & Evaluator Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
            Sentinel Memory Investigation & Learning Journey
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>Click any stage to inspect forensic evidence</span>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${step.bgColor} cursor-pointer group`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                      {step.num}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${step.iconColor}`} />
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${step.badgeColor}`}>
                    {step.status}
                  </span>
                </div>

                <div className="font-semibold text-xs text-white group-hover:text-primary-light transition-colors">
                  {step.title}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 space-y-0.5">
                <div className="text-[11px] font-mono font-bold text-slate-200 truncate">
                  {step.highlight}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {step.detail}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
