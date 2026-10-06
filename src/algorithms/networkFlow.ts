import { Rider, Order, NetworkFlowResult } from '../types';
import { calculateHaversineDistance } from '../utils/geo';

/**
 * Real Network Flow Implementation (Edmonds-Karp / Dinic-style BFS Augmenting Path)
 * Graph Structure:
 *   [0] SOURCE
 *   [1 .. R] RIDERS
 *   [R+1 .. R+O] ORDERS
 *   [R+O+1] SINK
 */
export function computeNetworkFlow(
  riders: Rider[],
  orders: Order[],
  maxDeliveryRadiusKm: number = 14.0
): NetworkFlowResult {
  const startTime = performance.now();

  const numRiders = riders.length;
  const numOrders = orders.length;
  const source = 0;
  const sink = numRiders + numOrders + 1;
  const totalNodes = sink + 1;

  // Capacity and Flow matrices
  const capacity: number[][] = Array.from({ length: totalNodes }, () =>
    new Array(totalNodes).fill(0)
  );
  const flow: number[][] = Array.from({ length: totalNodes }, () =>
    new Array(totalNodes).fill(0)
  );
  const adj: number[][] = Array.from({ length: totalNodes }, () => []);

  const addEdge = (u: number, v: number, cap: number) => {
    capacity[u][v] = cap;
    adj[u].push(v);
    adj[v].push(u);
  };

  // 1. Source -> Riders (capacity = remaining capacity of rider)
  riders.forEach((rider, i) => {
    const riderNode = i + 1;
    const remainingCap = Math.max(0, rider.capacity - rider.currentOrders);
    addEdge(source, riderNode, remainingCap);
  });

  // 2. Riders -> Orders (feasible edges based on distance and availability)
  let feasibleConnections = 0;
  const feasibleEdgeTracker: { riderIdx: number; orderIdx: number; dist: number }[] = [];

  riders.forEach((rider, rIdx) => {
    const riderNode = rIdx + 1;
    orders.forEach((order, oIdx) => {
      const orderNode = numRiders + oIdx + 1;
      const dist = calculateHaversineDistance(
        rider.lat,
        rider.lng,
        order.restaurantLocation.lat,
        order.restaurantLocation.lng
      );

      // Rider can serve order if within max radius
      if (dist <= maxDeliveryRadiusKm) {
        addEdge(riderNode, orderNode, 1);
        feasibleConnections++;
        feasibleEdgeTracker.push({ riderIdx: rIdx, orderIdx: oIdx, dist });
      }
    });
  });

  // 3. Orders -> Sink (capacity = 1)
  orders.forEach((_, oIdx) => {
    const orderNode = numRiders + oIdx + 1;
    addEdge(orderNode, sink, 1);
  });

  // Edmonds-Karp BFS Augmentation
  let maxFlow = 0;

  while (true) {
    const parent = new Array(totalNodes).fill(-1);
    const queue: number[] = [source];
    parent[source] = source;

    while (queue.length > 0 && parent[sink] === -1) {
      const u = queue.shift()!;
      for (const v of adj[u]) {
        if (parent[v] === -1 && capacity[u][v] - flow[u][v] > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }

    if (parent[sink] === -1) break; // No augmenting path found

    // Find bottleneck capacity along path
    let push = Infinity;
    for (let v = sink; v !== source; v = parent[v]) {
      const u = parent[v];
      push = Math.min(push, capacity[u][v] - flow[u][v]);
    }

    // Apply push
    for (let v = sink; v !== source; v = parent[v]) {
      const u = parent[v];
      flow[u][v] += push;
      flow[v][u] -= push;
    }

    maxFlow += push;
  }

  // Format edge list for visualization
  const flowEdges: { from: string; to: string; flow: number; capacity: number; feasible: boolean }[] = [];

  // Source to Riders
  riders.forEach((r, i) => {
    const rNode = i + 1;
    flowEdges.push({
      from: 'SOURCE',
      to: r.id,
      flow: flow[source][rNode],
      capacity: capacity[source][rNode],
      feasible: capacity[source][rNode] > 0
    });
  });

  // Riders to Orders
  riders.forEach((r, rIdx) => {
    const rNode = rIdx + 1;
    orders.forEach((o, oIdx) => {
      const oNode = numRiders + oIdx + 1;
      const isFeasible = capacity[rNode][oNode] > 0;
      if (isFeasible) {
        flowEdges.push({
          from: r.id,
          to: o.id,
          flow: flow[rNode][oNode],
          capacity: capacity[rNode][oNode],
          feasible: true
        });
      }
    });
  });

  // Orders to Sink
  orders.forEach((o, oIdx) => {
    const oNode = numRiders + oIdx + 1;
    flowEdges.push({
      from: o.id,
      to: 'SINK',
      flow: flow[oNode][sink],
      capacity: capacity[oNode][sink],
      feasible: flow[oNode][sink] > 0
    });
  });

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    source: 'DEPOT_SOURCE',
    sink: 'CONSUMER_SINK',
    riderCount: numRiders,
    orderCount: numOrders,
    feasibleConnections,
    maxFlow,
    flowEdges,
    executionTimeMs: Math.max(0.5, executionTimeMs)
  };
}
