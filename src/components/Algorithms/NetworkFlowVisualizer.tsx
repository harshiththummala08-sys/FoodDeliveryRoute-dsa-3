import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { ArrowRight, Layers, CheckCircle } from 'lucide-react';

export const NetworkFlowVisualizer: React.FC = () => {
  const { pipelineResult, riders, orders } = useFleet();
  const flow = pipelineResult?.networkFlow;

  if (!flow) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to compute real network flow augmenting paths.
      </div>
    );
  }

  // Filter top active feasible edges for visualization
  const activeFlowEdges = flow.flowEdges.filter(e => e.from !== 'SOURCE' && e.to !== 'SINK' && e.feasible).slice(0, 16);

  return (
    <div className="space-y-4 text-xs">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Rider Fleet Nodes</span>
          <span className="text-base font-bold font-mono text-cyan-300">{flow.riderCount} Riders</span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Demand Order Nodes</span>
          <span className="text-base font-bold font-mono text-indigo-300">{flow.orderCount} Orders</span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Feasible Edges (Radius ≤ 14km)</span>
          <span className="text-base font-bold font-mono text-amber-300">{flow.feasibleConnections} Edges</span>
        </div>
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
          <span className="text-cyan-300 block text-[11px]">Max Flow Value</span>
          <span className="text-base font-black font-mono text-emerald-400">{flow.maxFlow} Units</span>
        </div>
      </div>

      {/* Visual Network Flow Diagram */}
      <div className="p-4 rounded-xl bg-[#080c14] border border-white/10 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] text-center gap-4">
          {/* Source Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-mono font-bold text-xs">
              <span>SOURCE</span>
              <span className="text-[9px] text-cyan-400">Cap: {flow.maxFlow}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Depot</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* Riders Column */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              Rider Capacities
            </span>
            {riders.slice(0, 6).map(r => {
              const capEdge = flow.flowEdges.find(e => e.from === 'SOURCE' && e.to === r.id);
              return (
                <div
                  key={r.id}
                  className="px-2.5 py-1 rounded-lg border font-mono text-[11px] flex items-center justify-between gap-2 shadow-sm"
                  style={{
                    backgroundColor: '#101625',
                    borderColor: r.color,
                    color: r.color
                  }}
                >
                  <span className="font-bold">{r.id}</span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    flow: {capEdge?.flow || 0}/{capEdge?.capacity || r.capacity}
                  </span>
                </div>
              );
            })}
          </div>

          <ArrowRight className="w-5 h-5 text-cyan-500/60 shrink-0" />

          {/* Active Flow Edges Sample */}
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto px-2 border-x border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              Flow Assignments
            </span>
            {activeFlowEdges.map((e, idx) => (
              <div
                key={idx}
                className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center justify-between gap-2 ${
                  e.flow > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-black/30 text-slate-500'
                }`}
              >
                <span>{e.from} → {e.to}</span>
                <span>[{e.flow}/{e.capacity}]</span>
              </div>
            ))}
          </div>

          <ArrowRight className="w-5 h-5 text-indigo-500/60 shrink-0" />

          {/* Orders Column */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              Demand Nodes
            </span>
            {orders.slice(0, 6).map(o => (
              <div
                key={o.id}
                className="px-2.5 py-1 rounded-lg bg-[#101625] border border-indigo-500/40 text-indigo-300 font-mono text-[11px] flex items-center justify-between gap-2"
              >
                <span>{o.id}</span>
                <span className="text-[10px] text-slate-400">dem: 1</span>
              </div>
            ))}
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* Sink Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 flex flex-col items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] font-mono font-bold text-xs">
              <span>SINK</span>
              <span className="text-[9px] text-indigo-400">Total: {flow.maxFlow}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Fulfilled</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 italic">
        * Solved via Edmonds-Karp augmenting paths algorithm in {flow.executionTimeMs} ms. Identifies bottleneck limits before cost minimization.
      </div>
    </div>
  );
};
