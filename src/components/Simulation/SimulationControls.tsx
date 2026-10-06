import React from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Car,
  Activity,
  Award
} from 'lucide-react';
import { TrafficLevel, OptimizationMode } from '../../types';

export const SimulationControls: React.FC = () => {
  const {
    orders,
    riders,
    trafficLevel,
    optimizationMode,
    simulationSpeed,
    isSimulating,
    isOptimizing,
    presentationMode,
    setTrafficLevel,
    setOptimizationMode,
    setSimulationSpeed,
    setPresentationMode,
    optimizeFleet,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    regenerateOrders,
    regenerateRiders
  } = useFleet();

  return (
    <div className="bg-[#0b101c]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl space-y-4 select-none">
      {/* Top Header & Presentation Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              DISPATCH SIMULATION CONTROLS
            </h3>
            <p className="text-[10px] text-slate-400">Parameter Configuration & Route Triggers</p>
          </div>
        </div>

        {/* Presentation Mode Button */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            presentationMode
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Presentation Mode for Professor"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{presentationMode ? 'PRESENTATION ON' : 'PRESENTATION MODE'}</span>
        </button>
      </div>

      {/* Control Parameters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Order Count Selector */}
        <div className="p-2.5 rounded-xl bg-[#101625] border border-white/5 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Order Count
          </span>
          <div className="grid grid-cols-3 gap-1">
            {[5, 10, 20].map(cnt => (
              <button
                key={cnt}
                onClick={() => regenerateOrders(cnt)}
                className={`py-1 rounded font-mono text-xs font-semibold transition-all ${
                  orders.length === cnt
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                    : 'bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Rider Fleet Size Selector */}
        <div className="p-2.5 rounded-xl bg-[#101625] border border-white/5 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Rider Count
          </span>
          <div className="grid grid-cols-3 gap-1">
            {[3, 5, 8].map(cnt => (
              <button
                key={cnt}
                onClick={() => regenerateRiders(cnt)}
                className={`py-1 rounded font-mono text-xs font-semibold transition-all ${
                  riders.length === cnt
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400'
                    : 'bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Traffic Level Selector */}
        <div className="p-2.5 rounded-xl bg-[#101625] border border-white/5 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span>Traffic Delay</span>
            <Car className="w-3 h-3 text-amber-400" />
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(['LOW', 'MEDIUM', 'HIGH'] as TrafficLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setTrafficLevel(lvl)}
                className={`py-1 rounded font-mono text-[10px] font-semibold transition-all ${
                  trafficLevel === lvl
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                    : 'bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Speed Selector */}
        <div className="p-2.5 rounded-xl bg-[#101625] border border-white/5 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span>Sim Speed</span>
            <Activity className="w-3 h-3 text-purple-400" />
          </span>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`py-1 rounded font-mono text-xs font-semibold transition-all ${
                  simulationSpeed === spd
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400'
                    : 'bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Optimize Fleet Button */}
        <button
          onClick={optimizeFleet}
          disabled={isOptimizing}
          className="flex-1 min-w-[170px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{isOptimizing ? 'OPTIMIZING PIPELINE...' : 'OPTIMIZE FLEET'}</span>
        </button>

        {/* Start / Pause Simulation */}
        {!isSimulating ? (
          <button
            onClick={startSimulation}
            className="flex-1 min-w-[150px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START SIMULATION</span>
          </button>
        ) : (
          <button
            onClick={pauseSimulation}
            className="flex-1 min-w-[150px] py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>PAUSE SIMULATION</span>
          </button>
        )}

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          className="py-2.5 px-4 rounded-xl bg-[#141b2c] hover:bg-[#1b243b] text-slate-300 hover:text-white border border-white/10 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          title="Reset Simulation State"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET</span>
        </button>
      </div>
    </div>
  );
};
