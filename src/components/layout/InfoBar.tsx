'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DATE_FALLBACK = '--- --, ----';
const TIME_FALLBACK = '--:-- --';

// Manila wall-clock formatted exactly as the live ticker renders it. Runs
// synchronously (no network needed), so it is used for the initial state to
// avoid flashing the `--` placeholders on first paint before the interval
// effect fires. Falls back to the placeholders if the `timeZone` option is
// unsupported rather than throwing during render.
function getManilaNow(): { dateStr: string; timeStr: string } {
  try {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    let h = now.getHours();
    const m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return {
      dateStr: `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
      timeStr: `${h}:${m < 10 ? '0' + m : m} ${ampm}`,
    };
  } catch {
    // timeZone formatting unsupported: keep placeholders; the interval below retries.
    return { dateStr: DATE_FALLBACK, timeStr: TIME_FALLBACK };
  }
}

export default function InfoBar() {
  const [rate, setRate] = useState('1 USD = ₱ --');
  const [temp, setTemp] = useState('--°C');
  const [dateStr, setDateStr] = useState(() => getManilaNow().dateStr);
  const [timeStr, setTimeStr] = useState(() => getManilaNow().timeStr);

  const updateClock = useCallback(() => {
    const { dateStr: nextDate, timeStr: nextTime } = getManilaNow();
    setDateStr(nextDate);
    setTimeStr(nextTime);
  }, []);

  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [updateClock]);

  useEffect(() => {
    let mounted = true;

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => {
        if (!r.ok) throw new Error(`exchange-rate request failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Coerce via Number so a numeric-string payload still renders instead of
        // throwing on `.toFixed` and sticking at the `--` placeholder.
        const php = Number(data?.rates?.PHP);
        if (mounted && Number.isFinite(php)) setRate(`1 USD = ₱ ${php.toFixed(2)}`);
      })
      .catch(() => {
        // API/network failure: keep the placeholder rather than faking a value.
      });

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=15.928&longitude=120.349&current_weather=true'
    )
      .then((r) => {
        if (!r.ok) throw new Error(`weather request failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const celsius = Number(data?.current_weather?.temperature);
        if (mounted && Number.isFinite(celsius)) {
          setTemp(`${Math.round(celsius)}°C`);
        }
      })
      .catch(() => {
        // API/network failure: keep the placeholder rather than faking a value.
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Scroll-driven collapse without Motion: a zero-height sentinel at the very top
  // of the page (just under the sticky navbar, ~80px down) sits inside the viewport
  // while the page is at the top; once the user scrolls past the navbar height it
  // leaves the viewport -> collapse, and re-enters at the top -> re-expand.
  // Reduced motion: globals.css zeroes transition durations globally, so the
  // max-height/opacity change applies instantly without animation.
  const [collapsed, setCollapsed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setCollapsed(!entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-0"></div>
      <div
        className="flex items-center bg-[#275230] font-sans text-[0.6875rem] font-normal leading-none tracking-[0.01em] text-white transition-[max-height,opacity,padding] duration-300 ease-out overflow-hidden"
        style={{
          maxHeight: collapsed ? 0 : 40,
          opacity: collapsed ? 0 : 1,
          paddingTop: collapsed ? 0 : 6,
          paddingBottom: collapsed ? 0 : 6,
        }}
        role="complementary"
        aria-label="Real-time information"
      >
        <div className="mx-auto flex w-full items-center max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
          <div
            className="flex w-full flex-nowrap items-center justify-end gap-5 max-[1024px]:justify-center max-[1024px]:gap-4 max-[767px]:flex-nowrap max-[767px]:justify-center max-[767px]:gap-3"
            aria-live="polite"
            aria-atomic="false"
          >
            <div
              className="inline-flex items-center gap-[5px] text-white max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[575px]:gap-0.5 max-[575px]:text-[0.625rem]"
              aria-label="Exchange rates"
            >
              <i
                className="bi bi-currency-exchange text-xs leading-none text-[#ffff00] max-[575px]:text-[0.6875rem]"
                aria-hidden="true"
              />
              <span className="inline-block min-w-[110px] text-left max-[767px]:min-w-0">
                <span className="inline-block animate-[rateFadeIn_0.4s_ease-out] text-white">{rate}</span>
              </span>
            </div>
            <div
              className="inline-flex items-center gap-[5px] border-l border-white/15 pl-4 text-white max-[767px]:ml-2 max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[767px]:pl-2 max-[575px]:ml-1.5 max-[575px]:gap-0.5 max-[575px]:pl-1.5 max-[575px]:text-[0.625rem]"
              aria-label="Current weather in San Carlos"
            >
              <i
                className="bi bi-thermometer-half text-xs leading-none text-[#ffff00] max-[575px]:text-[0.6875rem]"
                aria-hidden="true"
              />
              <span className="font-normal text-white">San Carlos</span>
              <span className="font-normal text-white">{temp}</span>
            </div>
            <div
              className="inline-flex items-center gap-[5px] border-l border-white/15 pl-4 text-white max-[767px]:ml-2 max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[767px]:pl-2 max-[575px]:ml-1.5 max-[575px]:gap-0.5 max-[575px]:pl-1.5 max-[575px]:text-[0.625rem]"
              aria-label="Philippine Date and Time"
            >
              <i
                className="bi bi-calendar3 text-xs leading-none text-[#ffff00] max-[575px]:text-[0.6875rem]"
                aria-hidden="true"
              />
              {/* Live Manila clock: intentionally differs from the SSR HTML, so
              suppress the hydration warning — the 1s ticker owns this content. */}
              <span className="font-normal text-white" suppressHydrationWarning>{dateStr}</span>
              <span className="mx-0.5 text-[0.5rem] text-white max-[767px]:mx-px" aria-hidden="true">
                •
              </span>
              <i className="bi bi-clock text-xs leading-none text-[#ffff00] max-[575px]:text-[0.6875rem]" aria-hidden="true" />
              <span
                className="font-medium tabular-nums text-white"
                suppressHydrationWarning
              >
                {timeStr}
              </span>
              <span className="text-[0.625rem] font-normal uppercase tracking-[0.5px] text-white max-[575px]:text-[0.5625rem]">
                PHT
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
