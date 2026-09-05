'use client';

import { useState, useEffect, useCallback } from 'react';

export default function InfoBar() {
  const [rate, setRate] = useState('1 USD = ₱ --');
  const [temp, setTemp] = useState('--°C');
  const [dateStr, setDateStr] = useState('--- --, ----');
  const [timeStr, setTimeStr] = useState('--:-- --');

  const updateClock = useCallback(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const months = [
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
    setDateStr(`${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
    let h = now.getHours();
    const m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    setTimeStr(`${h}:${m < 10 ? '0' + m : m} ${ampm}`);
  }, []);

  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [updateClock]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates?.PHP) setRate(`1 USD = ₱ ${data.rates.PHP.toFixed(2)}`);
      })
      .catch(() => { });

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=15.928&longitude=120.349&current_weather=true'
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.current_weather?.temperature != null) {
          setTemp(`${Math.round(data.current_weather.temperature)}°C`);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div className="bg-[#275230] py-1.5 font-sans text-[0.6875rem] font-normal tracking-[0.01em] text-white" role="complementary" aria-label="Real-time information">
      <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
        <div className="flex flex-wrap items-center justify-end gap-6 max-[1024px]:justify-center max-[767px]:flex-nowrap max-[767px]:justify-center max-[767px]:gap-0" aria-live="polite" aria-atomic="false">
          <div className="inline-flex items-center gap-[5px] text-white max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[575px]:gap-0.5 max-[575px]:text-[0.625rem]" aria-label="Exchange rates">
            <i className="bi bi-currency-exchange text-xs text-[#ffff00] max-[575px]:text-[0.6875rem]" aria-hidden="true" />
            <span className="inline-block min-w-[110px] text-left max-[767px]:min-w-0">
              <span className="inline-block animate-[rateFadeIn_0.4s_ease-out] text-white">{rate}</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-[5px] border-l border-white/15 pl-4 text-white max-[767px]:ml-2 max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[767px]:pl-2 max-[575px]:ml-1.5 max-[575px]:gap-0.5 max-[575px]:pl-1.5 max-[575px]:text-[0.625rem]" aria-label="Current weather in San Carlos">
            <i className="bi bi-thermometer-half text-xs text-[#ffff00] max-[575px]:text-[0.6875rem]" aria-hidden="true" />
            <span className="font-normal text-white">San Carlos</span>
            <span className="font-normal text-white">{temp}</span>
          </div>
          <div className="inline-flex items-center gap-[5px] border-l border-white/15 pl-4 text-white max-[767px]:ml-2 max-[767px]:gap-[3px] max-[767px]:whitespace-nowrap max-[767px]:pl-2 max-[575px]:ml-1.5 max-[575px]:gap-0.5 max-[575px]:pl-1.5 max-[575px]:text-[0.625rem]" aria-label="Philippine Date and Time">
            <i className="bi bi-calendar3 text-xs text-[#ffff00] max-[575px]:text-[0.6875rem]" aria-hidden="true" />
            <span className="font-normal text-white">{dateStr}</span>
            <span className="mx-0.5 text-[0.5rem] text-white max-[767px]:mx-px" aria-hidden="true">
              •
            </span>
            <i className="bi bi-clock text-xs text-[#ffff00] max-[575px]:text-[0.6875rem]" aria-hidden="true" />
            <span className="font-medium tabular-nums text-white">{timeStr}</span>
            <span className="text-[0.625rem] font-normal uppercase tracking-[0.5px] text-white max-[575px]:text-[0.5625rem]">PHT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
