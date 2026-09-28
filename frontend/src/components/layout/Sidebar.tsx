import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Brain, Sparkles, BookOpen } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incidents Queue', icon: AlertTriangle },
    { to: '/memory', label: 'Hindsight Memory', icon: Brain },
    { to: '/learning', label: 'Learning & Evolution', icon: Sparkles },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface/50 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3">
            Operations
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/15 text-primary-light border border-primary/30'
                        : 'text-slate-300 hover:text-white hover:bg-surfaceHover'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-primary-light font-medium mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture Note</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Sentinel Memory uses an experience-driven loop:
            <span className="block mt-1 font-mono text-slate-300 text-[10px]">
              Detect → Analyze → Recall → Recommend → Retain
            </span>
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 px-3 py-2 border-t border-slate-800">
        <p className="font-mono text-[10px]">Hackathon: AI Agents That Learn Using Hindsight</p>
        <p className="text-slate-400 text-[10px] mt-0.5">Lead Architect: Sentinel Team</p>
      </div>
    </aside>
  );
};
