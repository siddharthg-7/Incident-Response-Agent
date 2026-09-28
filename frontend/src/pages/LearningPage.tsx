import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';

export const LearningPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Agent Learning & Evolution</h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Demonstrating continuous agent improvement: How Hindsight memory prevents recurring incident mistakes.
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Without Memory Card */}
        <div className="bg-surface border border-red-900/40 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger" />
              <h2 className="text-base font-bold text-white">WITHOUT MEMORY (Standard RAG)</h2>
            </div>
            <span className="text-[10px] font-mono text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">
              Cold / Stateless
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              When SSH brute force attacks strike <code className="text-slate-300">app-prod-04</code>, a stateless agent only matches standard documentation:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-300 block">Agent Output:</span>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-slate-500">•</span>
                  <span>Apply perimeter firewall rule to block attacker IP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-500">•</span>
                  <span>Inspect auth logs for successful logins.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-red-200">
                <X className="w-4 h-4" />
                <span>Critical Vulnerability Missed:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                The agent has no memory of the past post-mortem where attackers exploited password auth enabled by OS updates. The analyst only blocks the IP, leaving password auth exposed for the next attacker to compromise.
              </p>
            </div>
          </div>
        </div>

        {/* With Memory Card */}
        <div className="bg-surface border border-emerald-900/40 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h2 className="text-base font-bold text-white">WITH HINDSIGHT MEMORY (Sentinel)</h2>
            </div>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              Adaptive Learning
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Sentinel recalls previous experience <code className="text-purple-300">INC-2026-001</code> (88% similarity) and injects the post-mortem lessons:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-900/30 space-y-2">
              <span className="font-semibold text-accent block">Enriched Agent Output:</span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Apply perimeter firewall rule to block attacker IP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span className="text-amber-200 font-medium">
                    CRITICAL AUDIT: Check sshd_config on app-prod-04 right now! In prior incident INC-2026-001, root cause was password authentication enabled by package upgrade.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-light">•</span>
                  <span>PREVENTION RUNBOOK: Apply automated Ansible compliance check from INC-2026-001.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                <Check className="w-4 h-4" />
                <span>Outcome-Oriented Protection:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                The agent actively prevents repeated mistakes, ensuring configuration drift is caught before attackers can breach the server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
