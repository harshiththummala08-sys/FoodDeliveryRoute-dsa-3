import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Zap, Radio, Award } from 'lucide-react';
import { NavigationPage } from './Sidebar';

interface HeaderProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onSelectPage }) => {
  const { isSimulating, presentationMode, setPresentationMode } = useFleet();

  const navItems = [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard' },
    { id: 'live' as NavigationPage, label: 'Live Optimization' },
    { id: 'algorithms' as NavigationPage, label: 'Algorithms' },
    { id: 'analytics' as NavigationPage, label: 'Analytics' }
  ];

  return (
    <header className="h-16 px-6 bg-[#080c14]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Zap className="w-5 h-5 fill-black" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono font-black text-base tracking-wider text-white">
              FLEET<span className="text-cyan-400">FLOW</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-sans tracking-tight">
            Food Delivery Route Optimization
          </p>
        </div>
      </div>

      {/* Top Center Navigation Tabs */}
      <nav className="flex items-center gap-1 p-1 rounded-xl bg-[#0e1422] border border-white/5">
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Telemetry & Presentation Mode */}
      <div className="flex items-center gap-3">
        {/* Simulation Live Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1422] border border-white/5 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
          />
          <span className={isSimulating ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isSimulating ? 'Simulation Live' : 'Simulation Idle'}
          </span>
        </div>

        {/* Presentation Mode Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            presentationMode
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Presentation Mode for Professor"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{presentationMode ? 'PRESENTATION ON' : 'PRESENTATION MODE'}</span>
        </button>
      </div>
    </header>
  );
};
