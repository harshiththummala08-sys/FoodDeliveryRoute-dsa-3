import { Rider, Order, TrafficLevel, AssignmentScoreBreakdown } from '../types';
import { calculateHaversineDistance } from './geo';

export interface ScoreWeights {
  distance: number; // default 0.35
  eta: number;      // default 0.30
  workload: number; // default 0.20
  traffic: number;  // default 0.15
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  distance: 0.35,
  eta: 0.30,
  workload: 0.20,
  traffic: 0.15
};

/**
 * Calculates comprehensive assignment score and cost for rider-order pairing.
 * Scores are 0 - 100 (higher is better).
 * Costs are min-cost values for the Hungarian Algorithm (lower is better).
 */
export function calculateRiderOrderScore(
  rider: Rider,
  order: Order,
  trafficLevel: TrafficLevel = 'MEDIUM',
  weights: ScoreWeights = DEFAULT_WEIGHTS
): AssignmentScoreBreakdown {
  // 1. Distance from rider current location to restaurant pickup
  const distToRest = calculateHaversineDistance(
    rider.lat,
    rider.lng,
    order.restaurantLocation.lat,
    order.restaurantLocation.lng
  );
  
  // Total assignment distance = dist to restaurant + dist to customer
  const totalTripDist = distToRest + order.distanceKm;

  // Distance score: ideal <= 2km (100), drops to 0 at 15km
  const maxAcceptableDist = 14.0;
  const clampedDist = Math.min(distToRest, maxAcceptableDist);
  const distanceScore = Math.max(0, Math.round(100 * (1 - clampedDist / maxAcceptableDist)));

  // 2. Traffic speed adjustment
  const trafficSpeedMultiplier = {
    LOW: 1.0,
    MEDIUM: 0.8,
    HIGH: 0.55
  }[trafficLevel];

  const effectiveSpeedKmh = Math.max(15, rider.speedKmh * trafficSpeedMultiplier);
  const travelTimeToRestMin = Math.round((distToRest / effectiveSpeedKmh) * 60);
  const travelRestToCustMin = Math.round((order.distanceKm / effectiveSpeedKmh) * 60);
  
  // Traffic delay
  const trafficDelayMin = trafficLevel === 'HIGH' ? 8 : trafficLevel === 'MEDIUM' ? 3 : 0;
  const estimatedEtaMin = travelTimeToRestMin + travelRestToCustMin + trafficDelayMin;

  // ETA score: ideal <= 15 min (100), drops to 0 at 55 min
  const maxEtaThreshold = 50;
  const clampedEta = Math.min(estimatedEtaMin, maxEtaThreshold);
  const etaScore = Math.max(0, Math.round(100 * (1 - clampedEta / maxEtaThreshold)));

  // 3. Workload score: capacity utilization
  const remainingCapacity = Math.max(0, rider.capacity - rider.currentOrders);
  let workloadScore = 0;
  if (rider.currentOrders === 0) {
    workloadScore = 100;
  } else if (remainingCapacity > 0) {
    workloadScore = Math.round(50 + (remainingCapacity / rider.capacity) * 40);
  } else {
    workloadScore = 5; // Heavily penalized if at capacity
  }

  // 4. Traffic score
  const trafficScore = trafficLevel === 'LOW' ? 95 : trafficLevel === 'MEDIUM' ? 75 : 50;

  // Priority bonus: high priority orders prioritize faster/closer riders
  let priorityModifier = 0;
  if (order.priority === 'CRITICAL') priorityModifier = 8;
  else if (order.priority === 'HIGH') priorityModifier = 4;

  // Composite score: 0 to 100
  const finalScoreRaw =
    distanceScore * weights.distance +
    etaScore * weights.eta +
    workloadScore * weights.workload +
    trafficScore * weights.traffic +
    priorityModifier;

  const finalScore = Math.min(100, Math.max(0, Math.round(finalScoreRaw)));

  // Cost matrix value for Hungarian Algorithm (minimization objective)
  // Base cost is 100 - score + penalty if over capacity
  const capacityPenalty = remainingCapacity === 0 ? 500 : 0;
  const cost = Math.max(1, Math.round(100 - finalScore + (distToRest * 2) + capacityPenalty));

  // Human-readable transparent explanation
  let reason = '';
  if (remainingCapacity === 0) {
    reason = `${rider.name} is at full capacity (${rider.currentOrders}/${rider.capacity} active orders).`;
  } else if (distToRest <= 3.0 && remainingCapacity > 0) {
    reason = `${rider.name} is in close proximity (${distToRest.toFixed(1)} km) with high capacity available.`;
  } else if (workloadScore >= 80) {
    reason = `${rider.name} has optimal available bandwidth and high vehicle efficiency (${rider.efficiencyScore}%).`;
  } else {
    reason = `Satisfies route requirements with an ETA of ~${estimatedEtaMin} min under ${trafficLevel.toLowerCase()} traffic.`;
  }

  return {
    riderId: rider.id,
    riderName: rider.name,
    orderId: order.id,
    distanceKm: distToRest,
    etaMin: estimatedEtaMin,
    currentWorkload: rider.currentOrders,
    capacity: rider.capacity,
    trafficLevel,
    distanceScore,
    etaScore,
    workloadScore,
    trafficScore,
    finalScore,
    cost,
    reason
  };
}
