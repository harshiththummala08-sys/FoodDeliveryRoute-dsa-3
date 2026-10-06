import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { X, CheckCircle, Award, Compass, Clock, Package, Gauge, AlertCircle } from 'lucide-react';
import { AssignmentScoreBreakdown } from '../../types';

export const WhyRiderModal: React.FC = () => {
  const { whyRiderModalOrder, setWhyRiderModalOrder, riders } = useFleet();

  if (!whyRiderModalOrder) return null;

  const order = whyRiderModalOrder;
  const assignedRider = riders.find(r => r.id === order.assignedRiderId);
  const breakdown = order.scoreBreakdown;
  const competingScores: AssignmentScoreBreakdown[] = order.competingScores || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c101a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#111726]/60">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-black shadow-lg"
              style={{ backgroundColor: assignedRider?.color || '#06b6d4' }}
            >
              {order.assignedRiderId || 'R?'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                WHY WAS {order.assignedRiderId} ASSIGNED TO {order.id}?
              </h3>
              <p className="text-xs text-slate-400">
                Algorithmic Kuhn-Munkres Min-Cost Assignment Justification
              </p>
            </div>
          </div>
          <button
            onClick={() => setWhyRiderModalOrder(null)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Competitor Scoreboard Comparison */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Fleet Candidates Evaluation & Ranking
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {competingScores.map(score => {
                const isWinner = score.riderId === order.assignedRiderId;
                const rObj = riders.find(r => r.id === score.riderId);
                return (
                  <div
                    key={score.riderId}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isWinner
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-[#101625] border-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: rObj?.color || '#fff' }}
                      />
                      <span className="font-mono font-bold text-white text-xs">
                        {score.riderId}
                      </span>
                    </div>
                    <div className="text-lg font-black font-mono text-cyan-300">
                      {score.finalScore}
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
                      {isWinner ? (
                        <span className="text-cyan-400 flex items-center justify-center gap-0.5">
                          ✓ SELECTED
                        </span>
                      ) : (
                        <span className="text-slate-500">Candidate</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Metrics Checklist */}
          {breakdown && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Dispatch Constraint Criteria & Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#101625] border border-white/5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Pickup Proximity</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-semibold text-white">
                    <span>{breakdown.distanceKm.toFixed(1)} km</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#101625] border border-white/5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Predicted Total ETA</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-semibold text-white">
                    <span>{breakdown.etaMin} min</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#101625] border border-white/5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span>Current Workload</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-semibold text-white">
                    <span>{breakdown.currentWorkload} / {breakdown.capacity} orders</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#101625] border border-white/5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Gauge className="w-4 h-4 text-indigo-400" />
                    <span>Corridor Traffic</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-semibold text-white">
                    <span className="capitalize">{breakdown.trafficLevel}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Score Weighting Decomposition */}
          {breakdown && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Objective Function Scoring Decomposition (Weights)
              </h4>
              <div className="space-y-2 text-xs bg-[#101625] p-4 rounded-xl border border-white/5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Distance Component (Weight: 35%)</span>
                    <span className="font-mono text-cyan-300 font-semibold">{breakdown.distanceScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${breakdown.distanceScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">ETA Component (Weight: 30%)</span>
                    <span className="font-mono text-amber-300 font-semibold">{breakdown.etaScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${breakdown.etaScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Rider Workload Availability (Weight: 20%)</span>
                    <span className="font-mono text-purple-300 font-semibold">{breakdown.workloadScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${breakdown.workloadScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Traffic Resistance Factor (Weight: 15%)</span>
                    <span className="font-mono text-indigo-300 font-semibold">{breakdown.trafficScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${breakdown.trafficScore}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Aggregated Final Score:</span>
                  <span className="font-mono font-black text-emerald-400 text-lg">
                    {breakdown.finalScore} / 100
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Transparent Dispatch Decision */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs leading-relaxed text-slate-200">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Algorithmic Decision Justification:</span>
            </div>
            <p className="text-slate-300">
              {breakdown?.reason ||
                `${order.assignedRiderId} was selected because it delivers the optimal Hungarian cost function value across proximity, speed, and vehicle workload bandwidth while strictly observing capacity limits.`}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111726]/60 flex justify-end">
          <button
            onClick={() => setWhyRiderModalOrder(null)}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-all shadow-md"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
