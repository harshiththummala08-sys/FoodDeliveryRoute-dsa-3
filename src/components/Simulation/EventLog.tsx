import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Terminal, Clock, Activity } from 'lucide-react';

export const EventLog: React.FC = () => {
  const { eventLogs } = useFleet();

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'ORDER':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
      case 'NETWORK':
        return 'text-blue-400 bg-blue-950/60 border-blue-500/30';
      case 'MATCH':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'ASSIGN':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'TSP':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/30';
      case 'DELIVERY':
        return 'text-green-400 bg-green-950/60 border-green-500/30';
      default:
        return 'text-slate-400 bg-slate-900 border-white/10';
    }
  };

  return (
    <div className="bg-[#0b101c]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl select-none flex flex-col h-full max-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              LIVE DISPATCH EVENT STREAM
            </h3>
            <p className="text-[10px] text-slate-400">Real-time algorithmic state telemetry</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          STREAMING
        </span>
      </div>

      {/* Events Scroll Area */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-2.5 custom-scrollbar pr-1">
        {eventLogs.map((evt) => (
          <div
            key={evt.id}
            className="p-2.5 rounded-xl bg-[#0f1524] border border-white/5 hover:border-white/15 transition-all text-xs space-y-1 font-mono"
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {evt.timestamp}
              </span>
              <span className={`px-1.5 py-0.2 rounded border uppercase font-bold text-[9px] ${getBadgeColor(evt.type)}`}>
                {evt.type}
              </span>
            </div>
            <div className="font-semibold text-slate-200 text-[11px]">
              {evt.title}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {evt.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
