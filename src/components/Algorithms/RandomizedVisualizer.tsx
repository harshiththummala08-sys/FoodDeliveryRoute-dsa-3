import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { Shuffle, CheckCircle2, Award, ArrowRight } from 'lucide-react';

export const RandomizedVisualizer: React.FC = () => {
  const { pipelineResult } = useFleet();
  const rand = pipelineResult?.randomizedSearch;
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  if (!rand) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to generate and evaluate Monte Carlo candidate routes.
      </div>
    );
  }

  // Identify winning candidate
  const winningCandidate = rand.candidateRoutes.find(c => c.distanceKm === rand.bestDistanceKm) || rand.candidateRoutes[0];
  const activeCandidate = selectedCandidateId
    ? rand.candidateRoutes.find(c => c.id === selectedCandidateId) || winningCandidate
    : winningCandidate;

  return (
    <div className="space-y-4 text-xs">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Candidates Evaluated</span>
          <span className="text-base font-bold font-mono text-indigo-300">
            {rand.candidatesEvaluated} Routes
          </span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-emerald-300 block text-[11px]">Best Discovered Route</span>
          <span className="text-base font-black font-mono text-emerald-400">
            {rand.bestDistanceKm} km
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Candidate Variance (Worst)</span>
          <span className="text-base font-bold font-mono text-rose-400">
            {rand.worstDistanceKm} km
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#101625] border border-white/5">
          <span className="text-slate-400 block text-[11px]">Average Evaluated</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {rand.averageDistanceKm} km
          </span>
        </div>
      </div>

      {/* Candidate Route Gallery */}
      <div className="p-4 rounded-xl bg-[#080c14] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            Evaluated Route Candidates Sample (Click to Inspect Sequence)
          </h4>
          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Best: #{winningCandidate.id} ({rand.bestDistanceKm} km)
          </span>
        </div>

        {/* Horizontal Scroll of Candidate Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
          {rand.candidateRoutes.slice(0, 20).map(c => {
            const isBest = c.distanceKm === rand.bestDistanceKm;
            const isSelected = activeCandidate.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`p-2 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                  isBest
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400 font-bold'
                    : isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-[#101625] border-white/5 text-slate-400 hover:text-white hover:bg-[#141c2e]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span>Candidate #{c.id}</span>
                  {isBest && <span className="text-[9px] text-emerald-400 uppercase font-black">★ BEST</span>}
                </div>
                <div className="text-sm font-black font-mono">
                  {c.distanceKm} km
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Candidate Sequence Inspector */}
      <div className="p-4 rounded-xl bg-[#0e1422] border border-indigo-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-indigo-300 font-bold text-[11px] uppercase tracking-wide">
            Detailed Waypoint Sequence for Candidate #{activeCandidate.id} ({activeCandidate.distanceKm} km)
          </span>
          {activeCandidate.id === winningCandidate.id && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              ★ Selected Optimal Sequence
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          {activeCandidate.sequence.map((stop, sIdx) => (
            <React.Fragment key={sIdx}>
              <span className="px-2 py-1 rounded bg-[#131b2e] border border-white/10 text-slate-200">
                {stop}
              </span>
              {sIdx < activeCandidate.sequence.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
