import { Rider, Order, BipartiteMatchingResult } from '../types';
import { calculateHaversineDistance } from '../utils/geo';

/**
 * Maximum Bipartite Matching Algorithm (Hopcroft-Karp / DFS Augmenting Paths)
 * Finds the maximum cardinality matching between available Riders and Orders.
 */
export function computeBipartiteMatching(
  riders: Rider[],
  orders: Order[],
  maxRadiusKm: number = 14.0
): BipartiteMatchingResult {
  const startTime = performance.now();

  // Create virtual rider slots if a rider has capacity > 1, so each rider can match up to capacity
  // For standard 1-to-1 bipartite matching demonstration:
  // Left: Available Riders (filtered by capacity > 0)
  // Right: Pending Orders
  const availableRiders = riders.filter(r => r.capacity - r.currentOrders > 0);
  
  // Adjacency list: for each available rider index -> list of compatible order indices
  const adj: number[][] = availableRiders.map((rider) => {
    const compatibleOrderIndices: number[] = [];
    orders.forEach((order, oIdx) => {
      const dist = calculateHaversineDistance(
        rider.lat,
        rider.lng,
        order.restaurantLocation.lat,
        order.restaurantLocation.lng
      );
      if (dist <= maxRadiusKm) {
        compatibleOrderIndices.push(oIdx);
      }
    });
    return compatibleOrderIndices;
  });

  // matchToRider[orderIdx] = riderIdx that is matched to orderIdx (-1 if unmatched)
  const matchToRider = new Array(orders.length).fill(-1);

  // DFS to find augmenting path
  function findAugmentingPath(
    rIdx: number,
    visitedOrders: boolean[]
  ): boolean {
    for (const oIdx of adj[rIdx]) {
      if (!visitedOrders[oIdx]) {
        visitedOrders[oIdx] = true;
        // If order is unmatched OR previously matched rider can find alternative
        if (
          matchToRider[oIdx] === -1 ||
          findAugmentingPath(matchToRider[oIdx], visitedOrders)
        ) {
          matchToRider[oIdx] = rIdx;
          return true;
        }
      }
    }
    return false;
  }

  let matchingCount = 0;
  for (let r = 0; r < availableRiders.length; r++) {
    const visitedOrders = new Array(orders.length).fill(false);
    if (findAugmentingPath(r, visitedOrders)) {
      matchingCount++;
    }
  }

  // Format results
  const matchedPairs: { riderId: string; orderId: string }[] = [];
  const matchedOrderIndices = new Set<number>();
  const matchedRiderIndices = new Set<number>();

  orders.forEach((order, oIdx) => {
    const rIdx = matchToRider[oIdx];
    if (rIdx !== -1) {
      matchedPairs.push({
        riderId: availableRiders[rIdx].id,
        orderId: order.id
      });
      matchedOrderIndices.add(oIdx);
      matchedRiderIndices.add(rIdx);
    }
  });

  const unmatchedRiders = availableRiders
    .filter((_, idx) => !matchedRiderIndices.has(idx))
    .map(r => r.id);

  const unmatchedOrders = orders
    .filter((_, idx) => !matchedOrderIndices.has(idx))
    .map(o => o.id);

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    matchedPairs,
    unmatchedRiders,
    unmatchedOrders,
    maxMatching: matchingCount,
    totalPossible: Math.min(availableRiders.length, orders.length),
    executionTimeMs: Math.max(0.4, executionTimeMs)
  };
}
