import React from 'react';
import { Rider } from '../../types';
import { useFleet } from '../../context/FleetContext';
import { Bike, Zap, Package, Gauge, CheckCircle2 } from 'lucide-react';

interface RiderCardProps {
  rider: Rider;
  isSelected?: boolean;
}

export const RiderCard: React.FC<RiderCardProps> = ({ rider, isSelected = false }) => {
  const { setSelectedRiderId, orders } = useFleet();

  const getStatusBadge = () => {
    switch (rider.status) {
      case 'AVAILABLE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AVAILABLE
          </span>
        );
      case 'GOING_TO_RESTAURANT':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            TO RESTAURANT
          </span>
        );
      case 'PICKING_UP':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            PICKING UP
          </span>
        );
      case 'DELIVERING':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            DELIVERING
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            DELIVERED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/40 text-slate-400">
            {rider.status}
          </span>
        );
    }
  };

  const assignedOrders = orders.filter(o => rider.assignedOrderIds.includes(o.id));
  const capacityPercent = Math.min(100, Math.round((rider.currentOrders / rider.capacity) * 100));

  return (
    <div
      onClick={() => setSelectedRiderId(rider.id)}
      className={`relative p-3.5 rounded-xl cursor-pointer transition-all border ${
        isSelected
          ? 'bg-[#151c2c] border-white/40 shadow-xl'
          : 'bg-[#0f1422]/90 border-white/5 hover:border-white/15 hover:bg-[#131a29]'
      }`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: rider.color
      }}
    >
      {/* Top Row: Rider ID + Name, Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-[11px] font-black font-mono text-white shadow-sm"
            style={{ backgroundColor: rider.color }}
          >
            {rider.id}
          </span>
          <span className="font-semibold text-white text-xs">{rider.name}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Vehicle and Rating */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
        <div className="flex items-center gap-1">
          <Bike className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{rider.vehicle}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 font-mono">
          <span>★</span>
          <span>{rider.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Capacity Load Bar */}
      <div className="space-y-1 mb-2.5">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3 text-slate-400" />
            Current Orders
          </span>
          <span className="font-mono text-slate-200">
            {rider.currentOrders} / {rider.capacity}
          </span>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${capacityPercent}%`,
              backgroundColor: rider.color
            }}
          />
        </div>
      </div>

      {/* Footer Metrics: Speed / ETA & Efficiency */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>Speed: <strong className="text-slate-200">{rider.speedKmh} km/h</strong></span>
        </div>
        <div className="flex items-center justify-end gap-1 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Score: <strong className="text-emerald-300">{rider.efficiencyScore}%</strong></span>
        </div>
      </div>

      {/* Active Assigned Orders Chips */}
      {assignedOrders.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1">
          <span className="text-[10px] text-slate-400 mr-1 self-center">Routes:</span>
          {assignedOrders.map(o => (
            <span
              key={o.id}
              className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-cyan-300"
            >
              {o.id} ({o.status})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
