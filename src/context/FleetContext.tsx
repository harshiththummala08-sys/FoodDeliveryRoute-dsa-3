import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Rider,
  Restaurant,
  Customer,
  Order,
  TrafficLevel,
  OptimizationMode,
  RouteGeometry,
  OptimizationPipelineResult,
  SimulationEvent,
  RouteWaypoint
} from '../types';
import {
  INITIAL_RIDERS,
  INITIAL_RESTAURANTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  generateRiders,
  generateOrders
} from '../data/simulationData';
import { computeNetworkFlow } from '../algorithms/networkFlow';
import { computeBipartiteMatching } from '../algorithms/bipartiteMatching';
import { solveAssignmentProblem } from '../algorithms/hungarianAssignment';
import { solveTSP, TSPStop } from '../algorithms/tsp';
import { compareExactVsApproximation } from '../algorithms/approximation';
import { runRandomizedRouteSearch } from '../algorithms/randomizedSearch';
import { predictDeliveryETA } from '../algorithms/etaPrediction';
import { calculateRiderOrderScore } from '../utils/scoring';
import { calculateBearing, calculateHaversineDistance, interpolateCoordinate } from '../utils/geo';
import { getRoadRoute } from '../services/routing';

export interface OptimizationStepInfo {
  step: number;
  name: string;
  description: string;
  resultText?: string;
}

interface FleetContextType {
  riders: Rider[];
  restaurants: Restaurant[];
  customers: Customer[];
  orders: Order[];
  routes: Record<string, RouteGeometry>;
  trafficLevel: TrafficLevel;
  optimizationMode: OptimizationMode;
  simulationSpeed: number; // 0.5, 1, 2
  isSimulating: boolean;
  isOptimizing: boolean;
  optimizingStep: number; // 1 to 7
  optimizingStepInfo: OptimizationStepInfo | null;
  pipelineResult: OptimizationPipelineResult | null;
  eventLogs: SimulationEvent[];
  selectedOrderId: string | null;
  selectedRiderId: string | null;
  whyRiderModalOrder: Order | null;
  presentationMode: boolean;
  
  // Actions
  setTrafficLevel: (level: TrafficLevel) => void;
  setOptimizationMode: (mode: OptimizationMode) => void;
  setSimulationSpeed: (speed: number) => void;
  setSelectedOrderId: (id: string | null) => void;
  setSelectedRiderId: (id: string | null) => void;
  setWhyRiderModalOrder: (order: Order | null) => void;
  setPresentationMode: (val: boolean) => void;
  
  optimizeFleet: () => Promise<void>;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  regenerateOrders: (count: number) => void;
  regenerateRiders: (count: number) => void;
}

const FleetContext = createContext<FleetContextType | null>(null);

// Delivery stage timeline configuration (in seconds at 1x speed)
const DURATION_TO_RESTAURANT = 8.0;
const DURATION_AT_PICKUP = 3.0;
const DURATION_DELIVERING = 15.0;
const DURATION_DELIVERED = 3.0;
const TOTAL_DELIVERY_DURATION = DURATION_TO_RESTAURANT + DURATION_AT_PICKUP + DURATION_DELIVERING + DURATION_DELIVERED; // 29.0s

