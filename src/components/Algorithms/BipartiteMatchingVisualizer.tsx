import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export const BipartiteMatchingVisualizer: React.FC = () => {
  const { pipelineResult, riders } = useFleet();
  const match = pipelineResult?.bipartiteMatching;

  if (!match) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to compute maximum bipartite matching.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Maximum Matching</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {match.maxMatching} Pairs
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Match Efficiency</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {match.maxMatching} / {match.totalPossible} ({Math.round((match.maxMatching / (match.totalPossible || 1)) * 100)}%)
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Unmatched Riders</span>
          <span className="text-base font-bold font-mono text-amber-300">
            {match.unmatchedRiders.length} idle
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Execution Latency</span>
          <span className="text-base font-bold font-mono text-purple-400">
            {match.executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Bipartite Graph Pairs Grid */}
      <div className="p-4 rounded-xl bg-[#080c14] border border-white/10">
        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-3">
          Augmenting-Path Matched Pairs (V1 Riders ↔ V2 Orders)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {match.matchedPairs.map((pair, idx) => {
            const riderObj = riders.find(r => r.id === pair.riderId);
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#111726] border border-emerald-500/30 shadow-sm"
              >
                {/* Left Rider Node */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-white text-xs shadow"
                    style={{ backgroundColor: riderObj?.color || '#06b6d4' }}
                  >
                    {pair.riderId}
                  </span>
                  <span className="text-slate-300 font-semibold">{riderObj?.name}</span>
                </div>

                {/* Connecting Edge Indicator */}
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                  <span>━━━━</span>
                  <span>▶</span>
                </div>

                {/* Right Order Node */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-mono font-bold">
                  <span>{pair.orderId}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Unmatched Notice if any */}
        {match.unmatchedOrders.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-slate-400 text-[11px]">
            <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Unmatched Orders in Queue due to fleet bandwidth: {match.unmatchedOrders.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
