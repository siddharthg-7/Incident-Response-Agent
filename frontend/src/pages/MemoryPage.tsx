import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const MemoryPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listIncidents()
      .then(setIncidents)
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const retainedCases = incidents.filter(i => i.resolution || i.postmortem);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Hindsight Memory Bank</h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Outcome-oriented experience capsules retained in bank <code className="text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded font-mono">sentinel-incident-memory</code>.
        </p>
      </div>

      {/* Biomimetic Network Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-purple-400 uppercase">Experiences Network</span>
          <div className="text-xl font-bold text-white">{retainedCases.length > 0 ? retainedCases.length : 1} Capsules</div>
          <p className="text-xs text-slate-400">Past investigations, containment actions & resolutions</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-primary-light uppercase">World Facts</span>
          <div className="text-xl font-bold text-white">4 Entities</div>
          <p className="text-xs text-slate-400">Target host baselines, IP reputational histories</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 space-y-1">
          <span className="text-xs font-mono text-accent uppercase">Mental Models (Opinions)</span>
          <div className="text-xl font-bold text-white">1 Consolidated Belief</div>
          <p className="text-xs text-slate-400">"SSHD config drift vulnerability on edge bastion hosts"</p>
        </div>
      </div>

      {/* Retained Experience Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Retained Incident Capsules</h2>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading memory bank...</div>
        ) : (
          <div className="space-y-4">
            {/* Show historical baseline INC-2026-001 experience */}
            <div className="bg-surface border border-purple-900/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-purple-400 font-bold">INC-2026-001</span>
                  <span className="text-sm font-medium text-white">High Volume SSH Authentication Failure on Bastion-01</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 border border-purple-800/40 font-mono">
                    HINDSIGHT RETAINED
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Bank: sentinel-incident-memory</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-warning block">Root Cause Discovered:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Routine OS package upgrade on bastion-prod-01 overwrote /etc/ssh/sshd_config with package maintainer defaults, inadvertently enabling password authentication.
                  </p>
                </div>
                <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-primary-light block">Lessons Learned & Future Runbook:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Enforce automated Ansible compliance check on all perimeter servers every 15 minutes to guarantee PasswordAuthentication no is permanently set. Deploy fail2ban as an immediate perimeter circuit breaker.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-4 pt-1">
                <span><strong>Outcome:</strong> Contained in 12 min. Zero unauthorized sessions established.</span>
                <span><strong>Resolution:</strong> Edge firewall drop + PasswordAuthentication disabled.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
