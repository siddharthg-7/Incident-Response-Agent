import React, { useEffect, useState } from 'react';
import { Shield, Brain, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { SystemHealth } from '../../types';

export const Navbar: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 border border-primary/40 rounded-lg text-primary-light">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">SENTINEL MEMORY</span>
            <span className="text-[10px] font-mono uppercase bg-primary/20 text-primary-light px-2 py-0.5 rounded border border-primary/30">
              Hindsight Core
            </span>
          </div>
          <p className="text-xs text-slate-400">Cybersecurity Incident Response Agent</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Memory status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-xs">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-slate-400 font-mono">Memory Bank:</span>
          <span className="text-slate-200 font-medium">sentinel-incident-memory</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Backend health pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-xs">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-slate-400 font-mono">API:</span>
          <span className={health?.status === 'healthy' ? 'text-accent font-medium' : 'text-warning font-medium'}>
            {health?.status || 'connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
};
