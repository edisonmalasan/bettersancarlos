/**
 * Shared Open-Meteo current-weather fetch with a module-level 5-minute cache.
 * InfoBar and WeatherWidget both render on the homepage and previously fetched
 * independently; consuming this module collapses those to a single network call
 * per TTL window without changing either component's visible behavior.
 *
 * `fetchCurrentWeather()` returns the raw open-meteo JSON (callers keep their own
 * parsing/shape), or null on failure — each caller keeps its existing fallback.
 */

const LAT = 15.928;
const LON = 120.349;
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface CurrentWeatherResponse {
  current_weather?: { temperature?: number };
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    is_day?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
  };
  [key: string]: unknown;
}

let cachedResponse: CurrentWeatherResponse | null = null;
let cachedAt = 0;
let inFlight: Promise<CurrentWeatherResponse | null> | null = null;

function buildUrl(): string {
  const params = new URLSearchParams({
    latitude: String(LAT),
    longitude: String(LON),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    current_weather: 'true',
    hourly: 'temperature_2m,weather_code',
    timezone: 'Asia/Manila',
    forecast_days: '1',
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function fetchCurrentWeather(force = false): Promise<CurrentWeatherResponse | null> {
  if (!force && cachedResponse && Date.now() - cachedAt < CACHE_TTL_MS) {
    return Promise.resolve(cachedResponse);
  }
  if (!force && inFlight) return inFlight;

  inFlight = fetch(buildUrl(), { signal: AbortSignal.timeout(10_000) })
    .then((r) => {
      if (!r.ok) throw new Error(`weather request failed: ${r.status}`);
      return r.json();
    })
    .then((json: CurrentWeatherResponse) => {
      cachedResponse = json;
      cachedAt = Date.now();
      return json;
    })
    .catch(() => {
      // API/network failure: return null; each caller keeps its own placeholder.
      return null;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
