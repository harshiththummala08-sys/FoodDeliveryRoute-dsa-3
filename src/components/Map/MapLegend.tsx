import React, { useState } from 'react';
import { Bike, Utensils, Home, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-6 right-6 z-30 bg-[#0d121d]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-3 text-xs text-slate-300 w-64 select-none">
      <div
        className="flex items-center justify-between cursor-pointer font-semibold text-slate-200 pb-1 border-b border-white/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wider font-mono">Map Legend</span>
        </div>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2 text-[11px]">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-slate-900 border border-cyan-400/80 flex items-center justify-center text-cyan-400">
                <Bike className="w-3 h-3" />
              </div>
              <span>Rider (EV Bike)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-amber-950/80 border border-amber-500 flex items-center justify-center text-amber-400">
                <Utensils className="w-3 h-3" />
              </div>
              <span>Restaurant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-indigo-950/80 border border-indigo-500 flex items-center justify-center text-indigo-300">
                <Home className="w-3 h-3" />
              </div>
              <span>Customer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
              <span>Active Route</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Delayed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
