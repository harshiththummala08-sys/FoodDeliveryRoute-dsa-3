import React from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Network,
  GitMerge,
  Calculator,
  Route,
  Zap,
  Shuffle,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';

export const AlgorithmFlowModal: React.FC = () => {
  const { isOptimizing, optimizingStep, optimizingStepInfo } = useFleet();

  if (!isOptimizing) return null;

  const steps = [
    { num: 1, name: 'NETWORK FLOW', icon: Network, desc: 'Finding feasible rider-order connections...' },
    { num: 2, name: 'BIPARTITE MATCHING', icon: GitMerge, desc: 'Finding rider-order matches...' },
    { num: 3, name: 'ASSIGNMENT PROBLEM', icon: Calculator, desc: 'Calculating minimum-cost allocation...' },
    { num: 4, name: 'TSP SEQUENCING', icon: Route, desc: 'Optimizing delivery sequence...' },
    { num: 5, name: 'APPROXIMATION', icon: Zap, desc: 'Checking whether a faster near-optimal route is useful...' },
    { num: 6, name: 'RANDOMIZED SEARCH', icon: Shuffle, desc: 'Testing candidate routes...' },
    { num: 7, name: 'ETA PREDICTION', icon: Clock, desc: 'Calculating delivery time...' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-[#0a0e19] border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm text-white tracking-wider">
                OPTIMIZING DELIVERY FLEET
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Executing 7 combinatorial dispatch algorithms in real-time
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
            STEP {optimizingStep} OF 7
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {steps.map(s => {
            const Icon = s.icon;
            const isDone = optimizingStep > s.num;
            const isCurrent = optimizingStep === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                    : isDone
                    ? 'bg-[#0f1422] border-emerald-500/30 text-slate-300'
                    : 'bg-black/30 border-white/5 text-slate-500 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      isCurrent
                        ? 'bg-cyan-400 text-black'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    0{s.num}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs tracking-wide">
                      {s.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isCurrent && optimizingStepInfo?.resultText
                        ? optimizingStepInfo.resultText
                        : s.desc}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${(optimizingStep / 7) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