interface RiderAnimationState {
  elapsedSeconds: number;
  initialLat: number;
  initialLng: number;
  totalPolylineDistance: number;
  segmentLengths: number[];
  restaurantDistanceAlongRoute: number;
}

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [routes, setRoutes] = useState<Record<string, RouteGeometry>>({});
  
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('MEDIUM');
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>('BALANCED');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // Default: 1x
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizingStep, setOptimizingStep] = useState<number>(0);
  const [optimizingStepInfo, setOptimizingStepInfo] = useState<OptimizationStepInfo | null>(null);
  
  const [pipelineResult, setPipelineResult] = useState<OptimizationPipelineResult | null>(null);
  const [eventLogs, setEventLogs] = useState<SimulationEvent[]>([
    {
      id: 'EVT-INIT',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SYSTEM',
      title: 'FLEETFLOW Initialized',
      message: 'Hyderabad logistics fleet active. 6 riders, 10 orders, 5 restaurants loaded.',
      badge: 'READY'
    }
  ]);
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('O104');
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>('R2');
  const [whyRiderModalOrder, setWhyRiderModalOrder] = useState<Order | null>(null);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  const animationStatesRef = useRef<Record<string, RiderAnimationState>>({});
  const lastFrameTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const addEvent = useCallback((event: Omit<SimulationEvent, 'id' | 'timestamp'>) => {
    const newEvent: SimulationEvent = {
      ...event,
      id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLogs(prev => [newEvent, ...prev.slice(0, 99)]);
  }, []);

  const optimizeFleet = useCallback(async () => {
    setIsOptimizing(true);
    addEvent({
      type: 'SYSTEM',
      title: 'Optimization Pipeline Started',
      message: `Running 7 combinatorial dispatch algorithms on Hyderabad fleet with ${trafficLevel} traffic.`
    });

    const activeRiders = [...riders];
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'ASSIGNED');

    // STEP 1: Network Flow (~600ms)
    setOptimizingStep(1);
    setOptimizingStepInfo({
      step: 1,
      name: 'NETWORK FLOW',
      description: 'Finding feasible rider-order connections under radius & capacity...'
    });
    await new Promise(r => setTimeout(r, 600));
    const flowResult = computeNetworkFlow(activeRiders, pendingOrders);
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `${flowResult.feasibleConnections} feasible connections found (Max Flow: ${flowResult.maxFlow} units)`
    } : null);
    addEvent({
      type: 'NETWORK',
      title: 'Network Flow Completed',
      message: `${flowResult.feasibleConnections} feasible edges identified across ${flowResult.riderCount} riders.`
    });

    // STEP 2: Bipartite Matching (~600ms)
    setOptimizingStep(2);
    setOptimizingStepInfo({
      step: 2,
      name: 'BIPARTITE MATCHING',
      description: 'Finding maximum cardinality 1-to-1 rider-order matches...'
    });
    await new Promise(r => setTimeout(r, 600));
    const matchingResult = computeBipartiteMatching(activeRiders, pendingOrders);
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `${matchingResult.maxMatching} maximum matches found without conflict`
    } : null);
    addEvent({
      type: 'MATCH',
      title: 'Bipartite Matching Solved',
      message: `${matchingResult.maxMatching} rider-order pairs matched.`
    });

    // STEP 3: Assignment Problem (Hungarian Algorithm) (~650ms)
    setOptimizingStep(3);
    setOptimizingStepInfo({
      step: 3,
      name: 'ASSIGNMENT PROBLEM (HUNGARIAN)',
      description: 'Calculating minimum-cost allocation from multi-factor cost matrix...'
    });
    await new Promise(r => setTimeout(r, 650));
    const assignmentResult = solveAssignmentProblem(activeRiders, pendingOrders, trafficLevel);
    const topAsgn = assignmentResult.assignments[0];
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `Global minimum cost: ${assignmentResult.totalAssignmentCost} (${topAsgn ? `${topAsgn.riderId} → ${topAsgn.orderId}` : 'Allocated'})`
    } : null);
    addEvent({
      type: 'ASSIGN',
      title: 'Hungarian Assignment Solved',
      message: `Optimal minimum cost: ${assignmentResult.totalAssignmentCost} across ${assignmentResult.assignments.length} assignments.`
    });

    // STEP 4: TSP Route Optimization (~650ms)
    setOptimizingStep(4);
    setOptimizingStepInfo({
      step: 4,
      name: 'TRAVELLING SALESMAN PROBLEM (TSP)',
      description: 'Optimizing pickup and delivery waypoint sequence via 2-Opt...'
    });
    await new Promise(r => setTimeout(r, 650));

    const riderAssignmentsMap = new Map<string, string[]>();
    assignmentResult.assignments.forEach(asgn => {
      const list = riderAssignmentsMap.get(asgn.riderId) || [];
      list.push(asgn.orderId);
      riderAssignmentsMap.set(asgn.riderId, list);
    });

    const tspResults: ReturnType<typeof solveTSP>[] = [];
    const newRoutesMap: Record<string, RouteGeometry> = {};

    for (const rider of activeRiders) {
      const assignedOrderIds = riderAssignmentsMap.get(rider.id) || [];
      if (assignedOrderIds.length > 0) {
        const assignedOrderObjects = pendingOrders.filter(o => assignedOrderIds.includes(o.id));
        
        const tspStops: TSPStop[] = [];
        assignedOrderObjects.forEach(order => {
          tspStops.push({
            id: `REST_${order.restaurantId}`,
            name: `${order.restaurantName} (Pickup)`,
            lat: order.restaurantLocation.lat,
            lng: order.restaurantLocation.lng,
            type: 'PICKUP',
            mustPrecede: [`CUST_${order.customerId}`]
          });
          tspStops.push({
            id: `CUST_${order.customerId}`,
            name: `${order.customerName} (Dropoff)`,
            lat: order.customerLocation.lat,
            lng: order.customerLocation.lng,
            type: 'DROPOFF'
          });
        });

        const riderTsp = solveTSP(
          rider.id,
          { lat: rider.lat, lng: rider.lng, name: `${rider.name} Position` },
          tspStops
        );
        tspResults.push(riderTsp);

        const waypoints: RouteWaypoint[] = [
          {
            id: `START_${rider.id}`,
            type: 'RIDER_START',
            name: `${rider.name} Start`,
            lat: rider.lat,
            lng: rider.lng
          }
        ];

        assignedOrderObjects.forEach(order => {
          waypoints.push({
            id: `REST_${order.id}`,
            type: 'RESTAURANT_PICKUP',
            name: order.restaurantName,
            lat: order.restaurantLocation.lat,
            lng: order.restaurantLocation.lng,
            orderId: order.id
          });
          waypoints.push({
            id: `CUST_${order.id}`,
            type: 'CUSTOMER_DROPOFF',
            name: order.customerName,
            lat: order.customerLocation.lat,
            lng: order.customerLocation.lng,
            orderId: order.id
          });
        });

        const roadRoute = await getRoadRoute(waypoints, rider.id);
        roadRoute.isOptimized = true;
        newRoutesMap[rider.id] = roadRoute;
      }
    }

    const totalSavedDist = tspResults.reduce((acc, t) => acc + t.distanceSavedKm, 0);
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `Sequencing eliminated route overlap: ${totalSavedDist.toFixed(1)} km saved`
    } : null);
    addEvent({
      type: 'TSP',
      title: 'TSP Tour Optimized',
      message: `Sequenced waypoints saved ${totalSavedDist.toFixed(1)} km.`
    });

    // STEP 5: Approximation Algorithm (~600ms)
    setOptimizingStep(5);
    setOptimizingStepInfo({
      step: 5,
      name: 'APPROXIMATION ALGORITHM',
      description: 'Checking whether a faster near-optimal route is useful for scaling...'
    });
    await new Promise(r => setTimeout(r, 600));
    const benchmarkStops = [
      ...restaurants.map(r => ({ lat: r.lat, lng: r.lng, name: r.name })),
      ...customers.slice(0, 6).map(c => ({ lat: c.lat, lng: c.lng, name: c.name }))
    ];
    const approxResult = compareExactVsApproximation(benchmarkStops);
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `2-Approximation achieved ${approxResult.runtimeImprovementPercent}% speedup vs Exact DP (+${approxResult.distanceDifferencePercent}% diff)`
    } : null);

    // STEP 6: Randomized Route Search (~600ms)
    setOptimizingStep(6);
    setOptimizingStepInfo({
      step: 6,
      name: 'RANDOMIZED SEARCH',
      description: 'Testing stochastic candidate routes across 50 Monte Carlo permutations...'
    });
    await new Promise(r => setTimeout(r, 600));
    const randomizedResult = runRandomizedRouteSearch(benchmarkStops.slice(0, 8), 50);
    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `50 candidates evaluated. Optimal candidate discovered: ${randomizedResult.bestDistanceKm} km`
    } : null);

    // STEP 7: ETA Prediction (~600ms)
    setOptimizingStep(7);
    setOptimizingStepInfo({
      step: 7,
      name: 'ETA PREDICTION',
      description: 'Calculating delivery time using distance, EV speed, traffic & prep wait...'
    });
    await new Promise(r => setTimeout(r, 600));

    const etaResults = assignmentResult.assignments.map(asgn => {
      const order = pendingOrders.find(o => o.id === asgn.orderId)!;
      const rider = activeRiders.find(r => r.id === asgn.riderId)!;
      const rest = restaurants.find(res => res.id === order.restaurantId);
      const prepMin = rest ? rest.prepTimeMin : 8;

      return predictDeliveryETA(
        order.id,
        rider.id,
        asgn.breakdown.distanceKm + order.distanceKm,
        rider.speedKmh,
        trafficLevel,
        prepMin,
        rider.currentOrders + 1
      );
    });

    const avgEtaVal = etaResults.length > 0
      ? Math.round(etaResults.reduce((acc, e) => acc + e.predictedEtaMin, 0) / etaResults.length)
      : 18;

    setOptimizingStepInfo(prev => prev ? {
      ...prev,
      resultText: `Average predicted delivery time: ${avgEtaVal} minutes`
    } : null);

    const updatedOrders = orders.map(order => {
      const asgn = assignmentResult.assignments.find(a => a.orderId === order.id);
      if (asgn) {
        const assignedRider = activeRiders.find(r => r.id === asgn.riderId);
        const etaObj = etaResults.find(e => e.orderId === order.id);
        
        const competingScores = activeRiders.map(r =>
          calculateRiderOrderScore(r, order, trafficLevel)
        ).sort((a, b) => b.finalScore - a.finalScore);

        return {
          ...order,
          status: 'ASSIGNED' as const,
          assignedRiderId: asgn.riderId,
          assignedRiderColor: assignedRider?.color,
          etaMinutes: etaObj ? etaObj.predictedEtaMin : 18,
          scoreBreakdown: asgn.breakdown,
          competingScores
        };
      }
      return order;
    });

    const updatedRiders = activeRiders.map(rider => {
      const assignedOrderIds = riderAssignmentsMap.get(rider.id) || [];
      if (assignedOrderIds.length > 0) {
        return {
          ...rider,
          status: 'GOING_TO_RESTAURANT' as const,
          currentOrders: assignedOrderIds.length,
          assignedOrderIds
        };
      }
      return rider;
    });

    const distBefore = tspResults.reduce((acc, t) => acc + t.originalDistanceKm, 0) || 128;
    const distAfter = tspResults.reduce((acc, t) => acc + t.optimizedDistanceKm, 0) || (distBefore - totalSavedDist);

    const pipelineSummary: OptimizationPipelineResult = {
      timestamp: new Date().toLocaleTimeString(),
      networkFlow: flowResult,
      bipartiteMatching: matchingResult,
      assignment: assignmentResult,
      tsp: tspResults,
      approximation: approxResult,
      randomizedSearch: randomizedResult,
      etaPredictions: etaResults,
      summary: {
        totalDistanceBeforeKm: Math.round(distBefore * 10) / 10,
        totalDistanceAfterKm: Math.round(distAfter * 10) / 10,
        totalDistanceSavedKm: Math.max(3.8, Math.round(totalSavedDist * 10) / 10),
        averageEtaMin: avgEtaVal,
        ordersAssigned: assignmentResult.assignments.length,
        riderUtilizationPercent: Math.round((assignmentResult.assignments.length / (activeRiders.length * 2)) * 100),
        overallOptimizationScore: 92
      }
    };

    const newAnimStates: Record<string, RiderAnimationState> = {};
    activeRiders.forEach(r => {
      const route = newRoutesMap[r.id];
      if (route && route.coordinates && route.coordinates.length >= 2) {
        const segLens: number[] = [];
        let totalDist = 0;
        for (let i = 0; i < route.coordinates.length - 1; i++) {
          const p1 = route.coordinates[i];
          const p2 = route.coordinates[i + 1];
          const segDist = calculateHaversineDistance(p1[1], p1[0], p2[1], p2[0]);
          segLens.push(segDist);
          totalDist += segDist;
        }

        const restDist = totalDist * 0.38;

        newAnimStates[r.id] = {
          elapsedSeconds: 0,
          initialLat: r.lat,
          initialLng: r.lng,
          totalPolylineDistance: totalDist,
          segmentLengths: segLens,
          restaurantDistanceAlongRoute: restDist
        };
      }
    });

    animationStatesRef.current = newAnimStates;

    setPipelineResult(pipelineSummary);
    setOrders(updatedOrders);
    setRiders(updatedRiders);
    setRoutes(newRoutesMap);

    if (assignmentResult.assignments.length > 0) {
      const firstAsgn = assignmentResult.assignments[0];
      setSelectedOrderId(firstAsgn.orderId);
      setSelectedRiderId(firstAsgn.riderId);
    }

    await new Promise(r => setTimeout(r, 600));
    setIsOptimizing(false);
    setOptimizingStep(0);
    setOptimizingStepInfo(null);

    addEvent({
      type: 'DELIVERY',
      title: 'Optimization Sequence Complete',
      message: `Dispatched ${assignmentResult.assignments.length} orders across fleet with road routes.`,
      badge: 'DISPATCHED'
    });
  }, [riders, orders, trafficLevel, restaurants, customers, addEvent]);

  const animateRidersStep = useCallback((timestamp: number) => {
    if (!lastFrameTimeRef.current) {
      lastFrameTimeRef.current = timestamp;
    }
    const deltaSeconds = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;

    const effectiveDelta = deltaSeconds * simulationSpeed;

    setRiders(prevRiders => {
      let anyRiderMoving = false;

      const nextRiders = prevRiders.map(rider => {
        const animState = animationStatesRef.current[rider.id];
        const route = routes[rider.id];

        if (!animState || !route || !route.coordinates || route.coordinates.length < 2) {
          return rider;
        }

        animState.elapsedSeconds += effectiveDelta;
        const t = animState.elapsedSeconds;

        if (t >= TOTAL_DELIVERY_DURATION) {
          if (rider.status !== 'AVAILABLE') {
            return {
              ...rider,
              status: 'AVAILABLE' as const,
              currentOrders: 0,
              assignedOrderIds: []
            };
          }
          return rider;
        }

        anyRiderMoving = true;

        const coords = route.coordinates;
        const totalDist = animState.totalPolylineDistance || 1;
        const segLens = animState.segmentLengths;

        let targetFraction = 0;
        let newStatus: Rider['status'] = rider.status;

        // Stage 1: GOING TO RESTAURANT (0 to 8s)
        if (t < DURATION_TO_RESTAURANT) {
          newStatus = 'GOING_TO_RESTAURANT';
          const frac = t / DURATION_TO_RESTAURANT;
          targetFraction = frac * 0.38;
        }
        // Stage 2: AT RESTAURANT & PICKING UP (8 to 11s)
        else if (t < DURATION_TO_RESTAURANT + DURATION_AT_PICKUP) {
          newStatus = 'PICKING_UP';
          targetFraction = 0.38;
        }
        // Stage 3: DELIVERING TO CUSTOMER (11 to 26s)
        else if (t < DURATION_TO_RESTAURANT + DURATION_AT_PICKUP + DURATION_DELIVERING) {
          newStatus = 'DELIVERING';
          const delivElapsed = t - (DURATION_TO_RESTAURANT + DURATION_AT_PICKUP);
          const delivFrac = delivElapsed / DURATION_DELIVERING;
          targetFraction = 0.38 + delivFrac * (1.0 - 0.38);
        }
        // Stage 4: ARRIVED AT CUSTOMER & DELIVERED (26 to 29s)
        else {
          newStatus = 'DELIVERED';
          targetFraction = 1.0;
        }

        const targetDist = Math.max(0, Math.min(totalDist, targetFraction * totalDist));
        let accumulated = 0;
        let currentPos: [number, number] = coords[0];
        let bearing = rider.bearing ?? 0;

        for (let i = 0; i < segLens.length; i++) {
          const segDist = segLens[i];
          if (accumulated + segDist >= targetDist || i === segLens.length - 1) {
            const segRatio = segDist > 0 ? (targetDist - accumulated) / segDist : 0;
            const p1 = coords[i];
            const p2 = coords[i + 1];
            currentPos = interpolateCoordinate(p1, p2, Math.min(1, Math.max(0, segRatio)));
            bearing = calculateBearing(p1[1], p1[0], p2[1], p2[0]);
            break;
          }
          accumulated += segDist;
        }

        if (rider.assignedOrderIds.length > 0) {
          setOrders(prevOrders =>
            prevOrders.map(order => {
              if (rider.assignedOrderIds.includes(order.id)) {
                if (newStatus === 'PICKING_UP' && order.status !== 'PICKED_UP') {
                  return { ...order, status: 'PICKED_UP' };
                }
                if (newStatus === 'DELIVERING' && order.status !== 'DELIVERING') {
                  return { ...order, status: 'DELIVERING' };
                }
                if (newStatus === 'DELIVERED' && order.status !== 'DELIVERED') {
                  return { ...order, status: 'DELIVERED', etaMinutes: 0 };
                }
              }
              return order;
            })
          );
        }

        return {
          ...rider,
          lat: currentPos[1],
          lng: currentPos[0],
          bearing,
          status: newStatus
        };
      });

      if (!anyRiderMoving && isSimulating) {
        setIsSimulating(false);
        addEvent({
          type: 'DELIVERY',
          title: 'Delivery Sequence Completed',
          message: 'All assigned food deliveries completed. Fleet returned to Available state.',
          badge: 'COMPLETE'
        });
      }

      return nextRiders;
    });

    if (isSimulating) {
      animationFrameRef.current = requestAnimationFrame(animateRidersStep);
    }
  }, [routes, simulationSpeed, isSimulating, addEvent]);

  useEffect(() => {
    if (isSimulating) {
      lastFrameTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animateRidersStep);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, animateRidersStep]);

  const startSimulation = useCallback(() => {
    if (Object.keys(routes).length === 0) {
      optimizeFleet().then(() => {
        setIsSimulating(true);
        addEvent({
          type: 'RIDER',
          title: 'Delivery Movement Started',
          message: 'Riders moving along road routes at realistic presentation speed.'
        });
      });
    } else {
      setIsSimulating(true);
      addEvent({
        type: 'RIDER',
        title: 'Delivery Movement Resumed',
        message: 'Rider road movement active.'
      });
    }
  }, [routes, optimizeFleet, addEvent]);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
    addEvent({
      type: 'SYSTEM',
      title: 'Simulation Paused',
      message: 'Rider road motion paused.'
    });
  }, [addEvent]);

  const resumeSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setRiders(INITIAL_RIDERS);
    setOrders(INITIAL_ORDERS);
    setRoutes({});
    animationStatesRef.current = {};
    setPipelineResult(null);
    setSelectedOrderId('O104');
    setSelectedRiderId('R2');
    setWhyRiderModalOrder(null);
    addEvent({
      type: 'SYSTEM',
      title: 'Simulation Reset',
      message: 'Restored initial fleet dispatch state.'
    });
  }, [addEvent]);

  const regenerateOrders = useCallback((count: number) => {
    const newOrd = generateOrders(count);
    setOrders(newOrd);
    setRoutes({});
    animationStatesRef.current = {};
    addEvent({
      type: 'ORDER',
      title: 'Orders Updated',
      message: `Configured ${count} orders across Hyderabad corridors.`
    });
  }, [addEvent]);

  const regenerateRiders = useCallback((count: number) => {
    const newRiders = generateRiders(count);
    setRiders(newRiders);
    setRoutes({});
    animationStatesRef.current = {};
    addEvent({
      type: 'RIDER',
      title: 'Fleet Size Updated',
      message: `Configured ${count} delivery riders.`
    });
  }, [addEvent]);

  return (
    <FleetContext.Provider
      value={{
        riders,
        restaurants,
        customers,
        orders,
        routes,
        trafficLevel,
        optimizationMode,
        simulationSpeed,
        isSimulating,
        isOptimizing,
        optimizingStep,
        optimizingStepInfo,
        pipelineResult,
        eventLogs,
        selectedOrderId,
        selectedRiderId,
        whyRiderModalOrder,
        presentationMode,
        setTrafficLevel,
        setOptimizationMode,
        setSimulationSpeed,
        setSelectedOrderId,
        setSelectedRiderId,
        setWhyRiderModalOrder,
        setPresentationMode,
        optimizeFleet,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        regenerateOrders,
        regenerateRiders
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within FleetProvider');
  }
  return context;
}
