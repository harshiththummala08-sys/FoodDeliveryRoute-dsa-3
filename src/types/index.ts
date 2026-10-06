export type RiderStatus = 
  | 'AVAILABLE'
  | 'GOING_TO_RESTAURANT'
  | 'AT_RESTAURANT'
  | 'PICKING_UP'
  | 'DELIVERING'
  | 'ARRIVED'
  | 'DELIVERED';

export type OrderStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'PREPARING'
  | 'PICKED_UP'
  | 'DELIVERING'
  | 'DELIVERED';

export type OrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TrafficLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type OptimizationMode = 'BALANCED' | 'FAST' | 'MAX_EFFICIENCY';

export interface LocationPoint {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

export interface Rider {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: RiderStatus;
  capacity: number;
  currentOrders: number;
  color: string; // e.g. #f43f5e for R1, #06b6d4 for R2
  colorName: string;
  speedKmh: number;
  efficiencyScore: number;
  vehicle: string;
  rating: number;
  assignedOrderIds: string[];
  currentWaypointIndex?: number;
  bearing?: number; // Heading angle in degrees
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  lat: number;
  lng: number;
  prepTimeMin: number;
  rating: number;
  icon?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AssignmentScoreBreakdown {
  riderId: string;
  riderName: string;
  orderId: string;
  distanceKm: number;
  etaMin: number;
  currentWorkload: number;
  capacity: number;
  trafficLevel: TrafficLevel;
  // Component scores (0 - 100, higher is better)
  distanceScore: number; // 35%
  etaScore: number;      // 30%
  workloadScore: number; // 20%
  trafficScore: number;  // 15%
  finalScore: number;    // Weighted composite 0 - 100
  cost: number;          // Lower is better (used for Hungarian min-cost)
  reason: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLocation: LocationPoint;
  customerId: string;
  customerName: string;
  customerLocation: LocationPoint;
  items: string[];
  priority: OrderPriority;
  status: OrderStatus;
  distanceKm: number;
  assignedRiderId?: string;
  assignedRiderColor?: string;
  etaMinutes?: number;
  createdAt: string;
  scoreBreakdown?: AssignmentScoreBreakdown;
  competingScores?: AssignmentScoreBreakdown[];
}

export interface RouteWaypoint {
  id: string;
  type: 'RIDER_START' | 'RESTAURANT_PICKUP' | 'CUSTOMER_DROPOFF';
  name: string;
  lat: number;
  lng: number;
  orderId?: string;
  status?: 'PENDING' | 'REACHED' | 'COMPLETED';
}

export interface RouteGeometry {
  riderId: string;
  coordinates: [number, number][]; // [lng, lat] for Mapbox
  distanceKm: number;
  durationMin: number;
  waypoints: RouteWaypoint[];
  isOptimized?: boolean;
}

// Algorithm Results
export interface NetworkFlowResult {
  source: string;
  sink: string;
  riderCount: number;
  orderCount: number;
  feasibleConnections: number;
  maxFlow: number;
  flowEdges: { from: string; to: string; flow: number; capacity: number; feasible: boolean }[];
  executionTimeMs: number;
}

export interface BipartiteMatchingResult {
  matchedPairs: { riderId: string; orderId: string }[];
  unmatchedRiders: string[];
  unmatchedOrders: string[];
  maxMatching: number;
  totalPossible: number;
  executionTimeMs: number;
}

export interface AssignmentResult {
  assignments: {
    riderId: string;
    orderId: string;
    cost: number;
    breakdown: AssignmentScoreBreakdown;
  }[];
  costMatrix: {
    riders: string[];
    orders: string[];
    matrix: number[][]; // [riderIdx][orderIdx]
  };
  totalAssignmentCost: number;
  executionTimeMs: number;
}

export interface TSPResult {
  riderId: string;
  originalSequence: string[];
  optimizedSequence: string[];
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  distanceSavedKm: number;
  improvementPercent: number;
  executionTimeMs: number;
}

export interface ApproximationResult {
  exactDistanceKm: number;
  exactRuntimeMs: number;
  approxDistanceKm: number;
  approxRuntimeMs: number;
  distanceDifferencePercent: number;
  runtimeImprovementPercent: number;
  stopsCount: number;
}

export interface RandomizedSearchResult {
  candidatesEvaluated: number;
  candidateRoutes: {
    id: number;
    sequence: string[];
    distanceKm: number;
  }[];
  bestRoute: string[];
  bestDistanceKm: number;
  worstDistanceKm: number;
  averageDistanceKm: number;
  executionTimeMs: number;
}

export interface ETAPredictionResult {
  orderId: string;
  riderId: string;
  routeDistanceKm: number;
  averageSpeedKmh: number;
  trafficDelayMin: number;
  restaurantPrepMin: number;
  stopsDelayMin: number;
  predictedEtaMin: number;
  formula: string;
  executionTimeMs: number;
}

export interface OptimizationPipelineResult {
  timestamp: string;
  networkFlow: NetworkFlowResult;
  bipartiteMatching: BipartiteMatchingResult;
  assignment: AssignmentResult;
  tsp: TSPResult[];
  approximation: ApproximationResult;
  randomizedSearch: RandomizedSearchResult;
  etaPredictions: ETAPredictionResult[];
  summary: {
    totalDistanceBeforeKm: number;
    totalDistanceAfterKm: number;
    totalDistanceSavedKm: number;
    averageEtaMin: number;
    ordersAssigned: number;
    riderUtilizationPercent: number;
    overallOptimizationScore: number;
  };
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  type: 'ORDER' | 'NETWORK' | 'MATCH' | 'ASSIGN' | 'TSP' | 'RIDER' | 'DELIVERY' | 'SYSTEM';
  title: string;
  message: string;
  badge?: string;
  color?: string;
}
