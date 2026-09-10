'use client';

import { useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Chart from 'chart.js/auto';
import demographicsData from '@/data/demographics.json';
import cityProfile from '@/data/city-profile.json';
import competitiveIndex from '@/data/competitive-index.json';
import fiscalData from '@/data/fiscal_transparency.json';

const COLORS = {
    primary: '#3a7d44',
    primaryDark: '#2f6136',
    secondary: '#275230',
    accent: '#e8990a',
    success: '#3a7d44',
    info: '#0077BE',
    slate: '#2f3e46',
    danger: '#b02e2e',
};

// Verified 2020/2015 barangay populations from PSA 2020 CPH (data/demographics.json)
const barangayData = demographicsData.barangays.map((b) => ({
    name: b.name,
    pop: b.population_2020,
    pop2015: b.population_2015,
}));

const totalPopulation = demographicsData.population.total;

// PSA census series 1903-2020 (data/demographics.json)
const historicalData = {
    years: demographicsData.census_history.map((c) => c.year),
    populations: demographicsData.census_history.map((c) => c.population),
};

// Verified CMCI 2016-2019 (data/competitive-index.json, from DTI CMCI via Internet Archive)
interface CmciRankEntry {
    year: number;
    rank: number;
    basis?: string;
}
interface CmciScoreEntry {
    year: number;
    score: number;
    basis?: string;
}
interface CmciSubIndicator {
    name: string;
    rank: number;
    score: number;
}
interface CmciPillar {
    label: string;
    ranks: CmciRankEntry[];
    scores: CmciScoreEntry[];
    sub_indicators: CmciSubIndicator[];
}

const cmciYears = competitiveIndex.years as number[];
const cmciPillars = competitiveIndex.pillars as unknown as Record<string, CmciPillar>;

function rankAt(entries: CmciRankEntry[], year: number): number | null {
    const found = entries.find((e) => e.year === year);
    return found ? found.rank : null;
}
function scoreAt(entries: CmciScoreEntry[], year: number): number | null {
    const found = entries.find((e) => e.year === year);
    return found ? found.score : null;
}

// Pillar overview cards (2019 ranks with 2018 comparison for trend direction)
const cmciOverviewCards = [
    { pillarKey: 'economic_dynamism', icon: 'bi-graph-up-arrow', tab: 'economic-dynamism' },
    { pillarKey: 'government_efficiency', icon: 'bi-building-check', tab: 'government-efficiency' },
    { pillarKey: 'infrastructure', icon: 'bi-building-gear', tab: 'infrastructure' },
    { pillarKey: 'resiliency', icon: 'bi-shield-check', tab: 'resiliency' },
] as const;

function trendLabel(currentRank: number | null, previousRank: number | null): { icon: string; text: string; cls: string } {
    if (currentRank === null || previousRank === null) {
        return { icon: 'bi-dash', text: 'No prior data', cls: 'bg-[rgba(107,114,128,0.1)] px-2 py-[3px] text-[#6b7280]' };
    }
    if (currentRank < previousRank) {
        return { icon: 'bi-arrow-up', text: `up from #${previousRank}`, cls: 'bg-[rgba(34,197,94,0.1)] px-2 py-[3px] text-[#16a34a]' };
    }
    if (currentRank > previousRank) {
        return { icon: 'bi-arrow-down', text: `down from #${previousRank}`, cls: 'bg-[rgba(239,68,68,0.1)] px-2 py-[3px] text-[#dc2626]' };
    }
    return { icon: 'bi-dash', text: 'Stable', cls: 'bg-[rgba(107,114,128,0.1)] px-2 py-[3px] text-[#6b7280]' };
}

// Verified BLGF annual regular income series, FY2009-2016 (data/fiscal_transparency.json)
interface FiscalYear {
    year: number;
    annual_regular_income: number;
    change_pct?: number;
}
const fiscalYears = fiscalData.fiscal_years as FiscalYear[];
const latestFiscal = fiscalYears[fiscalYears.length - 1];

const chartColors = [COLORS.primary, COLORS.accent, COLORS.secondary, COLORS.info, COLORS.slate];
const distributionColors = [
    COLORS.primary,
    COLORS.accent,
    COLORS.secondary,
    COLORS.info,
    COLORS.slate,
    '#7fb069',
    COLORS.danger,
    '#a8d08d',
    '#5c6b73',
    '#005a8f',
];

function formatNumber(n: number): string {
    return n.toLocaleString('en-PH');
}

function animateCount(element: HTMLElement, target: number, duration = 800): void {
    const startTime = performance.now();
    function update(currentTime: number): void {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        element.textContent = current.toLocaleString('en-PH');
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('en-PH');
        }
    }
    requestAnimationFrame(update);
}

