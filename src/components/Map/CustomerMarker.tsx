import React from 'react';
import { Customer, Order } from '../../types';
import { Home } from 'lucide-react';

interface CustomerMarkerProps {
  customer: Customer;
  order?: Order;
  onClick?: () => void;
}

export const CustomerMarker: React.FC<CustomerMarkerProps> = ({
  customer,
  order,
  onClick
}) => {
  const isDelivered = order?.status === 'DELIVERED';
  const isDelivering = order?.status === 'DELIVERING';

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-transform hover:scale-115 z-20"
      title={`${customer.name} - ${customer.address}`}
    >
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-xl border shadow-lg transition-all ${
          isDelivered
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
            : isDelivering
            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse'
            : 'bg-slate-900 border-indigo-500/60 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
      </div>

      {/* Mini Customer Identifier */}
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-950/80 border border-slate-700 text-[8px] font-mono text-slate-300 whitespace-nowrap shadow">
        {order ? order.id : customer.id.replace('CUST-', 'C')}
      </div>

      {/* Hover Info Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-950/95 border border-indigo-500/40 text-[11px] text-white whitespace-nowrap z-50 shadow-xl pointer-events-none">
        <span className="font-semibold text-slate-200">{customer.name}</span>
        {order && (
          <span className="text-cyan-400 font-mono text-[10px]">
            [{order.priority}] {order.status}
          </span>
        )}
      </div>
    </div>
  );
};
