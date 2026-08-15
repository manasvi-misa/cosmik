import type { LocationResult } from '@/types';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.length < 2) return [];

  const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8&accept-language=en`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Cosmik-AstrologyApp/1.0' },
    });
    if (!res.ok) throw new Error('Nominatim request failed');
    const data = await res.json();

    return data.map((item: any) => {
      const address = item.address || {};
      return {
        name: item.display_name,
        displayName: item.display_name,
        country: address.country || '',
        state: address.state || address.county || '',
        city: address.city || address.town || address.village || address.hamlet || query,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        timezone: estimateTimezone(parseFloat(item.lon)),
      };
    });
  } catch (err) {
    console.error('Geocoding error:', err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationResult | null> {
  const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=en`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Cosmik-AstrologyApp/1.0' },
    });
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    const address = data.address || {};

    return {
      name: data.display_name,
      displayName: data.display_name,
      country: address.country || '',
      state: address.state || '',
      city: address.city || address.town || address.village || '',
      latitude: lat,
      longitude: lon,
      timezone: estimateTimezone(lon),
    };
  } catch {
    return null;
  }
}

// Rough timezone from longitude (±offset in hours)
export function estimateTimezone(longitude: number): string {
  const offset = Math.round(longitude / 15);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  return `UTC${sign}${String(abs).padStart(2, '0')}:00`;
}

export function getTimezoneOffset(timezone: string): number {
  const match = timezone.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2]);
  const minutes = parseInt(match[3]) / 60;
  return sign * (hours + minutes);
}
