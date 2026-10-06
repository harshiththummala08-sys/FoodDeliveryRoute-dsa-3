import { LocationPoint } from '../types';

/**
 * Calculates great-circle distance between two points using the Haversine formula (km)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function distanceBetween(p1: LocationPoint, p2: LocationPoint): number {
  return calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates bearing (heading angle 0-360 deg) from point A to point B
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

/**
 * Interpolates between two points [lng, lat]
 */
export function interpolateCoordinate(
  start: [number, number],
  end: [number, number],
  fraction: number
): [number, number] {
  const lng = start[0] + (end[0] - start[0]) * fraction;
  const lat = start[1] + (end[1] - start[1]) * fraction;
  return [lng, lat];
}

/**
 * Creates smooth road-like waypoints between two coordinates if Directions API is unavailable,
 * utilizing realistic Hyderabad corridors and curved road geometry.
 */
export function generateCurvedCorridorPoints(
  start: [number, number], // [lng, lat]
  end: [number, number],
  steps: number = 8
): [number, number][] {
  const points: [number, number][] = [];
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;

  // Midpoint with slight natural road curvature
  const midLng = (lng1 + lng2) / 2;
  const midLat = (lat1 + lat2) / 2;
  const perpFactor = ((lng1 * 1000 + lat1 * 1000) % 7 - 3) * 0.0015;

  const controlLng = midLng + (lat2 - lat1) * perpFactor;
  const controlLat = midLat - (lng2 - lng1) * perpFactor;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier curve for road-like flow
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    points.push([lng, lat]);
  }
  return points;
}
