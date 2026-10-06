import { Rider, Order, TrafficLevel, AssignmentResult, AssignmentScoreBreakdown } from '../types';
import { calculateRiderOrderScore } from '../utils/scoring';

/**
 * Hungarian Algorithm (Kuhn-Munkres) for Linear Sum Assignment Problem (Min-Cost).
 * Handles rectangular matrices (Riders != Orders) via square matrix padding with large values.
 */
export function solveAssignmentProblem(
  riders: Rider[],
  orders: Order[],
  trafficLevel: TrafficLevel = 'MEDIUM'
): AssignmentResult {
  const startTime = performance.now();

  if (riders.length === 0 || orders.length === 0) {
    return {
      assignments: [],
      costMatrix: { riders: [], orders: [], matrix: [] },
      totalAssignmentCost: 0,
      executionTimeMs: 0
    };
  }

  // 1. Build cost matrix and score breakdowns
  const scoreBreakdownMatrix: AssignmentScoreBreakdown[][] = [];
  const rawCostMatrix: number[][] = [];

  for (let r = 0; r < riders.length; r++) {
    const rowBreakdown: AssignmentScoreBreakdown[] = [];
    const rowCost: number[] = [];
    for (let o = 0; o < orders.length; o++) {
      const breakdown = calculateRiderOrderScore(riders[r], orders[o], trafficLevel);
      rowBreakdown.push(breakdown);
      rowCost.push(breakdown.cost);
    }
    scoreBreakdownMatrix.push(rowBreakdown);
    rawCostMatrix.push(rowCost);
  }

  // 2. Pad to square matrix N x N
  const numRows = riders.length;
  const numCols = orders.length;
  const N = Math.max(numRows, numCols);
  const PAD_VAL = 999999;

  const cost: number[][] = Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => {
      if (r < numRows && c < numCols) {
        return rawCostMatrix[r][c];
      }
      return PAD_VAL;
    })
  );

  // 3. Hungarian Algorithm implementation (1-indexed for standard standard Kuhn-Munkres)
  // Dual variables: u for rows, v for columns
  const u = new Array(N + 1).fill(0);
  const v = new Array(N + 1).fill(0);
  const p = new Array(N + 1).fill(0); // Matching for columns: p[j] = row matched to col j
  const way = new Array(N + 1).fill(0);

  for (let i = 1; i <= N; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(N + 1).fill(Infinity);
    const used = new Array(N + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;

      for (let j = 1; j <= N; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      for (let j = 0; j <= N; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);

    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  // Column matching to row matching:
  // p[col] = row (1-indexed)
  const assignments: {
    riderId: string;
    orderId: string;
    cost: number;
    breakdown: AssignmentScoreBreakdown;
  }[] = [];

  let totalAssignmentCost = 0;

  for (let j = 1; j <= N; j++) {
    const row = p[j] - 1;
    const col = j - 1;
    if (row < numRows && col < numCols) {
      const c = rawCostMatrix[row][col];
      // Only accept if not a forbidden penalty pairing
      if (c < 450) {
        assignments.push({
          riderId: riders[row].id,
          orderId: orders[col].id,
          cost: c,
          breakdown: scoreBreakdownMatrix[row][col]
        });
        totalAssignmentCost += c;
      }
    }
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    assignments,
    costMatrix: {
      riders: riders.map(r => r.id),
      orders: orders.map(o => o.id),
      matrix: rawCostMatrix
    },
    totalAssignmentCost,
    executionTimeMs: Math.max(0.6, executionTimeMs)
  };
}
