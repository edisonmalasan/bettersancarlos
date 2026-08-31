'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// San Carlos City, Pangasinan (same coordinates used by the info bar and map marker)
const LAT = 15.928;
const LON = 120.349;
const CACHE_KEY = 'san_carlos_weather_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface HourForecast {
    time: string;
    temp: number;
    icon: string;
}

interface WeatherData {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    hourly: HourForecast[];
    timestamp: number;
}

/** Map a WMO weather code to a condition label and a Bootstrap icon. */
function mapWeatherCode(code: number): { condition: string; icon: string } {
    const m: Record<number, { condition: string; icon: string }> = {
        0: { condition: 'Clear sky', icon: 'bi-sun-fill' },
        1: { condition: 'Mainly clear', icon: 'bi-cloud-sun-fill' },
        2: { condition: 'Partly cloudy', icon: 'bi-cloud-sun-fill' },
        3: { condition: 'Overcast', icon: 'bi-clouds-fill' },
        45: { condition: 'Foggy', icon: 'bi-cloud-fog-fill' },
        48: { condition: 'Rime fog', icon: 'bi-cloud-fog-fill' },
        51: { condition: 'Light drizzle', icon: 'bi-cloud-drizzle-fill' },
        53: { condition: 'Drizzle', icon: 'bi-cloud-drizzle-fill' },
        55: { condition: 'Dense drizzle', icon: 'bi-cloud-drizzle-fill' },
        61: { condition: 'Slight rain', icon: 'bi-cloud-rain-fill' },
        63: { condition: 'Moderate rain', icon: 'bi-cloud-rain-fill' },
        65: { condition: 'Heavy rain', icon: 'bi-cloud-rain-heavy-fill' },
        80: { condition: 'Rain showers', icon: 'bi-cloud-rain-fill' },
        81: { condition: 'Rain showers', icon: 'bi-cloud-rain-fill' },
        82: { condition: 'Violent showers', icon: 'bi-cloud-rain-heavy-fill' },
        95: { condition: 'Thunderstorm', icon: 'bi-cloud-lightning-rain-fill' },
        96: { condition: 'Thunderstorm', icon: 'bi-cloud-lightning-rain-fill' },
        99: { condition: 'Thunderstorm', icon: 'bi-cloud-lightning-rain-fill' },
    };
    return m[code] || { condition: 'Partly cloudy', icon: 'bi-cloud-sun-fill' };
}

function readCache(): WeatherData | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const entry = JSON.parse(raw);
        if (entry?.data && Date.now() - entry.data.timestamp < CACHE_TTL) return entry.data;
        localStorage.removeItem(CACHE_KEY);
    } catch {
        /* ignore */
    }
    return null;
}

function writeCache(data: WeatherData) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data }));
    } catch {
        /* ignore */
    }
}

