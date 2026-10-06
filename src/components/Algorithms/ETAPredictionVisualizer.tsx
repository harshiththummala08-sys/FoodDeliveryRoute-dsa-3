import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { Clock, Navigation, Gauge, Utensils, AlertTriangle, Layers } from 'lucide-react';

export const ETAPredictionVisualizer: React.FC = () => {
  const { pipelineResult, orders } = useFleet();
  const predictions = pipelineResult?.etaPredictions || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (predictions.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Run "Optimize Fleet" to calculate transparent mathematical ETA predictions.
      </div>
    );
  }

  const activePred = predictions[selectedIdx] || predictions[0];
  const orderObj = orders.find(o => o.id === activePred.orderId);

  return (
    <div className="space-y-4 text-xs">
      {/* Order Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-slate-400 text-[11px] shrink-0">Orders:</span>
        {predictions.map((p, idx) => (
          <button
            key={p.orderId}
            onClick={() => setSelectedIdx(idx)}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
              selectedIdx === idx
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 ring-1 ring-sky-400'
                : 'bg-[#101625] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>{p.orderId}</span>
            <span className="text-[10px] text-sky-400">({p.predictedEtaMin}m)</span>
          </button>
        ))}
      </div>

      {/* Primary ETA Feature Card */}
      <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/40 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Delivery ETA for {activePred.orderId} ({orderObj?.restaurantName})
              </h4>
              <p className="text-[11px] text-slate-400">
                Assigned to {activePred.riderId} • Road-based kinematic estimation
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-sky-300 font-bold block">Predicted Total ETA</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {activePred.predictedEtaMin} min
            </span>
          </div>
        </div>

        {/* Breakdown Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-[#0c1220] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Route Distance</span>
            </div>
            <div className="text-base font-bold font-mono text-white">
              {activePred.routeDistanceKm} km
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1220] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>Average Speed</span>
            </div>
            <div className="text-base font-bold font-mono text-white">
              {activePred.averageSpeedKmh} km/h
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1220] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Traffic Congestion Delay</span>
            </div>
            <div className="text-base font-bold font-mono text-amber-300">
              +{activePred.trafficDelayMin} min
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1220] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Utensils className="w-3.5 h-3.5 text-rose-400" />
              <span>Kitchen Prep Wait</span>
            </div>
            <div className="text-base font-bold font-mono text-rose-300">
              +{activePred.restaurantPrepMin} min
            </div>
          </div>
        </div>

        {/* Formula Transparency Box */}
        <div className="p-3 rounded-xl bg-[#070b13] border border-white/10 text-[11px] font-mono text-slate-300 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Transparent Deterministic Formula:
          </span>
          <code className="text-cyan-300 block">{activePred.formula}</code>
        </div>
      </div>
    </div>
  );
};