function useChart() {
    const chartsRef = useRef<Record<string, Chart | null>>({});
    useEffect(() => {
        return () => {
            Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
            chartsRef.current = {};
        };
    }, []);
    return chartsRef;
}

function createHistoricalChart(canvas: HTMLCanvasElement): Chart {
    const ctx = canvas.getContext('2d');
    const gradient = ctx!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(58, 125, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(58, 125, 68, 0)');
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: historicalData.years.map(String),
            datasets: [
                {
                    label: 'Population',
                    data: historicalData.populations,
                    borderColor: COLORS.primary,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: COLORS.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBorderWidth: 3,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' as any },
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(58, 125, 68, 0.95)',
                    titleFont: { size: 14, weight: 600 },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: { label: (ctx) => `Population: ${formatNumber(ctx.raw as number)}` },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 12 } } },
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 12 }, callback: (v) => `${(Number(v) / 1000).toFixed(0)}K` },
                },
            },
        },
    });
}

function createDistributionChart(canvas: HTMLCanvasElement): Chart {
    const top10 = barangayData.slice(0, 10);
    const othersPop = totalPopulation - top10.reduce((sum, b) => sum + b.pop, 0);
    return new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: [...top10.map((d) => d.name), 'Others'],
            datasets: [
                {
                    data: [...top10.map((d) => d.pop), othersPop],
                    backgroundColor: [...distributionColors, '#a8bca8'],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverBorderWidth: 3,
                    hoverOffset: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { animateRotate: true, animateScale: true, duration: 800, easing: 'easeOutQuart' as any },
            cutout: '55%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { boxWidth: 14, padding: 12, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' },
                },
                tooltip: {
                    backgroundColor: 'rgba(58, 125, 68, 0.95)',
                    titleFont: { size: 14, weight: 600 },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => {
                            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                            const pct = ((ctx.raw as number) / total) * 100;
                            return `${formatNumber(ctx.raw as number)} (${pct.toFixed(1)}%)`;
                        },
                    },
                },
            },
        },
    });
}

function createBarChart(canvas: HTMLCanvasElement): Chart {
    const sorted = [...barangayData].sort((a, b) => b.pop - a.pop);
    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: sorted.map((d) => d.name),
            datasets: [
                {
                    label: 'Population',
                    data: sorted.map((d) => d.pop),
                    backgroundColor: sorted.map((_, i) => {
                        const opacity = 1 - i * 0.03;
                        return `rgba(58, 125, 68, ${opacity})`;
                    }),
                    borderRadius: 4,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' as any, delay: (ctx) => (ctx.dataIndex || 0) * 50 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(58, 125, 68, 0.95)',
                    titleFont: { size: 14, weight: 600 },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: { label: (ctx) => `Population: ${formatNumber(ctx.raw as number)}` },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, callback: (v) => formatNumber(Number(v)) },
                },
                y: { grid: { display: false }, ticks: { font: { size: 11 } } },
            },
        },
    });
}

function createCMCIOverviewChart(canvas: HTMLCanvasElement): Chart {
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: cmciYears.map(String),
            datasets: Object.values(cmciPillars).map((pillar, i) => ({
                label: pillar.label,
                data: cmciYears.map((y) => rankAt(pillar.ranks, y)),
                borderColor: chartColors[i],
                backgroundColor: `${chartColors[i]}20`,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                spanGaps: false,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' as any },
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, padding: 16, font: { size: 11 }, usePointStyle: true },
                },
                tooltip: {
                    backgroundColor: 'rgba(58, 125, 68, 0.95)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) =>
                            ctx.raw !== null ? `${ctx.dataset.label}: rank #${ctx.raw} (of ${cmciYears[ctx.dataIndex]})` : `${ctx.dataset.label}: no data`,
                    },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                y: {
                    beginAtZero: true,
                    reverse: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, callback: (v) => `#${v}` },
                    title: { display: true, text: 'Category rank (lower is better)', font: { size: 11 } },
                },
            },
        },
    });
}

