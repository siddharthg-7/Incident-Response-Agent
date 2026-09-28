import React, { useEffect, useState } from 'react';
import { Shield, Brain, Wifi, WifiOff } from 'lucide-react';
import { api } from '../../services/api';

export const Navbar: React.FC = () => {
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const isMock = api.isMockMode();

  useEffect(() => {
    api.getHealth()
      .then((h) => {
        setBackendConnected(h.database?.includes('connected') || h.status === 'healthy');
      })
      .catch(() => {
        setBackendConnected(false);
      });
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

      <div className="flex items-center gap-3">
        {/* Memory status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-slate-400 font-mono">Memory Bank:</span>
          <span className="text-purple-300 font-mono font-medium">sentinel-incident-memory</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Backend health status (Section 5) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          {isMock ? (
            <>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-slate-400 font-mono">Mode:</span>
              <span className="text-purple-300 font-medium font-mono">Mock API</span>
            </>
          ) : backendConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-accent" />
              <span className="text-slate-400 font-mono">FastAPI:</span>
              <span className="text-accent font-medium font-mono">Connected</span>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-warning" />
              <span className="text-slate-400 font-mono">FastAPI:</span>
              <span className="text-warning font-medium font-mono">Backend Unavailable</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
