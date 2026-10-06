import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Check, HelpCircle, Award, Navigation, Clock, Package, Gauge, Sparkles } from 'lucide-react';

interface WhyRiderCardProps {
  orderId?: string;
  className?: string;
}

export const WhyRiderCard: React.FC<WhyRiderCardProps> = ({ orderId, className = '' }) => {
  const { orders, riders, selectedOrderId } = useFleet();

  const targetOrderId = orderId || selectedOrderId || 'O104';
  const order = orders.find(o => o.id === targetOrderId) || orders[0];

  if (!order) return null;

  const assignedRider = riders.find(r => r.id === order.assignedRiderId);
  const breakdown = order.scoreBreakdown;
  const competingScores = order.competingScores || [];

  return (
    <div
      className={`p-4 rounded-2xl bg-[#0b101c]/95 backdrop-blur-md border border-cyan-500/40 shadow-xl space-y-4 text-xs select-none ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-white text-xs shadow-md"
            style={{ backgroundColor: assignedRider?.color || '#3b82f6' }}
          >
            {order.assignedRiderId || 'R?'}
          </div>
          <div>
            <h3 className="font-mono font-black text-sm text-white tracking-wide">
              WHY WAS {order.assignedRiderId || 'RIDER'} ASSIGNED?
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Order: <strong className="text-white font-mono">{order.id}</strong> • {order.restaurantName}
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
          Hungarian Min-Cost
        </span>
      </div>

      {/* Target Order Summary */}
      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Customer:</span>
          <span className="font-semibold text-slate-200">{order.customerName}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Decision Rationale:</span>
          <span className="text-cyan-300 font-medium">Lowest overall multi-factor assignment cost</span>
        </div>
      </div>

      {/* Constraint Checklist */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#101524] border border-white/5">
          <div className="flex items-center gap-2 text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Distance to Pickup</span>
          </div>
          <span className="font-mono text-white font-bold flex items-center gap-1">
            {breakdown ? `${breakdown.distanceKm.toFixed(1)} km` : `${order.distanceKm.toFixed(1)} km`}
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#101524] border border-white/5">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Predicted ETA</span>
          </div>
          <span className="font-mono text-white font-bold flex items-center gap-1">
            {order.etaMinutes ? `${order.etaMinutes} min` : '18 min'}
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#101524] border border-white/5">
          <div className="flex items-center gap-2 text-slate-300">
            <Package className="w-3.5 h-3.5 text-purple-400" />
            <span>Current Workload</span>
          </div>
          <span className="font-mono text-white font-bold flex items-center gap-1">
            {assignedRider ? `${assignedRider.currentOrders}/${assignedRider.capacity}` : '1/2'}
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#101524] border border-white/5">
          <div className="flex items-center gap-2 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span>Traffic Condition</span>
          </div>
          <span className="font-mono text-white font-bold flex items-center gap-1">
            {breakdown ? breakdown.trafficLevel : 'Moderate'}
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>
      </div>

      {/* Assignment Score Comparison Table */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
          <span>ASSIGNMENT SCORE COMPARISON</span>
          <span className="text-[10px] text-slate-400 font-sans font-normal">Score (0-100)</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 font-mono">
          {competingScores.length > 0 ? (
            competingScores.slice(0, 4).map(cs => {
              const isSelected = cs.riderId === order.assignedRiderId;
              const r = riders.find(item => item.id === cs.riderId);
              return (
                <div
                  key={cs.riderId}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400 shadow-sm'
                      : 'bg-black/30 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r?.color || '#fff' }} />
                    <span className="font-bold">{cs.riderId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-sm">{cs.finalScore}</span>
                    {isSelected && <span className="text-[10px] text-cyan-300 font-sans font-bold">★ SELECTED</span>}
                  </div>
                </div>
              );
            })
          ) : (
            // Default baseline presentation scores if optimization not yet triggered
            [
              { id: 'R1', score: 74, selected: false },
              { id: 'R2', score: 91, selected: true },
              { id: 'R3', score: 82, selected: false },
              { id: 'R4', score: 68, selected: false }
            ].map(item => (
              <div
                key={item.id}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                  item.selected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                    : 'bg-black/30 border-white/5 text-slate-400'
                }`}
              >
                <span className="font-bold">{item.id}</span>
                <span className="font-black text-sm">
                  {item.score} {item.selected ? '← SELECTED' : ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Algorithm Footnote */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Algorithm: Kuhn-Munkres Assignment</span>
        <span className="text-cyan-400">O(N³) Complexity</span>
      </div>
    </div>
  );
};
