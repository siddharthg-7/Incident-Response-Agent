import React, { useState } from 'react';
import { Brain, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    what_happened: string;
    root_cause: string;
    what_was_done: string;
    what_worked: string;
    what_did_not_work: string;
    final_outcome: string;
    lessons_learned: string;
  }) => Promise<void>;
  incidentId: string;
  incidentTitle: string;
}

export const PostmortemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  incidentId,
  incidentTitle,
}) => {
  const [whatHappened, setWhatHappened] = useState(
    'High-volume dictionary brute-force attack from external IP targeted bastion port 22 with 437 attempts within 8 minutes.'
  );
  const [rootCause, setRootCause] = useState(
    'Recent automated package update reset sshd_config to defaults, re-enabling password authentication on internet-facing interface.'
  );
  const [whatWasDone, setWhatWasDone] = useState(
    'Blocked attacker IP at perimeter firewall, restricted port 22 access to VPN CIDR, and re-enforced PasswordAuthentication no.'
  );
  const [whatWorked, setWhatWorked] = useState(
    'Rapid IP containment stopped attack stream immediately. SSH configuration audit caught the drift before credentials could be guessed.'
  );
  const [whatDidNotWork, setWhatDidNotWork] = useState(
    'Configuration drift was not alerted prior to attack traffic hitting the server.'
  );
  const [finalOutcome, setFinalOutcome] = useState(
    'Contained successfully within 10 minutes. Zero unauthorized sessions established. Security compliance checks added to cron.'
  );
  const [lessonsLearned, setLessonsLearned] = useState(
    'Enforce automated Ansible compliance check on all perimeter servers every 15 minutes to guarantee PasswordAuthentication no is permanently set. Deploy fail2ban as an immediate perimeter circuit breaker.'
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        what_happened: whatHappened,
        root_cause: rootCause,
        what_was_done: whatWasDone,
        what_worked: whatWorked,
        what_did_not_work: whatDidNotWork,
        final_outcome: finalOutcome,
        lessons_learned: lessonsLearned,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-purple-900/50 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-purple-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-900/50 border border-purple-700/50">
              <Brain className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create Post-Mortem & Retain in Memory</h3>
              <p className="text-xs text-slate-400 font-mono">{incidentId} • {incidentTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">1. What Happened?</label>
            <textarea
              rows={2}
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">2. Discovered Root Cause</label>
            <textarea
              rows={2}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">3. What Was Done?</label>
            <textarea
              rows={2}
              value={whatWasDone}
              onChange={(e) => setWhatWasDone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-accent font-semibold mb-1">4. What Worked?</label>
              <textarea
                rows={2}
                value={whatWorked}
                onChange={(e) => setWhatWorked(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-warning font-semibold mb-1">5. What Did Not Work?</label>
              <textarea
                rows={2}
                value={whatDidNotWork}
                onChange={(e) => setWhatDidNotWork(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">6. Final Outcome</label>
            <input
              type="text"
              value={finalOutcome}
              onChange={(e) => setFinalOutcome(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-purple-300 font-semibold mb-1">7. Lessons Learned (Retained Experience for Future Incidents)</label>
            <textarea
              rows={3}
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              className="w-full bg-slate-900 border border-purple-800/60 rounded-lg p-2.5 text-purple-200 focus:outline-hidden focus:border-purple-500"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-[11px] text-purple-400 font-mono">
              Target Bank: sentinel-incident-memory
            </span>
            <div className="flex items-center gap-2">
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {submitting ? 'Retaining in Hindsight...' : 'Retain in Hindsight Memory'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
