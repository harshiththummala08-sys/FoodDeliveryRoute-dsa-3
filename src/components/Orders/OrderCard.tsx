import React from 'react';
import { Order } from '../../types';
import { useFleet } from '../../context/FleetContext';
import { Clock, Navigation, HelpCircle, Utensils, Home } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  isSelected?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, isSelected = false }) => {
  const { setSelectedOrderId, setWhyRiderModalOrder, riders } = useFleet();
  const assignedRider = riders.find(r => r.id === order.assignedRiderId);

  const getPriorityBadge = () => {
    switch (order.priority) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">LOW</span>;
    }
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Delivered</span>;
      case 'DELIVERING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">Delivering</span>;
      case 'PICKED_UP':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">Picked Up</span>;
      case 'PREPARING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Preparing</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">Assigned</span>;
      case 'PENDING':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/40 text-slate-400 border border-slate-600/30">Pending</span>;
    }
  };

  return (
    <div
      onClick={() => setSelectedOrderId(order.id)}
      className={`relative p-3 rounded-xl cursor-pointer transition-all border ${
        isSelected
          ? 'bg-[#161d2d] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
          : 'bg-[#0f1422]/90 border-white/5 hover:border-white/15 hover:bg-[#141b2b]'
      }`}
    >
      {/* Top Row: Order ID, Priority, Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-white text-sm">{order.id}</span>
          {getPriorityBadge()}
        </div>
        {getStatusBadge()}
      </div>

      {/* Restaurant and Customer */}
      <div className="space-y-1 text-xs mb-2.5">
        <div className="flex items-center gap-1.5 text-slate-300 truncate">
          <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{order.restaurantName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <Home className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{order.customerName}</span>
        </div>
      </div>

      {/* Bottom Info Grid: Distance, Rider, ETA */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>{order.distanceKm.toFixed(1)} km</span>
        </div>

        {order.etaMinutes !== undefined && (
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="font-mono">{order.etaMinutes} min</span>
          </div>
        )}

        {assignedRider ? (
          <div className="flex items-center gap-1.5">
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1"
              style={{ backgroundColor: assignedRider.color }}
            >
              {assignedRider.id}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWhyRiderModalOrder(order);
              }}
              className="p-1 rounded hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Why was this rider assigned?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-slate-500 text-[10px] italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};
