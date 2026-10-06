import { getMapboxToken, isMapboxConfigured } from './mapbox';
import { generateCurvedCorridorPoints, calculateHaversineDistance } from '../utils/geo';
import { RouteGeometry, RouteWaypoint } from '../types';

interface CachedRoute {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
}

const routeCache = new Map<string, CachedRoute>();

/**
 * Fetches real road geometry between ordered waypoints using Mapbox Directions API,
 * with graceful fallback to high-fidelity simulated road corridors.
 */
export async function getRoadRoute(
  waypoints: RouteWaypoint[],
  riderId: string
): Promise<RouteGeometry> {
  if (waypoints.length < 2) {
    return {
      riderId,
      coordinates: waypoints.map(w => [w.lng, w.lat]),
      distanceKm: 0,
      durationMin: 0,
      waypoints
    };
  }

  const coordinatesString = waypoints.map(w => `${w.lng.toFixed(5)},${w.lat.toFixed(5)}`).join(';');
  const cacheKey = coordinatesString;

  if (routeCache.has(cacheKey)) {
    const cached = routeCache.get(cacheKey)!;
    return {
      riderId,
      coordinates: cached.coordinates,
      distanceKm: cached.distanceKm,
      durationMin: cached.durationMin,
      waypoints
    };
  }

  // Attempt real Mapbox Directions API if token exists
  if (isMapboxConfigured()) {
    try {
      const token = getMapboxToken();
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&overview=full&access_token=${token}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const rawCoords: [number, number][] = route.geometry.coordinates;
          const distKm = Math.round((route.distance / 1000) * 10) / 10;
          const durMin = Math.round((route.duration / 60) * 10) / 10;

          const result: CachedRoute = {
            coordinates: rawCoords,
            distanceKm: distKm,
            durationMin: durMin
          };
          routeCache.set(cacheKey, result);

          return {
            riderId,
            coordinates: rawCoords,
            distanceKm: distKm,
            durationMin: durMin,
            waypoints
          };
        }
      }
    } catch (err) {
      console.warn('Mapbox Directions API fallback to corridor interpolation:', err);
    }
  }

  // Fallback: Generate curved road-like corridor coordinates connecting each waypoint pair
  const fallbackCoords: [number, number][] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1: [number, number] = [waypoints[i].lng, waypoints[i].lat];
    const p2: [number, number] = [waypoints[i + 1].lng, waypoints[i + 1].lat];
    
    const segmentPoints = generateCurvedCorridorPoints(p1, p2, 16);
    if (i > 0) {
      segmentPoints.shift(); // Avoid duplicate consecutive points
    }
    fallbackCoords.push(...segmentPoints);

    totalDistanceKm += calculateHaversineDistance(
      waypoints[i].lat,
      waypoints[i].lng,
      waypoints[i + 1].lat,
      waypoints[i + 1].lng
    );
  }

  // 1.25 factor to simulate road winding compared to straight Haversine
  const roadDistKm = Math.round(totalDistanceKm * 1.22 * 10) / 10;
  const estimatedDurMin = Math.round((roadDistKm / 28) * 60);

  const fallbackResult: CachedRoute = {
    coordinates: fallbackCoords,
    distanceKm: roadDistKm,
    durationMin: estimatedDurMin
  };
  routeCache.set(cacheKey, fallbackResult);

  return {
    riderId,
    coordinates: fallbackCoords,
    distanceKm: roadDistKm,
    durationMin: estimatedDurMin,
    waypoints
  };
}
