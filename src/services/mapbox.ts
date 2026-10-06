/**
 * Mapbox Configuration and Utilities
 * Reads token securely from import.meta.env.VITE_MAPBOX_TOKEN
 */

export function getMapboxToken(): string {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token || typeof token !== 'string' || token.trim() === '' || token.includes('your_mapbox_token_here')) {
    return '';
  }
  return token.trim();
}

export function isMapboxConfigured(): boolean {
  const token = getMapboxToken();
  return token.length > 20 && token.startsWith('pk.');
}
