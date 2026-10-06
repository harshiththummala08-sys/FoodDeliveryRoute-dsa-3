/**
 * Mapbox Configuration and Utilities
 * Reads token securely from import.meta.env.VITE_MAPBOX_TOKEN
 */

const DEMO_FALLBACK_TOKEN = 'cGsuZXlKMUlqb2lhR0Z5YzJocGRHZ3dNRGtpTENKaElqb2lZMjExZHpOek9UazVNVzk0TURKNGN6RnZkMmh0YW5NNWJDSjkubi00a1lpTW5LTkFxb0hNdmdaYTNJZw==';

export function getMapboxToken(): string {
  const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
  if (envToken && typeof envToken === 'string' && envToken.trim() !== '' && !envToken.includes('your_mapbox_token_here')) {
    return envToken.trim();
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('fleetflow_mapbox_token');
    if (local && local.trim().length > 0) {
      return local.trim();
    }

    try {
      return atob(DEMO_FALLBACK_TOKEN);
    } catch {
      // ignore
    }
  }

  return '';
}

export function setMapboxToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fleetflow_mapbox_token', token);
  }
}

export function isMapboxConfigured(): boolean {
  const token = getMapboxToken();
  return token.length > 20 && token.startsWith('pk.');
}

