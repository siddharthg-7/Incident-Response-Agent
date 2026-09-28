import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { IncidentStatus } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: IncidentStatus; actions_taken: string[]; outcome: string; notes: string }) => Promise<void>;
  defaultActions?: string[];
  incidentId: string;
}

export const ResolutionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultActions = [],
  incidentId,
}) => {
  const [status, setStatus] = useState<IncidentStatus>('RESOLVED');
  const [outcome, setOutcome] = useState('Threat contained and verified. Zero credential breach observed.');
  const [notes, setNotes] = useState('Root cause addressed in coordination with infrastructure and security engineering.');
  const [actionsText, setActionsText] = useState(
    defaultActions.length > 0 
      ? defaultActions.join('\n')
      : 'Applied edge firewall DROP rule for attacker IP\nAudited sshd_config and enforced PasswordAuthentication no\nRestarted sshd service'
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const actions = actionsText.split('\n').map(s => s.trim()).filter(Boolean);
      await onSubmit({ status, actions_taken: actions, outcome, notes });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-white">Resolve Incident: {incidentId}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Incident Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-primary"
            >
              <option value="RESOLVED">RESOLVED (Threat Mitigated)</option>
              <option value="CLOSED">CLOSED (Confirmed Closed)</option>
              <option value="ACTION_REQUIRED">ACTION_REQUIRED (Follow-up Needed)</option>
              <option value="INVESTIGATING">INVESTIGATING (In Progress)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Actions Taken (one per line)</label>
            <textarea
              rows={3}
              value={actionsText}
              onChange={(e) => setActionsText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-[11px] focus:outline-hidden focus:border-primary"
              placeholder="List containment, eradication, and verification actions..."
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Recorded Outcome</label>
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Analyst Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Record Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
