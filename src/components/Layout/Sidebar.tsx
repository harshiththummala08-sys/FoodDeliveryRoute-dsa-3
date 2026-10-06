import React from 'react';
import { LayoutDashboard, Compass, Cpu, BarChart3, Radio, ShieldCheck, Zap } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { isMapboxConfigured } from '../../services/mapbox';

export type NavigationPage = 'dashboard' | 'live' | 'algorithms' | 'analytics';

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const { isSimulating, riders, orders } = useFleet();
  const mapboxReady = isMapboxConfigured();

  const navItems = [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live' as NavigationPage, label: 'Live Optimization', icon: Compass },
    { id: 'algorithms' as NavigationPage, label: 'Algorithm Center', icon: Cpu },
    { id: 'analytics' as NavigationPage, label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-[#080c14]/95 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between shrink-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Zap className="w-5 h-5 fill-black" />
          </div>
          <div>
            <h1 className="font-mono font-black text-lg tracking-wider text-white flex items-center gap-1">
              <span>FLEET</span>
              <span className="text-cyan-400">FLOW</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">LOGISTICS ENGINE</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry Status */}
      <div className="p-4 border-t border-white/10 space-y-2.5 bg-[#0a0f1b]/60 text-[11px] font-mono">
        {/* Simulation Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Simulation</span>
          </div>
          <span className={`font-bold ${isSimulating ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isSimulating ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        {/* Mapbox API Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className={`w-3.5 h-3.5 ${mapboxReady ? 'text-cyan-400' : 'text-amber-400'}`} />
            <span>Mapbox API</span>
          </div>
          <span className={`font-bold ${mapboxReady ? 'text-cyan-300' : 'text-amber-300'}`}>
            {mapboxReady ? 'CONNECTED' : 'LOCAL GEO'}
          </span>
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-1">
          {riders.length} Riders • {orders.length} Orders Loaded
        </div>
      </div>
    </aside>
  );
};
