import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { OrderCard } from './OrderCard';
import { ShoppingBag, Filter } from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderPanel: React.FC = () => {
  const { orders, selectedOrderId } = useFleet();
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');

  const filteredOrders = orders.filter(o => {
    if (filter === 'ALL') return true;
    return o.status === filter;
  });

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const activeCount = orders.filter(o => o.status === 'ASSIGNED' || o.status === 'DELIVERING' || o.status === 'PICKED_UP').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="flex flex-col h-full bg-[#0a0e17]/80 backdrop-blur-md border-r border-white/10 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">ORDERS QUEUE</h2>
              <p className="text-[11px] text-slate-400">{orders.length} total orders registered</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            {activeCount} active
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#101625] rounded-lg border border-white/5 text-[11px]">
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 py-1 rounded font-medium transition-all ${
              filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`flex-1 py-1 rounded font-medium transition-all ${
              filter === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('DELIVERED')}
            className={`flex-1 py-1 rounded font-medium transition-all ${
              filter === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>
      </div>

      {/* Orders Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 p-4">
            <Filter className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">No orders in this filter category.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
