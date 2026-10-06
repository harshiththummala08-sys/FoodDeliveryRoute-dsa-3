import { TrafficLevel, ETAPredictionResult } from '../types';

/**
 * Transparent Mathematical ETA Prediction
 * Explicit formula:
 * ETA = (TotalDistanceKm / EffectiveSpeedKmh) * 60 + TrafficDelayMin + RestaurantPrepWaitMin + (StopsCount * StopOverheadMin)
 */
export function predictDeliveryETA(
  orderId: string,
  riderId: string,
  routeDistanceKm: number,
  baseRiderSpeedKmh: number = 30,
  trafficLevel: TrafficLevel = 'MEDIUM',
  restaurantPrepMin: number = 8,
  stopsCount: number = 1
): ETAPredictionResult {
  const startTime = performance.now();

  // Traffic impact multipliers and direct delays
  const trafficDelayMap: Record<TrafficLevel, { speedMultiplier: number; delayMin: number }> = {
    LOW: { speedMultiplier: 1.0, delayMin: 1 },
    MEDIUM: { speedMultiplier: 0.85, delayMin: 4 },
    HIGH: { speedMultiplier: 0.65, delayMin: 9 }
  };

  const { speedMultiplier, delayMin } = trafficDelayMap[trafficLevel];
  const effectiveSpeedKmh = Math.max(16, Math.round(baseRiderSpeedKmh * speedMultiplier * 10) / 10);

  // Travel time in minutes
  const travelTimeMin = Math.round((routeDistanceKm / effectiveSpeedKmh) * 60 * 10) / 10;

  // Stops handling overhead (e.g. 2.5 min per intermediate stop / handover)
  const stopOverheadMin = Math.max(0, (stopsCount - 1) * 2.5);

  // Preparation time wait (food is being prepared concurrently while rider rides to restaurant)
  // If rider takes 5 mins to reach restaurant and prep takes 8 mins, rider waits 3 mins.
  const timeToReachRestaurantEst = travelTimeMin * 0.45;
  const restaurantWaitMin = Math.max(0, Math.round((restaurantPrepMin - timeToReachRestaurantEst) * 10) / 10);

  // Total predicted ETA
  const predictedEtaMin = Math.max(
    5,
    Math.round(travelTimeMin + delayMin + restaurantWaitMin + stopOverheadMin)
  );

  const formula = `ETA = (${routeDistanceKm.toFixed(1)} km / ${effectiveSpeedKmh} km/h * 60) + ${delayMin}m (traffic) + ${restaurantWaitMin.toFixed(1)}m (prep buffer) + ${stopOverheadMin.toFixed(1)}m (stops)`;

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    orderId,
    riderId,
    routeDistanceKm: Math.round(routeDistanceKm * 100) / 100,
    averageSpeedKmh: effectiveSpeedKmh,
    trafficDelayMin: delayMin,
    restaurantPrepMin: restaurantPrepMin,
    stopsDelayMin: stopOverheadMin,
    predictedEtaMin,
    formula,
    executionTimeMs: Math.max(0.2, executionTimeMs)
  };
}
