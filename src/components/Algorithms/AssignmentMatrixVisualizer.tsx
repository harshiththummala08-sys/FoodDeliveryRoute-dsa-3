import React from 'react';
import { useFleet } from '../../context/FleetContext';

export const AssignmentMatrixVisualizer: React.FC = () => {
  const { pipelineResult, riders } = useFleet();
  const assign = pipelineResult?.assignment;

  if (!assign) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to calculate the Hungarian cost matrix and optimal assignments.
      </div>
    );
  }

  const { riders: riderLabels, orders: orderLabels, matrix } = assign.costMatrix;
  
  // Set of assigned (riderIdx, orderIdx) pairs
  const assignedSet = new Set<string>();
  assign.assignments.forEach(a => {
    assignedSet.add(`${a.riderId}_${a.orderId}`);
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-amber-300 block text-[11px]">Minimum Assignment Cost</span>
          <span className="text-base font-black font-mono text-amber-400">
            {assign.totalAssignmentCost}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Optimal Assignments</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {assign.assignments.length} Pairs
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Matrix Dimensions</span>
          <span className="text-base font-bold font-mono text-slate-200">
            {riderLabels.length} Riders × {orderLabels.length} Orders
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Kuhn-Munkres Latency</span>
          <span className="text-base font-bold font-mono text-purple-400">
            {assign.executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Cost Matrix Table */}
      <div className="p-4 rounded-xl bg-[#080c14] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Normalized Cost Matrix [Distance (35%) + ETA (30%) + Workload (20%) + Traffic (15%)]
          </h4>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400 inline-block" />
            <span className="text-slate-300 font-semibold">Optimal Kuhn-Munkres Assignment</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 border border-white/10 bg-[#101625] text-left text-slate-400">
                  Rider \ Order
                </th>
                {orderLabels.map(oId => (
                  <th key={oId} className="p-2 border border-white/10 bg-[#101625] text-center text-cyan-300">
                    {oId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riderLabels.map((rId, rIdx) => {
                const riderObj = riders.find(r => r.id === rId);
                return (
                  <tr key={rId} className="hover:bg-white/[0.02]">
                    <td className="p-2 border border-white/10 font-bold bg-[#101625] text-slate-200 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: riderObj?.color || '#06b6d4' }}
                      />
                      <span>{rId} ({riderObj?.name.split(' ')[0]})</span>
                    </td>
                    {orderLabels.map((oId, oIdx) => {
                      const costVal = matrix[rIdx]?.[oIdx] ?? 99;
                      const isAssigned = assignedSet.has(`${rId}_${oId}`);

                      return (
                        <td
                          key={oId}
                          className={`p-2 border text-center transition-all ${
                            isAssigned
                              ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-black shadow-[inset_0_0_8px_rgba(245,158,11,0.3)]'
                              : 'border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {costVal >= 450 ? '∞' : costVal}
                          {isAssigned && <span className="block text-[8px] text-amber-400 font-sans font-bold">MATCH</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
