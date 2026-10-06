import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { RiderCard } from './RiderCard';
import { Bike, Users } from 'lucide-react';

export const RiderPanel: React.FC = () => {
  const { riders, selectedRiderId } = useFleet();

  const totalCapacity = riders.reduce((acc, r) => acc + r.capacity, 0);
  const activeLoad = riders.reduce((acc, r) => acc + r.currentOrders, 0);
  const availableRiders = riders.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="flex flex-col h-full bg-[#0a0e17]/80 backdrop-blur-md border-l border-white/10 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">FLEET ROSTER</h2>
              <p className="text-[11px] text-slate-400">{riders.length} active delivery riders</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
            {availableRiders} idle
          </span>
        </div>

        {/* Global Fleet Utilization Metric Bar */}
        <div className="p-2.5 rounded-xl bg-[#101625] border border-white/5 space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Total Fleet Capacity</span>
            <span className="font-mono text-cyan-300 font-semibold">
              {activeLoad} / {totalCapacity} ({Math.round((activeLoad / (totalCapacity || 1)) * 100)}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(100, (activeLoad / (totalCapacity || 1)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Riders Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {riders.map(rider => (
          <RiderCard
            key={rider.id}
            rider={rider}
            isSelected={selectedRiderId === rider.id}
          />
        ))}
      </div>
    </div>
  );
};
