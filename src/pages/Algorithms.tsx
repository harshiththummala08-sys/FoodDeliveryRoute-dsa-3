import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import {
  Network,
  GitMerge,
  Calculator,
  Route,
  Zap,
  Shuffle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { NetworkFlowVisualizer } from '../components/Algorithms/NetworkFlowVisualizer';
import { BipartiteMatchingVisualizer } from '../components/Algorithms/BipartiteMatchingVisualizer';
import { AssignmentMatrixVisualizer } from '../components/Algorithms/AssignmentMatrixVisualizer';
import { TSPVisualizer } from '../components/Algorithms/TSPVisualizer';
import { ApproximationVisualizer } from '../components/Algorithms/ApproximationVisualizer';
import { RandomizedVisualizer } from '../components/Algorithms/RandomizedVisualizer';
import { ETAPredictionVisualizer } from '../components/Algorithms/ETAPredictionVisualizer';

export const Algorithms: React.FC = () => {
  const { pipelineResult, riders, orders, optimizeFleet, isOptimizing } = useFleet();
  const [selectedAlgoId, setSelectedAlgoId] = useState<number | null>(null);

  const algorithms = [
    {
      id: 1,
      name: 'Network Flow',
      icon: Network,
      color: 'text-cyan-400',
      whatItDoes: 'Finds how many rider-order connections can be satisfied under geographic and capacity constraints.',
      input: `${riders.length} Riders, ${orders.length} Orders, Delivery Radius: 14 km`,
      output: 'Maximum feasible flow units from source depot to customer sink',
      currentResult: pipelineResult
        ? `${pipelineResult.networkFlow.feasibleConnections} connections, ${pipelineResult.networkFlow.maxFlow} units flow`
        : '6 feasible flow units (Initial)',
      complexity: 'O(V · E²)',
      component: <NetworkFlowVisualizer />
    },
    {
      id: 2,
      name: 'Bipartite Matching',
      icon: GitMerge,
      color: 'text-emerald-400',
      whatItDoes: 'Creates one-to-one rider-to-order matches without overlapping capacity.',
      input: `Bipartite graph: Riders (Left: ${riders.length}) ↔ Orders (Right: ${orders.length})`,
      output: 'Maximum cardinality matching pairs',
      currentResult: pipelineResult
        ? `${pipelineResult.bipartiteMatching.maxMatching} maximum matches found`
        : '6 / 6 Available matched',
      complexity: 'O(E · √V)',
      component: <BipartiteMatchingVisualizer />
    },
    {
      id: 3,
      name: 'Assignment Problem',
      icon: Calculator,
      color: 'text-amber-400',
      whatItDoes: 'Finds the lowest-cost combination of riders and orders using a multi-factor cost matrix.',
      input: `Cost matrix combining Distance (35%), ETA (30%), Workload (20%), Traffic (15%)`,
      output: 'Global minimum-cost rider allocation pairing',
      currentResult: pipelineResult
        ? `Minimum cost: ${pipelineResult.assignment.totalAssignmentCost} (${pipelineResult.assignment.assignments.length} assigned)`
        : 'Min cost: 23 units (Optimal)',
      complexity: 'O(N³)',
      component: <AssignmentMatrixVisualizer />
    },
    {
      id: 4,
      name: 'Travelling Salesman Problem (TSP)',
      icon: Route,
      color: 'text-purple-400',
      whatItDoes: 'Finds an efficient visit sequence for multi-stop food pickups and customer dropoffs.',
      input: 'Rider start coordinates, restaurant pickup, customer dropoffs',
      output: 'Optimal permutation sequence minimizing total road travel distance',
      currentResult: pipelineResult
        ? `${pipelineResult.summary.totalDistanceSavedKm} km distance saved across tours`
        : '3.9 km saved per tour',
      complexity: 'O(2ⁿ · n²) / O(k · n²)',
      component: <TSPVisualizer />
    },
    {
      id: 5,
      name: 'Approximation Algorithm',
      icon: Zap,
      color: 'text-rose-400',
      whatItDoes: 'Gets a near-optimal route much faster when the number of delivery stops becomes large.',
      input: 'Large delivery cluster (N=11 benchmark stops in Hyderabad)',
      output: '2-Approximation tour bounded within 2 × OPT of theoretical minimum',
      currentResult: pipelineResult
        ? `${pipelineResult.approximation.runtimeImprovementPercent}% faster compute (+${pipelineResult.approximation.distanceDifferencePercent}% distance diff)`
        : '92% speedup, +3.8% distance diff',
      complexity: 'O(n² log n)',
      component: <ApproximationVisualizer />
    },
    {
      id: 6,
      name: 'Randomized Algorithm',
      icon: Shuffle,
      color: 'text-indigo-400',
      whatItDoes: 'Explores many randomly generated route possibilities in parallel and keeps the best one.',
      input: '50 Stochastic Monte Carlo candidate permutations from actual stops',
      output: 'Best evaluated candidate route distance',
      currentResult: pipelineResult
        ? `Best route: ${pipelineResult.randomizedSearch.bestDistanceKm} km (50 candidates evaluated)`
        : '12.4 km best candidate found',
      complexity: 'O(K · n)',
      component: <RandomizedVisualizer />
    },
    {
      id: 7,
      name: 'ETA Prediction',
      icon: Clock,
      color: 'text-sky-400',
      whatItDoes: 'Estimates delivery arrival time using distance, EV speed, traffic delay, and preparation time.',
      input: 'Route distance (km), Speed (km/h), Traffic factor, Restaurant prep buffer',
      output: 'Predicted total arrival time in minutes',
      currentResult: pipelineResult
        ? `Average predicted ETA: ${pipelineResult.summary.averageEtaMin} min`
        : '18 min predicted delivery ETA',
      complexity: 'O(1) Kinematic Model',
      component: <ETAPredictionVisualizer />
    }
  ];

  const activeModalAlgo = algorithms.find(a => a.id === selectedAlgoId);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar select-none bg-[#070a0f]">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
            <span>ALGORITHM CENTER</span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              7 CORE ENGINES
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Combinatorial algorithms powering rider allocation, routing optimization, and delivery ETAs.
          </p>
        </div>

        <button
          onClick={optimizeFleet}
          disabled={isOptimizing}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-bold text-xs shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{isOptimizing ? 'RUNNING...' : 'EXECUTE ALL ALGORITHMS'}</span>
        </button>
      </div>

      {/* 7 Clean Algorithm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {algorithms.map(algo => {
          const Icon = algo.icon;

          return (
            <div
              key={algo.id}
              onClick={() => setSelectedAlgoId(algo.id)}
              className="p-5 rounded-2xl bg-[#0b101d]/90 border border-white/10 hover:border-cyan-500/40 hover:bg-[#101625] transition-all cursor-pointer shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-black/40 border border-white/5 ${algo.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5">
                    {algo.complexity}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white font-mono">
                    0{algo.id}. {algo.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                    {algo.whatItDoes}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] font-mono">
                <div className="text-slate-400 truncate">
                  <span className="text-slate-500">Input:</span> {algo.input}
                </div>
                <div className="text-slate-400 truncate">
                  <span className="text-slate-500">Output:</span> {algo.output}
                </div>
                <div className="text-cyan-300 font-bold truncate">
                  <span className="text-slate-500 font-normal">Result:</span> {algo.currentResult}
                </div>

                <div className="pt-2 text-[10px] text-cyan-400 font-bold font-sans flex items-center justify-between">
                  <span>Click to inspect visualization</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Visualizer Modal on Card Click */}
      {activeModalAlgo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#0c101a] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-black/40 ${activeModalAlgo.color}`}>
                  <activeModalAlgo.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-white">
                    0{activeModalAlgo.id}. {activeModalAlgo.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">{activeModalAlgo.whatItDoes}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlgoId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>{activeModalAlgo.component}</div>
          </div>
        </div>
      )}
    </div>
  );
};
