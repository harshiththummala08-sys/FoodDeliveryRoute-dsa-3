import React from 'react';
import { useFleet } from '../context/FleetContext';
import { MapView } from '../components/Map/MapView';
import { WhyRiderCard } from '../components/Explanation/WhyRiderCard';
import { AlgorithmFlowModal } from '../components/Algorithms/AlgorithmFlowModal';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Bike,
  ShoppingBag,
  Clock,
  TrendingDown,
  Gauge
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    riders,
    orders,
    restaurants,
    pipelineResult,
    isSimulating,
    isOptimizing,
    simulationSpeed,
    setSimulationSpeed,
    startSimulation,
    pauseSimulation,
    optimizeFleet,
    resetSimulation,
    selectedOrderId,
    setSelectedOrderId
  } = useFleet();

  const activeRidersCount = riders.filter(r => r.status !== 'AVAILABLE').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const distSaved = pipelineResult?.summary.totalDistanceSavedKm ?? 8.4;
  const avgEta = pipelineResult?.summary.averageEtaMin ?? 21;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[#070a0f] select-none">
      {/* 4.5-Second Visual Optimization Sequence Modal */}
      <AlgorithmFlowModal />

      {/* LEFT COLUMN: HERO CONTROLS & ASSIGNMENT EXPLANATION (~440px) */}
      <div className="w-full lg:w-[450px] xl:w-[480px] h-full overflow-y-auto p-5 border-r border-white/10 flex flex-col justify-between custom-scrollbar bg-[#080c14]/90 backdrop-blur-md space-y-5 shrink-0 z-10">
        <div className="space-y-4">
          {/* Main Hero Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl xl:text-3xl font-black font-mono tracking-tight text-white leading-tight">
              INTELLIGENT<br />
              <span className="text-cyan-400">DELIVERY OPTIMIZATION</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Automatically assign the best rider, optimize delivery routes and predict ETA.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={optimizeFleet}
              disabled={isOptimizing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{isOptimizing ? 'RUNNING ALGORITHMS...' : 'OPTIMIZE DELIVERY'}</span>
            </button>

            <div className="flex items-center gap-2">
              {!isSimulating ? (
                <button
                  onClick={startSimulation}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>START SIMULATION</span>
                </button>
              ) : (
                <button
                  onClick={pauseSimulation}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>PAUSE SIMULATION</span>
                </button>
              )}

              <button
                onClick={resetSimulation}
                className="py-2.5 px-3 rounded-xl bg-[#141b2b] hover:bg-[#1c263c] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                title="Reset Fleet"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </div>
          </div>

          {/* Quick Fleet Counts */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 py-1.5 px-3 rounded-xl bg-black/40 border border-white/5">
            <span><strong className="text-white">{riders.length}</strong> Riders</span>
            <span>•</span>
            <span><strong className="text-white">{orders.length}</strong> Orders</span>
            <span>•</span>
            <span><strong className="text-white">{restaurants.length}</strong> Restaurants</span>
          </div>

          {/* Simulation Speed Control: 0.5x | 1x | 2x */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f1422] border border-white/5 text-xs">
            <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              BIKE SPEED:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs">
              {[0.5, 1, 2].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    simulationSpeed === spd
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-sm'
                      : 'bg-black/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Main 4 Core KPI Tiles */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/5 space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono font-bold">
                <span>ACTIVE RIDERS</span>
                <Bike className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {activeRidersCount || riders.length}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/5 space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono font-bold">
                <span>PENDING ORDERS</span>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {pendingOrdersCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/5 space-y-0.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono font-bold">
                <span>AVG ETA</span>
                <Clock className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">
                {avgEta} min
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0f1422] border border-emerald-500/20 space-y-0.5">
              <div className="flex items-center justify-between text-emerald-400 text-[10px] uppercase font-mono font-bold">
                <span>DISTANCE SAVED</span>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-black font-mono text-emerald-400">
                {distSaved} km
              </div>
            </div>
          </div>

          {/* Quick Order Assignment Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Inspect Order Assignment:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {orders.slice(0, 6).map(o => {
                const isSelected = selectedOrderId === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-[#101524] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {o.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROMINENT "WHY WAS THIS RIDER ASSIGNED?" CARD */}
          <WhyRiderCard orderId={selectedOrderId || 'O104'} />
        </div>
      </div>

      {/* RIGHT COLUMN: LARGE INTERACTIVE MAP (65-70% OF SCREEN) */}
      <div className="flex-1 h-full relative overflow-hidden bg-[#070a0f]">
        <MapView className="w-full h-full" />
      </div>
    </div>
  );
};
