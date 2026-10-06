import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { Network, GitMerge, Calculator, Route, Zap, Shuffle, Clock, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from 'lucide-react';
import { NetworkFlowVisualizer } from './NetworkFlowVisualizer';
import { BipartiteMatchingVisualizer } from './BipartiteMatchingVisualizer';
import { AssignmentMatrixVisualizer } from './AssignmentMatrixVisualizer';
import { TSPVisualizer } from './TSPVisualizer';
import { ApproximationVisualizer } from './ApproximationVisualizer';
import { RandomizedVisualizer } from './RandomizedVisualizer';
import { ETAPredictionVisualizer } from './ETAPredictionVisualizer';

export const AlgorithmPipeline: React.FC = () => {
  const { pipelineResult, isOptimizing, optimizingStep, riders, orders } = useFleet();
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const stages = [
    {
      step: 1,
      id: 'flow',
      name: 'Network Flow',
      icon: Network,
      purpose: 'Find feasible rider-order connections & max capacity.',
      input: `${riders.length} riders, ${orders.length} orders`,
      output: pipelineResult
        ? `${pipelineResult.networkFlow.feasibleConnections} connections (${pipelineResult.networkFlow.maxFlow} units)`
        : 'Awaiting Run',
      time: pipelineResult ? `${pipelineResult.networkFlow.executionTimeMs} ms` : '--',
      activeColor: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/20'
    },
    {
      step: 2,
      id: 'matching',
      name: 'Bipartite Matching',
      icon: GitMerge,
      purpose: 'One-to-one maximum cardinality rider matches.',
      input: `Bipartite graph (V1: ${riders.length}, V2: ${orders.length})`,
      output: pipelineResult
        ? `${pipelineResult.bipartiteMatching.maxMatching} matched pairs`
        : 'Awaiting Run',
      time: pipelineResult ? `${pipelineResult.bipartiteMatching.executionTimeMs} ms` : '--',
      activeColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20'
    },
    {
      step: 3,
      id: 'assignment',
      name: 'Hungarian Assignment',
      icon: Calculator,
      purpose: 'Min-cost allocation via Kuhn-Munkres cost matrix.',
      input: `Cost matrix (${riders.length}x${orders.length})`,
      output: pipelineResult
        ? `Min Cost: ${pipelineResult.assignment.totalAssignmentCost} (${pipelineResult.assignment.assignments.length} assigned)`
        : 'Awaiting Run',
      time: pipelineResult ? `${pipelineResult.assignment.executionTimeMs} ms` : '--',
      activeColor: 'text-amber-400 border-amber-500/50 bg-amber-950/20'
    },
    {
      step: 4,
      id: 'tsp',
      name: 'TSP Sequencing',
      icon: Route,
      purpose: 'Optimize multi-stop waypoint delivery sequences.',
      input: 'Active stops & delivery precedence',
      output: pipelineResult
        ? `${pipelineResult.summary.totalDistanceSavedKm} km saved (${pipelineResult.tsp.length} tours)`
        : 'Awaiting Run',
      time: pipelineResult
        ? `${pipelineResult.tsp[0]?.executionTimeMs || 1.2} ms`
        : '--',
      activeColor: 'text-purple-400 border-purple-500/50 bg-purple-950/20'
    },
    {
      step: 5,
      id: 'approx',
      name: 'Approximation',
      icon: Zap,
      purpose: 'MST 2-approximation for fast large N scaling.',
      input: 'Hyderabad benchmark stops (N=11)',
      output: pipelineResult
        ? `${pipelineResult.approximation.runtimeImprovementPercent}% faster (+${pipelineResult.approximation.distanceDifferencePercent}% diff)`
        : 'Awaiting Run',
      time: pipelineResult ? `${pipelineResult.approximation.approxRuntimeMs} ms` : '--',
      activeColor: 'text-rose-400 border-rose-500/50 bg-rose-950/20'
    },
    {
      step: 6,
      id: 'random',
      name: 'Randomized Search',
      icon: Shuffle,
      purpose: 'Monte Carlo stochastic tour candidate sampling.',
      input: '50 candidate sequence evaluations',
      output: pipelineResult
        ? `Best route: ${pipelineResult.randomizedSearch.bestDistanceKm} km`
        : 'Awaiting Run',
      time: pipelineResult ? `${pipelineResult.randomizedSearch.executionTimeMs} ms` : '--',
      activeColor: 'text-indigo-400 border-indigo-500/50 bg-indigo-950/20'
    },
    {
      step: 7,
      id: 'eta',
      name: 'ETA Prediction',
      icon: Clock,
      purpose: 'Calculates delivery times with speed, prep & traffic.',
      input: 'Distance, traffic delay, prep wait',
      output: pipelineResult
        ? `Avg ETA: ${pipelineResult.summary.averageEtaMin} min`
        : 'Awaiting Run',
      time: pipelineResult ? '0.4 ms' : '--',
      activeColor: 'text-sky-400 border-sky-500/50 bg-sky-950/20'
    }
  ];

  const toggleTab = (step: number) => {
    setActiveTab(prev => (prev === step ? null : step));
  };

  return (
    <div className="flex flex-col bg-[#0a0e17]/90 backdrop-blur-md border-t border-white/10 select-none">
      {/* Header bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-slate-200">
            ALGORITHM PIPELINE EXECUTION ENGINE
          </span>
          {isOptimizing && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing Step {optimizingStep} / 7
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {pipelineResult ? `Last optimized: ${pipelineResult.timestamp}` : 'Ready for execution'}
        </div>
      </div>

      {/* 7 Pipeline Stage Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-3">
        {stages.map(st => {
          const Icon = st.icon;
          const isCurrentlyRunning = isOptimizing && optimizingStep === st.step;
          const isDone = pipelineResult !== null && (!isOptimizing || optimizingStep > st.step);
          const isSelected = activeTab === st.step;

          return (
            <div
              key={st.id}
              onClick={() => toggleTab(st.step)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? `${st.activeColor} ring-1 ring-white/20 shadow-lg`
                  : isCurrentlyRunning
                  ? 'bg-cyan-500/20 border-cyan-400 animate-pulse'
                  : isDone
                  ? 'bg-[#101625] border-white/10 hover:border-white/20 hover:bg-[#141b2c]'
                  : 'bg-[#0c101b] border-white/5 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-mono font-bold text-[11px] text-slate-200 truncate">
                    0{st.step} {st.name}
                  </span>
                </div>
                {isCurrentlyRunning ? (
                  <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                )}
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-1 mb-1" title={st.purpose}>
                {st.purpose}
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5 font-mono">
                <span className="text-cyan-300 truncate max-w-[85px]">{st.output}</span>
                <span className="text-slate-400 text-[9px]">{st.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Interactive Algorithm Inspector Drawer */}
      {activeTab !== null && (
        <div className="p-4 border-t border-white/10 bg-[#0d121f] transition-all">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Stage 0{activeTab}: {stages[activeTab - 1].name} Visual Inspector</span>
            </h3>
            <button
              onClick={() => setActiveTab(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
            >
              Close Inspector ✕
            </button>
          </div>

          <div className="min-h-[220px]">
            {activeTab === 1 && <NetworkFlowVisualizer />}
            {activeTab === 2 && <BipartiteMatchingVisualizer />}
            {activeTab === 3 && <AssignmentMatrixVisualizer />}
            {activeTab === 4 && <TSPVisualizer />}
            {activeTab === 5 && <ApproximationVisualizer />}
            {activeTab === 6 && <RandomizedVisualizer />}
            {activeTab === 7 && <ETAPredictionVisualizer />}
          </div>
        </div>
      )}
    </div>
  );
};
