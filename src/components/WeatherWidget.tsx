'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedIcon from '@/components/icons/AnimatedIcon';

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
    code: number;
    isDay: boolean;
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

/** Map a WMO weather code + day/night flag to the matching animated Lottie icon asset name. */
function mapAnimatedIcon(code: number, isDay: boolean): string {
    if (code === 0 || code === 1) return isDay ? 'Weather-sunny' : 'Weather-night';
    if (code <= 48) return 'Weather-partly cloudy';
    return isDay ? 'Weather-rainy(day)' : 'Weather-rainy(night)';
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
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
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
                code: cur.weather_code,
                isDay: cur.is_day == null ? true : cur.is_day === 1,
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
        const shimmer = 'animate-[skeleton-shimmer_1.5s_ease-in-out_infinite] bg-[linear-gradient(90deg,#eaece8_25%,#fafafa_50%,#eaece8_75%)] bg-[length:200%_100%]';
        return (
            <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-8" aria-busy="true" aria-label="Loading weather data">
                <div className="flex items-start gap-6 pb-6 max-[767px]:justify-start">
                    <div className={`h-14 w-14 rounded-xl ${shimmer}`}></div>
                    <div className="flex-1">
                        <div className={`mb-2 h-10 w-[100px] rounded-md ${shimmer}`}></div>
                        <div className={`h-4 w-20 rounded-md ${shimmer}`} style={{ marginTop: 8 }}></div>
                        <div className={`h-3 w-[120px] rounded-md ${shimmer}`} style={{ marginTop: 8 }}></div>
                    </div>
                </div>
                <div className="flex gap-6 border-y border-[rgba(0,0,0,0.05)] py-4 max-[767px]:gap-4">
                    <div className={`h-4 w-[70px] rounded-md ${shimmer}`}></div>
                    <div className={`h-4 w-[70px] rounded-md ${shimmer}`}></div>
                    <div className={`h-4 w-[70px] rounded-md ${shimmer}`}></div>
                </div>
                <div className="mt-auto flex justify-between gap-1.5 pt-6 max-[767px]:justify-start max-[767px]:overflow-x-auto max-[767px]:pb-1 max-[767px]:[scrollbar-width:none] max-[767px]:[&::-webkit-scrollbar]:hidden">
                    <div className={`h-[72px] min-w-0 flex-1 rounded-[10px] ${shimmer}`}></div>
                    <div className={`h-[72px] min-w-0 flex-1 rounded-[10px] ${shimmer}`}></div>
                    <div className={`h-[72px] min-w-0 flex-1 rounded-[10px] ${shimmer}`}></div>
                    <div className={`h-[72px] min-w-0 flex-1 rounded-[10px] ${shimmer}`}></div>
                </div>
            </div>
        );
    }

    if (status === 'error' || !data) {
        return (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-12" role="alert">
                <div className="text-center">
                    <i className="bi bi-cloud-slash mb-4 block text-[2.5rem] text-muted-foreground opacity-50" aria-hidden="true"></i>
                    <p className="mb-6 text-sm text-muted-foreground">Weather data unavailable</p>
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-2 border-transparent bg-primary px-4 py-2 text-[0.8125rem] font-semibold text-white transition-all duration-200 hover:bg-[#2f6136] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(232, 153, 10,0.5)]"
                        onClick={() => load(true)}
                    >
                        <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex h-full flex-col rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] max-[767px]:rounded-xl max-[767px]:p-6" role="region" aria-label="Current weather in San Carlos">
            <div className="flex items-start gap-6 pb-6 max-[767px]:justify-start">
            <div className="text-[3rem] leading-none text-primary opacity-90 transition-transform duration-300 group-hover:scale-105 max-[767px]:text-[2.5rem]" aria-hidden="true">
                <AnimatedIcon
                    name={mapAnimatedIcon(data.code, data.isDay)}
                    size={56}
                    fallbackGlyph={data.icon}
                />
            </div>
                <div className="flex-1">
                    <div className="mb-1.5 text-[2.5rem] font-bold leading-none tracking-[-1px] text-foreground max-[767px]:text-[2rem]">{data.temperature}°C</div>
                    <div className="mb-1 text-[0.9375rem] font-medium text-foreground max-[767px]:text-sm">
                        {data.condition}
                        <span
                            className="align-middle text-[0.6rem] text-success"
                            title="Live data from Open-Meteo"
                            aria-label="Live data"
                        >
                            {' '}
                            ●
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <i className="bi bi-geo-alt text-[0.6875rem] text-primary" aria-hidden="true"></i> {t('weather-location')}
                    </div>
                </div>
            </div>

            <div className="flex gap-6 border-y border-[rgba(0,0,0,0.05)] py-4 max-[767px]:gap-4" role="list" aria-label="Weather details">
                <div className="flex items-center gap-1.5 text-[0.8125rem] max-[767px]:text-xs" role="listitem" aria-label={`Feels like ${data.feelsLike} degrees`}>
                    <i className="bi bi-thermometer-half text-sm text-primary opacity-80" aria-hidden="true"></i>
                    <span className="font-medium text-foreground">{data.feelsLike}°C</span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.8125rem] max-[767px]:text-xs" role="listitem" aria-label={`Humidity ${data.humidity} percent`}>
                    <i className="bi bi-droplet text-sm text-primary opacity-80" aria-hidden="true"></i>
                    <span className="font-medium text-foreground">{data.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.8125rem] max-[767px]:text-xs" role="listitem" aria-label={`Wind ${data.windSpeed} kilometers per hour`}>
                    <i className="bi bi-wind text-sm text-primary opacity-80" aria-hidden="true"></i>
                    <span className="font-medium text-foreground">{data.windSpeed} km/h</span>
                </div>
            </div>

            {data.hourly.length > 0 && (
                <div className="mt-auto flex justify-between gap-1.5 pt-6 max-[767px]:justify-start max-[767px]:overflow-x-auto max-[767px]:pb-1 max-[767px]:[scrollbar-width:none] max-[767px]:[&::-webkit-scrollbar]:hidden" role="list" aria-label="Hourly forecast">
                    {data.hourly.map((h, i) => (
                        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[10px] bg-muted px-2.5 py-2 transition-all duration-200 hover:-translate-y-px hover:bg-[rgba(58, 125, 68,0.06)] max-[767px]:min-w-16 max-[767px]:flex-none" role="listitem" key={i}>
                            <span className="text-[0.625rem] font-medium uppercase tracking-[0.3px] text-muted-foreground">{h.time}</span>
                            <i className={`bi ${h.icon} text-base text-primary opacity-85`} aria-hidden="true"></i>
                            <span className="text-[0.8125rem] font-semibold text-foreground">{h.temp}°</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