export default function WeatherWidget() {
    const { t } = useLanguage();
    const [data, setData] = useState<WeatherData | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const load = useCallback(async (force = false) => {
        setStatus('loading');
        if (!force) {
            const cached = readCache();
            if (cached) {
                setData(cached);
                setStatus('ready');
                return;
            }
        }
        try {
            const params = new URLSearchParams({
                latitude: String(LAT),
                longitude: String(LON),
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
                hourly: 'temperature_2m,weather_code',
                timezone: 'Asia/Manila',
                forecast_days: '1',
            });
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 10000);
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
                signal: controller.signal,
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`API ${res.status}`);
            const json = await res.json();
            const cur = json.current;
            if (!cur || cur.temperature_2m == null) throw new Error('No current weather');

            const { condition, icon } = mapWeatherCode(cur.weather_code);
            const nowHour = new Date().getHours();
            const hourly: HourForecast[] = [];
            const times: string[] = json.hourly?.time ?? [];
            for (let i = 0; i < 4 && nowHour + i < times.length; i++) {
                const idx = nowHour + i;
                hourly.push({
                    time: new Date(times[idx]).toLocaleTimeString('en-PH', {
                        hour: 'numeric',
                        hour12: true,
                    }),
                    temp: Math.round(json.hourly.temperature_2m[idx]),
                    icon: mapWeatherCode(json.hourly.weather_code[idx]).icon,
                });
            }

            const result: WeatherData = {
                temperature: Math.round(cur.temperature_2m),
                feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m),
                humidity: Math.round(cur.relative_humidity_2m),
                windSpeed: Math.round(cur.wind_speed_10m),
                condition,
                icon,
                hourly,
                timestamp: Date.now(),
            };
            writeCache(result);
            setData(result);
            setStatus('ready');
        } catch {
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (status === 'loading') {
        return (
            <div className="weather-loading" aria-busy="true" aria-label="Loading weather data">
                <div className="weather-current">
                    <div className="skeleton-circle"></div>
                    <div className="weather-current-info">
                        <div className="skeleton-text skeleton-lg"></div>
                        <div className="skeleton-text skeleton-md" style={{ marginTop: 8 }}></div>
                        <div className="skeleton-text skeleton-sm" style={{ marginTop: 8 }}></div>
                    </div>
                </div>
                <div className="weather-stats">
                    <div className="skeleton-text skeleton-stat"></div>
                    <div className="skeleton-text skeleton-stat"></div>
                    <div className="skeleton-text skeleton-stat"></div>
                </div>
                <div className="weather-hourly">
                    <div className="skeleton-hour"></div>
                    <div className="skeleton-hour"></div>
                    <div className="skeleton-hour"></div>
                    <div className="skeleton-hour"></div>
                </div>
            </div>
        );
    }

    if (status === 'error' || !data) {
        return (
            <div className="weather-error" role="alert">
                <div className="weather-error-content">
                    <i className="bi bi-cloud-slash" aria-hidden="true"></i>
                    <p>Weather data unavailable</p>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary weather-retry-btn"
                        onClick={() => load(true)}
                    >
                        <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="weather-widget" role="region" aria-label="Current weather in San Carlos">
            <div className="weather-current">
                <div className="weather-current-icon" aria-hidden="true">
                    <i className={`bi ${data.icon}`}></i>
                </div>
                <div className="weather-current-info">
                    <div className="weather-current-temp">{data.temperature}°C</div>
                    <div className="weather-current-condition">
                        {data.condition}
                        <span
                            className="weather-live-dot"
                            title="Live data from Open-Meteo"
                            aria-label="Live data"
                        >
                            {' '}
                            ●
                        </span>
                    </div>
                    <div className="weather-current-location">
                        <i className="bi bi-geo-alt" aria-hidden="true"></i> {t('weather-location')}
                    </div>
                </div>
            </div>

            <div className="weather-stats" role="list" aria-label="Weather details">
                <div className="weather-stat" role="listitem" aria-label={`Feels like ${data.feelsLike} degrees`}>
                    <i className="bi bi-thermometer-half" aria-hidden="true"></i>
                    <span>{data.feelsLike}°C</span>
                </div>
                <div className="weather-stat" role="listitem" aria-label={`Humidity ${data.humidity} percent`}>
                    <i className="bi bi-droplet" aria-hidden="true"></i>
                    <span>{data.humidity}%</span>
                </div>
                <div className="weather-stat" role="listitem" aria-label={`Wind ${data.windSpeed} kilometers per hour`}>
                    <i className="bi bi-wind" aria-hidden="true"></i>
                    <span>{data.windSpeed} km/h</span>
                </div>
            </div>

            {data.hourly.length > 0 && (
                <div className="weather-hourly" role="list" aria-label="Hourly forecast">
                    {data.hourly.map((h, i) => (
                        <div className="weather-hour" role="listitem" key={i}>
                            <span className="weather-hour-time">{h.time}</span>
                            <i className={`bi ${h.icon}`} aria-hidden="true"></i>
                            <span className="weather-hour-temp">{h.temp}°</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