function createCMCIPillarChart(canvas: HTMLCanvasElement, pillarKey: string): Chart {
    const pillarData = cmciPillars[pillarKey];
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: cmciYears.map(String),
            datasets: [
                {
                    label: pillarData.label,
                    data: cmciYears.map((y) => rankAt(pillarData.ranks, y)),
                    borderColor: COLORS.primary,
                    backgroundColor: `${COLORS.primary}20`,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                    spanGaps: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' as any },
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, padding: 12, font: { size: 10 }, usePointStyle: true },
                },
                tooltip: {
                    backgroundColor: 'rgba(58, 125, 68, 0.95)',
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                        label: (ctx) =>
                            ctx.raw !== null ? `Rank #${ctx.raw} of Component Cities (${cmciYears[ctx.dataIndex]})` : 'No data',
                    },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: {
                    beginAtZero: true,
                    reverse: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 10 }, callback: (v) => `#${v}` },
                    title: { display: true, text: 'Category rank (lower is better)', font: { size: 10 } },
                },
            },
        },
    });
}

function useScrollAnimations() {
    const initializedRef = useRef<Set<Element>>(new Set());
    useEffect(() => {
        const animateBars = (container: Element): void => {
            container.querySelectorAll<HTMLElement>('.breakdown-segment').forEach((bar) => {
                const width = bar.dataset.width;
                if (width) {
                    setTimeout(() => { bar.style.width = `${width}%`; }, 300);
                }
            });
            container.querySelectorAll<HTMLElement>('.bar-wrap .bar').forEach((bar) => {
                const width = bar.dataset.width;
                if (width) {
                    setTimeout(() => { bar.style.width = `${width}%`; }, 100);
                }
            });
            container.querySelectorAll<HTMLElement>('.sc-fill').forEach((bar) => {
                const width = bar.dataset.width;
                if (width) {
                    setTimeout(() => { bar.style.width = `${width}%`; }, 200);
                }
            });
            container.querySelectorAll<HTMLElement>('.poverty-fill').forEach((bar) => {
                const width = bar.dataset.width;
                if (width) {
                    setTimeout(() => { bar.style.width = `${Number(width) * 10}%`; }, 300);
                }
            });
            container.querySelectorAll<HTMLElement>('.indicator-fill').forEach((bar) => {
                const value = bar.dataset.value;
                if (value) {
                    setTimeout(() => {
                        bar.style.setProperty('--fill-width', `${value}%`);
                        bar.classList.add('animated');
                    }, 100);
                }
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !initializedRef.current.has(entry.target)) {
                        initializedRef.current.add(entry.target);
                        const delay = Number((entry.target as HTMLElement).dataset.delay || 0);
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                            const countEl = entry.target.querySelector<HTMLElement>('[data-count]');
                            if (countEl) {
                                const target = parseInt(countEl.dataset.count || '0', 10);
                                animateCount(countEl, target);
                            }
                            animateBars(entry.target);
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll<HTMLElement>('.animate-on-scroll, .metric-card').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

function useCharts() {
    const chartsRef = useChart();
    useEffect(() => {
        const chartObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const canvas = entry.target as HTMLCanvasElement;
                        const id = canvas.id;
                        if (id === 'historicalLineChart' && !chartsRef.current.historical) {
                            chartsRef.current.historical = createHistoricalChart(canvas);
                        } else if (id === 'distributionPieChart' && !chartsRef.current.distribution) {
                            chartsRef.current.distribution = createDistributionChart(canvas);
                        } else if (id === 'populationBarChart' && !chartsRef.current.bar) {
                            chartsRef.current.bar = createBarChart(canvas);
                        }
                        chartObserver.unobserve(canvas);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll<HTMLCanvasElement>('canvas').forEach((canvas) => {
            if (
                canvas.id === 'historicalLineChart' ||
                canvas.id === 'distributionPieChart' ||
                canvas.id === 'populationBarChart'
            ) {
                chartObserver.observe(canvas);
            }
        });
        return () => chartObserver.disconnect();
    }, [chartsRef]);
    return chartsRef;
}

function useCMCITabs(chartsRef: React.MutableRefObject<Record<string, Chart | null>>) {
    useEffect(() => {
        const cmciSection = document.getElementById('competitive-index');
        if (!cmciSection) return;

        const initTabs = (): void => {
            const tabs = document.querySelectorAll<HTMLButtonElement>('.cmci-tab');
            const panels = document.querySelectorAll<HTMLElement>('.cmci-panel');
            if (!tabs.length) return;

            const animateCMCIBars = (container: Element): void => {
                container.querySelectorAll<HTMLElement>('.indicator-fill').forEach((bar) => {
                    const value = bar.dataset.value;
                    if (value) {
                        setTimeout(() => {
                            bar.style.setProperty('--fill-width', `${value}%`);
                            bar.classList.add('animated');
                        }, 100);
                    }
                });
            };

            tabs.forEach((tab) => {
                tab.addEventListener('click', () => {
                    const pillar = tab.dataset.pillar;
                    tabs.forEach((t) => t.classList.remove('active'));
                    tab.classList.add('active');
                    panels.forEach((p) => p.classList.remove('active'));
                    const activePanel = document.getElementById(`panel-${pillar}`);
                    if (activePanel) {
                        activePanel.classList.add('active');
                        if (pillar === 'overview' && !chartsRef.current.cmciOverview) {
                            const canvas = document.getElementById('cmciOverviewChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciOverview = createCMCIOverviewChart(canvas);
                        } else if (pillar === 'economic-dynamism' && !chartsRef.current.cmciEconomic) {
                            const canvas = document.getElementById('cmciEconomicChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciEconomic = createCMCIPillarChart(canvas, 'economic_dynamism');
                        } else if (pillar === 'government-efficiency' && !chartsRef.current.cmciGovernment) {
                            const canvas = document.getElementById('cmciGovernmentChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciGovernment = createCMCIPillarChart(canvas, 'government_efficiency');
                        } else if (pillar === 'infrastructure' && !chartsRef.current.cmciInfra) {
                            const canvas = document.getElementById('cmciInfraChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciInfra = createCMCIPillarChart(canvas, 'infrastructure');
                        } else if (pillar === 'resiliency' && !chartsRef.current.cmciResiliency) {
                            const canvas = document.getElementById('cmciResiliencyChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciResiliency = createCMCIPillarChart(canvas, 'resiliency');
                        }
                        animateCMCIBars(activePanel);
                    }
                });
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        initTabs();
                        const overviewCanvas = document.getElementById('cmciOverviewChart') as HTMLCanvasElement | null;
                        if (overviewCanvas && !chartsRef.current.cmciOverview) {
                            chartsRef.current.cmciOverview = createCMCIOverviewChart(overviewCanvas);
                        }
                        const overviewPanel = document.getElementById('panel-overview');
                        if (overviewPanel) {
                            overviewPanel.querySelectorAll<HTMLElement>('.indicator-fill').forEach((bar) => {
                                const value = bar.dataset.value;
                                if (value) {
                                    setTimeout(() => {
                                        bar.style.setProperty('--fill-width', `${value}%`);
                                        bar.classList.add('animated');
                                    }, 100);
                                }
                            });
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(cmciSection);
        return () => observer.disconnect();
    }, [chartsRef]);
}

function useEconomyCounters() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const countEl = entry.target.querySelector<HTMLElement>('[data-count]');
                        if (countEl) {
                            const target = parseInt(countEl.dataset.count || '0', 10);
                            animateCount(countEl, target, 800);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        document.querySelectorAll<HTMLElement>('.economy-card').forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, []);
}

export default function StatisticsPage() {
    useScrollAnimations();
    const chartsRef = useCharts();
    useCMCITabs(chartsRef);
    useEconomyCounters();

    const rankedBarangays = [...barangayData].sort((a, b) => b.pop - a.pop);
    const top10 = rankedBarangays.slice(0, 10);
    const remaining = rankedBarangays.slice(10);
    const maxPop = rankedBarangays[0].pop;

    const historicalGrowth =
        ((historicalData.populations[historicalData.populations.length - 1] - historicalData.populations[0]) /
            historicalData.populations[0]) *
        100;

    return (
        <>
            <PageHeader
                title="City Statistics"
                description="Data and statistics about San Carlos City, Pangasinan"
                badge={{ icon: 'bi bi-bar-chart-fill', label: 'City Data' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Statistics' },
                ]}
            />

            <section className="relative z-[2] mt-10 pb-[60px]">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="grid grid-cols-4 gap-5 max-[991px]:grid-cols-2 max-[575px]:grid-cols-1 max-[575px]:gap-3">
                        <div className="metric-card animate-on-scroll rounded-2xl border border-line bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="0">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary"><i className="bi bi-people-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]" data-count={totalPopulation}>0</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-foreground">Population</div>
                            <div className="text-[0.8125rem] text-muted-foreground">{demographicsData.population.year} Census (PSA)</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-line bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="100">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary"><i className="bi bi-geo-alt-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">{demographicsData.barangay_count}</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-foreground">Barangays</div>
                            <div className="text-[0.8125rem] text-muted-foreground">Administrative Units</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-line bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="200">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary"><i className="bi bi-rulers"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">{cityProfile.land_area_km2}</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-foreground">Land Area (km²)</div>
                            <div className="text-[0.8125rem] text-muted-foreground">Total City Area</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-line bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="300">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary"><i className="bi bi-award-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">{demographicsData.income_class}</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-foreground">Income Class</div>
                            <div className="text-[0.8125rem] text-muted-foreground">City Classification</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-cash-stack"></i> <span>Finance</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">City Income</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">Verified figures from BLGF and the PSA census</p>
                    </div>

                    <div className="mb-10 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
                        <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] p-6 text-white">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-white">
                                <i className="bi bi-graph-up-arrow text-[1rem]"></i>
                                <span>Annual Regular Income</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-white">₱{(latestFiscal.annual_regular_income / 1_000_000).toFixed(2)}M</div>
                            <div className="text-[0.8125rem] text-white">FY{latestFiscal.year} — latest verified BLGF figure</div>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-muted-foreground">
                                <i className="bi bi-house-door-fill text-[1rem]"></i>
                                <span>Households</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-foreground">{formatNumber(demographicsData.households.count)}</div>
                            <div className="text-[0.8125rem] text-muted-foreground">{demographicsData.households.year} Census (PSA)</div>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-muted-foreground">
                                <i className="bi bi-people-fill text-[1rem]"></i>
                                <span>Average Household Size</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-foreground">{demographicsData.households.average_size}</div>
                            <div className="text-[0.8125rem] text-muted-foreground">{demographicsData.households.year} Census (PSA)</div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://blgf.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Bureau of Local Government Finance (BLGF)
                        </a>
                        {" "}via PhilAtlas — full series on the{" "}
                        <a className="text-primary" href="/budget">Budget &amp; Transparency</a> page. FY2017 onward pending verification.
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-graph-up"></i> <span>Growth</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">Population Trends</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">Historical growth from PSA censuses, 1903 to 2020</p>
                    </div>

                    <div className="mb-10 flex flex-wrap items-center justify-center gap-6 max-[991px]:gap-4">
                        <div className="rounded-xl border border-line bg-white px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-muted-foreground">{historicalData.years[0]}</span>
                            <span className="block text-[1.5rem] font-bold text-foreground max-[575px]:text-[1.25rem]">{formatNumber(historicalData.populations[0])}</span>
                        </div>
                        <div className="text-[1.25rem] text-muted-foreground"><i className="bi bi-arrow-right"></i></div>
                        <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-white">{historicalData.years[historicalData.years.length - 1]}</span>
                            <span className="block text-[1.5rem] font-bold text-white max-[575px]:text-[1.25rem]">{formatNumber(totalPopulation)}</span>
                        </div>
                        <div className="rounded-xl border border-primary bg-[rgba(58, 125, 68,0.1)] px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-muted-foreground">Growth</span>
                            <span className="block text-[1.5rem] font-bold text-primary max-[575px]:text-[1.25rem]">+{historicalGrowth.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="relative h-[400px] rounded-xl border border-line bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                        <canvas id="historicalLineChart" className="max-h-full w-full"></canvas>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}— Census of Population and Housing
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-pie-chart-fill"></i>
                            <span>Distribution</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">Population by Barangay</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">2020 Census of Population and Housing, all {rankedBarangays.length} barangays</p>
                    </div>

                    <div className="grid grid-cols-2 items-start gap-10 max-[991px]:grid-cols-1">
                        <div className="h-[400px] rounded-xl border border-line bg-white p-6 max-[991px]:h-[350px]">
                            <canvas id="distributionPieChart" className="max-h-full w-full"></canvas>
                        </div>
                        <div className="flex flex-col gap-2">
                            {top10.map((b) => (
                                <div className={`grid items-center gap-3 rounded-lg border bg-white px-4 py-[10px] transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[575px]:gap-2 max-[575px]:px-3 max-[575px]:py-2 ${b.pop === maxPop ? 'grid-cols-[40px_120px_1fr_70px] border-l-[3px] border-line border-l-[#ffd700] max-[575px]:grid-cols-[32px_90px_1fr_60px]' : 'grid-cols-[40px_120px_1fr_70px] border-line max-[575px]:grid-cols-[32px_90px_1fr_60px]'}`} data-rank={b.pop === maxPop ? 1 : undefined} key={b.name}>
                                    <span className="text-[0.75rem] font-semibold text-muted-foreground">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="text-[0.875rem] font-medium text-foreground max-[575px]:text-[0.8125rem]">{b.name}</span>
                                    <div className="bar-wrap h-2 overflow-hidden rounded bg-muted">
                                        <div
                                            className="bar h-full w-0 rounded bg-primary transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="text-right text-[0.875rem] font-semibold text-foreground">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <details className="mt-6">
                        <summary className="cursor-pointer p-3 text-center font-medium text-primary">View all {rankedBarangays.length} barangays</summary>
                        <div className="mt-4 flex flex-col gap-2">
                            {remaining.map((b) => (
                                <div className="grid grid-cols-[40px_120px_1fr_70px] items-center gap-3 rounded-lg border border-line bg-white px-4 py-[10px] transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[575px]:grid-cols-[32px_90px_1fr_60px] max-[575px]:gap-2 max-[575px]:px-3 max-[575px]:py-2" key={b.name}>
                                    <span className="text-[0.75rem] font-semibold text-muted-foreground">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="text-[0.875rem] font-medium text-foreground max-[575px]:text-[0.8125rem]">{b.name}</span>
                                    <div className="bar-wrap h-2 overflow-hidden rounded bg-muted">
                                        <div
                                            className="bar h-full w-0 rounded bg-primary transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="text-right text-[0.875rem] font-semibold text-foreground">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </details>

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2020 Census of Population and Housing
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-briefcase-fill"></i>
                            <span>Economy</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">Economic Indicators</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">Key economic data based on DILG and agricultural profile</p>
                    </div>

                    <div className="mb-10 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-tree-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-foreground">MANGO &amp; BAMBOO</div>
                                <div className="mb-2 text-[0.875rem] text-muted-foreground">Identity Crops</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-primary">&quot;Mango-Bamboo Capital of the Philippines&quot;</div>
                            </div>
                        </div>
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-geo-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-foreground">AGRO-INDUSTRIAL</div>
                                <div className="mb-2 text-[0.875rem] text-muted-foreground">Economic Base</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-primary">Agriculture, commerce &amp; industry</div>
                            </div>
                        </div>
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-house-door-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-foreground" data-count={demographicsData.households.count}>0</div>
                                <div className="mb-2 text-[0.875rem] text-muted-foreground">Households</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-primary">{demographicsData.households.year} Census (PSA)</div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll rounded-xl border border-line bg-white p-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                        <h4 className="mb-4 text-[1rem] font-bold text-foreground">Economic Sectors</h4>
                        <p className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-hourglass-split"></i> Sector shares pending verification
                        </p>
                        <div className="flex flex-col gap-[14px]">
                            <div className="flex items-center gap-[10px] rounded-lg bg-muted px-4 py-[14px] max-[575px]:px-[14px] max-[575px]:py-3">
                                <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-primary"></span>
                                <span className="text-[0.875rem] font-semibold text-foreground">Agriculture</span>
                            </div>
                            <div className="flex items-center gap-[10px] rounded-lg bg-muted px-4 py-[14px] max-[575px]:px-[14px] max-[575px]:py-3">
                                <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-info"></span>
                                <span className="text-[0.875rem] font-semibold text-foreground">Trade &amp; Commerce</span>
                            </div>
                            <div className="flex items-center gap-[10px] rounded-lg bg-muted px-4 py-[14px] max-[575px]:px-[14px] max-[575px]:py-3">
                                <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-text-light"></span>
                                <span className="text-[0.875rem] font-semibold text-foreground">Services</span>
                            </div>
                            <div className="flex items-center gap-[10px] rounded-lg bg-muted px-4 py-[14px] max-[575px]:px-[14px] max-[575px]:py-3">
                                <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-accent"></span>
                                <span className="text-[0.875rem] font-semibold text-foreground">Industry</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Sources:{" "}
                        <a className="text-primary" href="https://sancarlospangasinan.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Official LGU website
                        </a>
                        {" "}and{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            PSA {demographicsData.households.year} Census
                        </a>
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-graph-down-arrow"></i>
                            <span>Poverty</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">Poverty Statistics</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">City-level poverty estimates for San Carlos City</p>
                    </div>

                    <div className="mx-auto max-w-[720px] rounded-xl border border-line bg-white p-8 text-center">
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-hourglass-split"></i> Pending verification
                        </span>
                        <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                            City-level poverty incidence figures for San Carlos City are being re-verified against official
                            Philippine Statistics Authority releases before publication. Previously displayed figures could not
                            be confirmed as belonging to this city, so they have been withheld.
                        </p>
                        <p className="mt-4 mb-0 text-[0.8125rem] text-muted-foreground">
                            <i className="bi bi-info-circle mr-1"></i> Source when published:{" "}
                            <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                                Philippine Statistics Authority (PSA)
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            <section className="animate-on-scroll bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100" id="competitive-index">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-trophy-fill"></i>
                            <span>Competitiveness</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">San Carlos Competitive Index</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">
                            Cities and Municipalities Competitiveness Index (CMCI) Performance 2016-2019, Component City category
                        </p>
                        <p className="mt-3 mb-0 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-archive"></i> 2016-2019 data — last CMCI data update 2019 (re-verify when cmci.dti.gov.ph is back online)
                        </p>
                    </div>

                    <div className="mb-8 flex flex-wrap justify-center gap-2 max-[768px]:flex-col">
                        <button type="button" className="cmci-tab active inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="overview">
                            <i className="bi bi-grid-3x3-gap text-[1rem]"></i> <span>Overview</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="economic-dynamism">
                            <i className="bi bi-graph-up-arrow text-[1rem]"></i>
                            <span>Economic Dynamism</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="government-efficiency">
                            <i className="bi bi-building-check text-[1rem]"></i>
                            <span>Government Efficiency</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="infrastructure">
                            <i className="bi bi-building-gear text-[1rem]"></i>
                            <span>Infrastructure</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="resiliency">
                            <i className="bi bi-shield-check text-[1rem]"></i>
                            <span>Resiliency</span>
                        </button>
                    </div>

                    <div className="cmci-panel active hidden [&.active]:block" id="panel-overview">
                        <div className="mb-6 grid grid-cols-4 gap-4 max-[1200px]:grid-cols-2 max-[575px]:grid-cols-1">
                            {cmciOverviewCards.map((card) => {
                                const pillar = cmciPillars[card.pillarKey];
                                const currentRank = rankAt(pillar.ranks, 2019);
                                const previousRank = rankAt(pillar.ranks, 2018);
                                const trend = trendLabel(currentRank, previousRank);
                                return (
                                    <div key={card.pillarKey} className="cursor-pointer rounded-xl border border-line bg-white p-5 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]" data-pillar={card.tab}>
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><i className={`${card.icon} text-[1.25rem] text-primary`}></i></div>
                                        <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-foreground">{pillar.label}</h4>
                                        <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">{currentRank !== null ? `#${currentRank}` : '—'}</div>
                                        <div className={`inline-flex items-center gap-1 rounded-full text-[0.6875rem] font-semibold ${trend.cls}`}><i className={trend.icon}></i> {trend.text}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mb-6 grid grid-cols-4 gap-4 max-[1200px]:grid-cols-2 max-[575px]:grid-cols-2">
                            {competitiveIndex.overall.ranks.map((entry) => (
                                <div key={entry.year} className="rounded-xl border border-line bg-white p-4 text-center">
                                    <div className="text-[0.6875rem] font-semibold tracking-[0.5px] text-muted-foreground uppercase">{entry.year}</div>
                                    <div className="text-[1.375rem] font-bold text-foreground">#{entry.rank}</div>
                                    <div className="text-[0.6875rem] text-muted-foreground">Overall rank ({entry.basis})</div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border border-line bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-bar-chart-line"></i>
                                <span>Pillar Ranks (2016-2019)</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-line bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciOverviewChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    {([
                        { tab: 'economic-dynamism', pillarKey: 'economic_dynamism', canvasId: 'cmciEconomicChart' },
                        { tab: 'government-efficiency', pillarKey: 'government_efficiency', canvasId: 'cmciGovernmentChart' },
                        { tab: 'infrastructure', pillarKey: 'infrastructure', canvasId: 'cmciInfraChart' },
                        { tab: 'resiliency', pillarKey: 'resiliency', canvasId: 'cmciResiliencyChart' },
                    ] as const).map(({ tab, pillarKey, canvasId }) => {
                        const pillar = cmciPillars[pillarKey];
                        const latestScore = scoreAt(pillar.scores, 2019);
                        return (
                            <div key={tab} className="cmci-panel hidden [&.active]:block" id={`panel-${tab}`}>
                                <div className="mb-6 grid grid-cols-3 gap-3 max-[991px]:grid-cols-1">
                                    {cmciYears.map((y) => {
                                        const r = rankAt(pillar.ranks, y);
                                        const s = scoreAt(pillar.scores, y);
                                        return (
                                            <div key={y} className="rounded-lg border border-line bg-white p-4 text-center transition-[box-shadow] duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                                <div className="mb-1 text-[0.6875rem] font-semibold tracking-[0.5px] text-muted-foreground uppercase">{y}</div>
                                                <div className="text-[1.25rem] font-bold text-foreground">{r !== null ? `Rank #${r}` : '—'}</div>
                                                <div className="text-[0.75rem] text-muted-foreground">{s !== null ? `Score ${s.toFixed(4)}` : 'Score not published'}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {pillar.sub_indicators.length > 0 ? (
                                    <div className="mb-6 rounded-xl border border-line bg-white p-6">
                                        <h4 className="mb-1 flex flex-wrap items-center gap-2 text-[0.9375rem] font-semibold text-foreground [&_i]:text-primary">
                                            <i className="bi bi-list-check"></i>
                                            <span>Sub-indicators (2019)</span>
                                        </h4>
                                        <p className="mb-4 m-0 text-[0.8125rem] text-muted-foreground">Rank among Component Cities · indicator score</p>
                                        <div className="grid grid-cols-4 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                                            {pillar.sub_indicators.map((ind) => (
                                                <div key={ind.name} className="rounded-lg border border-line bg-white p-4">
                                                    <div className="mb-1.5 text-[0.75rem] font-semibold leading-[1.3] text-foreground">{ind.name}</div>
                                                    <div className="text-[1.125rem] font-bold text-primary">#{ind.rank}</div>
                                                    <div className="text-[0.75rem] text-muted-foreground">score {ind.score.toFixed(4)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 rounded-xl border border-line bg-white p-6 text-center">
                                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
                                            <i className="bi bi-hourglass-split"></i> Sub-indicator breakdown not available in the archived {latestScore !== null ? '2019' : ''} capture
                                        </span>
                                        <p className="m-0 text-[0.8125rem] text-muted-foreground">
                                            The Internet Archive snapshot of the CMCI profile only published pillar-level ranks for {pillar.label.toLowerCase()}.
                                        </p>
                                    </div>
                                )}
                                <div className="rounded-xl border border-line bg-white p-6">
                                    <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-foreground [&_i]:text-primary">
                                        <i className="bi bi-graph-up"></i>
                                        <span>{pillar.label} Rank Trend</span>
                                    </h4>
                                    <div className="relative h-[400px] rounded-xl border border-line bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                        <canvas id={canvasId} className="max-h-full w-full"></canvas>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://web.archive.org/web/20191211063050/https://cmci.dti.gov.ph/pages/profile/?lgu=San%20Carlos%20(PS)" target="_blank" rel="noopener noreferrer">
                            DTI Cities and Municipalities Competitiveness Index (CMCI)
                        </a>
                        {" "}— archived 2019 capture (live portal offline at research time)
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6 opacity-0 translate-y-[40px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-bar-chart-fill"></i>
                            <span>Visual</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-foreground max-[575px]:text-[1.5rem]">Population Bar Chart</h2>
                        <p className="m-0 text-[1rem] text-muted-foreground">Comparative view of all {rankedBarangays.length} barangays</p>
                    </div>

                    <div className="relative h-[600px] rounded-xl border border-line bg-white p-6 max-[575px]:h-[500px] max-[575px]:p-4">
                        <canvas id="populationBarChart" className="max-h-full w-full"></canvas>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2020 Census of Population and Housing
                    </p>
                </div>
            </section>
        </>
    );
}
