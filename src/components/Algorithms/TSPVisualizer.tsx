import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { Route, ArrowRight, CheckCircle2, TrendingDown, Layers } from 'lucide-react';

export const TSPVisualizer: React.FC = () => {
  const { pipelineResult, riders } = useFleet();
  const tspList = pipelineResult?.tsp || [];
  const [selectedRiderIdx, setSelectedRiderIdx] = useState(0);

  if (tspList.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to calculate TSP multi-stop waypoint optimization.
      </div>
    );
  }

  const activeTSP = tspList[selectedRiderIdx] || tspList[0];
  const riderObj = riders.find(r => r.id === activeTSP.riderId);

  return (
    <div className="space-y-4 text-xs">
      {/* Rider Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-slate-400 text-[11px] shrink-0">Rider Tours:</span>
        {tspList.map((t, idx) => {
          const r = riders.find(item => item.id === t.riderId);
          return (
            <button
              key={t.riderId}
              onClick={() => setSelectedRiderIdx(idx)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                selectedRiderIdx === idx
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                  : 'bg-[#101625] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r?.color || '#fff' }} />
              <span>{t.riderId}</span>
              <span className="text-[10px] text-purple-400">(-{t.distanceSavedKm}km)</span>
            </button>
          );
        })}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Original Sequence Distance</span>
          <span className="text-base font-bold font-mono text-rose-400 line-through">
            {activeTSP.originalDistanceKm} km
          </span>
        </div>
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40">
          <span className="text-purple-300 block text-[11px]">Optimized Tour Distance</span>
          <span className="text-base font-black font-mono text-emerald-400">
            {activeTSP.optimizedDistanceKm} km
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Road Distance Saved</span>
          <span className="text-base font-bold font-mono text-cyan-300 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            {activeTSP.distanceSavedKm} km ({activeTSP.improvementPercent}%)
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Solver Duration</span>
          <span className="text-base font-bold font-mono text-slate-200">
            {activeTSP.executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Sequence Comparison: BEFORE vs AFTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BEFORE Sequence */}
        <div className="p-4 rounded-xl bg-[#080c14] border border-rose-500/20">
          <div className="flex items-center justify-between mb-3 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
            <span>BEFORE (Default Arrival Order)</span>
            <span className="font-mono">{activeTSP.originalDistanceKm} km</span>
          </div>

          <div className="space-y-2">
            {activeTSP.originalSequence.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#111622] border border-white/5 font-mono text-slate-300 text-[11px]"
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                  {idx + 1}
                </span>
                <span className="truncate">{stop}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER Sequence */}
        <div className="p-4 rounded-xl bg-[#080c14] border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            <span>AFTER (Optimal TSP Sequence)</span>
            <span className="font-mono text-emerald-300">{activeTSP.optimizedDistanceKm} km</span>
          </div>

          <div className="space-y-2">
            {activeTSP.optimizedSequence.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 font-mono text-emerald-200 text-[11px]"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold border border-emerald-500/40">
                  {idx + 1}
                </span>
                <span className="truncate font-semibold">{stop}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
