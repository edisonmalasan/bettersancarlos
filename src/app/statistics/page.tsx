'use client';

import { useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Chart from 'chart.js/auto';

const COLORS = {
    primary: '#3a7d44',
    primaryDark: '#2f6136',
    secondary: '#275230',
    accent: '#e8990a',
    success: '#3a7d44',
    info: '#0077BE',
};

const barangayData = [
    { name: 'Poblacion', pop: 6759 },
    { name: 'San Jose', pop: 3698 },
    { name: 'Lintugop', pop: 2636 },
    { name: 'Libertad', pop: 2524 },
    { name: 'Anonang', pop: 1772 },
    { name: 'Romarate', pop: 1681 },
    { name: 'Gubaan', pop: 1636 },
    { name: 'Lantungan', pop: 1546 },
    { name: 'Bayabas', pop: 1530 },
    { name: 'Balintawak', pop: 1527 },
    { name: 'Balide', pop: 1452 },
    { name: 'Balas', pop: 1374 },
    { name: 'Campo Uno', pop: 1347 },
    { name: 'Monte Alegre', pop: 1195 },
    { name: 'Sapa Loboc', pop: 1183 },
    { name: 'Acad', pop: 1179 },
    { name: 'Commonwealth', pop: 1179 },
    { name: 'Tagulalo', pop: 1051 },
    { name: 'Kahayagan East', pop: 1032 },
    { name: 'Cabilinan', pop: 1011 },
    { name: 'Inasagan', pop: 975 },
    { name: 'Mahayahay', pop: 975 },
    { name: 'La Victoria', pop: 906 },
    { name: 'Waterfall', pop: 861 },
    { name: 'Alang-alang', pop: 840 },
    { name: 'Bagong Maslog', pop: 816 },
    { name: 'Kahayagan West', pop: 780 },
    { name: 'Montela', pop: 779 },
    { name: 'San Juan', pop: 764 },
    { name: 'Kauswagan', pop: 757 },
    { name: 'Maguikay', pop: 717 },
    { name: 'La Paz', pop: 708 },
    { name: 'Bagong Oslob', pop: 705 },
    { name: 'Lubid', pop: 661 },
    { name: 'Bemposa', pop: 614 },
    { name: 'Resthouse', pop: 506 },
    { name: 'Bagong Mandaue', pop: 493 },
    { name: 'Inroad', pop: 450 },
    { name: 'Alegria', pop: 426 },
    { name: 'Panaghiusa', pop: 407 },
    { name: 'Ceboneg', pop: 373 },
    { name: 'Bagong Pitogo', pop: 371 },
    { name: 'Baki', pop: 295 },
    { name: 'Napo', pop: 255 },
];

const totalPopulation = 52746;

const historicalData = {
    years: [1990, 1995, 2000, 2007, 2010, 2015, 2020, 2024],
    populations: [31868, 35586, 38905, 42101, 43705, 46278, 50073, 52746],
};

const cmciData = {
    years: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    pillars: {
        economicDynamism: {
            labels: ['Local Economy Size', 'Economy Growth', 'Active Establishments', 'Safety Compliant', 'Employment'],
            data: [
                [0.4353, 0.1829, 0.1004, 0.042, 0.0328, 0.0935, 0.0344, 0.0571, 0.0259],
                [0.0847, 0.003, 0.0081, 0.0028, 0.3297, 0.0026, 0.0, 0.0005, 0.0318],
                [null, 0.1411, 0.8263, 0.3719, 0.5391, 0.5346, 0.5349, 0.5154, 0.4994],
                [null, 0.2991, 0.3683, 0.2471, 0.247, 0.2629, 0.0, 0.248, 0.2235],
                [0.3157, 0.1756, 0.1604, 0.1599, 0.1807, 0.1636, 0.1433, 0.1485, 0.3835],
            ],
        },
        governmentEfficiency: {
            labels: ['Cost of Living', 'Cost of Business', 'Financial Deepening', 'Productivity', 'Compliance'],
            data: [
                [2.6667, 1.6216, 1.3889, 1.1508, 0.8621, 0.4063, 1.6635, 1.1905, 1.1919],
                [2.2968, 2.2431, 2.1045, 1.9988, 2.1827, 2.1901, 1.8629, 1.546, 1.5599],
                [2.2418, 1.5657, 0.2448, 0.7057, 0.8357, 0.7899, 1.1689, 1.1263, 0.8288],
                [0.0062, 0.0339, 0.0083, 0.004, 0.1654, 0.2272, 0.1243, 0.1451, 0.3297],
                [3.0994, 2.1474, 0.0, 2.45, 2.5, 2.381, 1.8929, 1.9565, 1.96],
            ],
        },
        infrastructure: {
            labels: ['Road Network', 'Distance to Ports', 'Basic Utilities', 'Transportation', 'IT Capacity'],
            data: [
                [0.0019, 0.0003, 0.0, 0.009, 0.0021, 0.0235, 0.0015, 0.0016, 0.0016],
                [2.3543, 1.8319, 0.0, 1.6595, 2.4576, 2.4658, 1.3088, 1.562, 1.5281],
                [3.3333, 2.5, 0.0, 1.8498, 2.475, 2.4714, 0.0037, 0.6363, 0.356],
                [0.4063, 0.2816, 0.0, 0.0343, 0.0221, 0.0153, 0.023, 0.0636, 0.0959],
                [1.4638, 0.4, 0.0, 0.1278, 0.3108, 0.2727, 0.0617, 0.1674, 0.0155],
            ],
        },
        resiliency: {
            labels: ['DRR Plan', 'Disaster Drill', 'Early Warning', 'DRRMP Budget', 'Risk Assessments'],
            data: [
                [null, 2.5, 0.0, 2.4537, 2.5, 2.4474, 1.9995, 1.9583, 1.9783],
                [null, 2.5, 0.0, 2.25, 2.5, 1.2583, 1.002, 1.0016, 1.0023],
                [null, 2.5, 0.0, 2.5, 2.5, 1.2573, 1.0062, 1.0033, 1.0397],
                [null, 0.0022, 0.0, 0.2655, 0.1649, 0.0183, 0.0, 0.0699, 0.002],
                [null, 2.5, 0.0, 2.5, 2.5, 2.5, 2.0, 2.0, 2.0],
            ],
        },
        innovation: {
            labels: ['ICT Plan', 'R&D Expenditures', 'E-BPLS Software', 'STEM Graduates', 'Innovation Facilities'],
            data: [
                [null, null, null, null, null, null, 1.3334, 2.0001, 2.0001],
                [null, null, null, null, null, null, 0.0, 0.0, 0.0006],
                [null, null, null, null, null, null, 2.0, 0.0, 2.0],
                [null, null, null, null, null, null, 0.0039, 0.0052, 0.0181],
                [null, null, null, null, null, null, 0.0392, 0.1669, 0.0227],
            ],
        },
    },
    keyIndicators: {
        labels: ['Health', 'Education', 'Social Protection', 'Peace & Order', 'LGU Investment'],
        data: [
            [0.7476, 0.5608, 0.0, 0.3946, 0.3941, 0.469, 0.3219, 0.2037, 0.2995],
            [0.0605, 0.0992, 0.0, 0.0348, 0.1006, 0.0231, 0.1263, 0.0764, 0.1341],
            [0.2988, 0.2421, 0.0, 0.2778, 0.2845, 0.4097, 0.0011, 0.2567, 0.4923],
            [0.0638, 0.408, 0.0, 0.0395, 0.0347, 0.0649, 0.0, 0.2571, 0.1031],
            [2.4381, 0.2859, 0.0, 0.2648, 0.1597, 0.0191, 0.0, 0.0016, 0.0108],
        ],
    },
};

const chartColors = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.info, '#8B5CF6'];
const distributionColors = [
    COLORS.primary,
    COLORS.accent,
    COLORS.success,
    COLORS.info,
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F59E0B',
    '#6366F1',
    COLORS.secondary,
];

function formatNumber(n: number): string {
    return n.toLocaleString('en-PH');
}

function animateCount(element: HTMLElement, target: number, duration = 2000): void {
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
            animation: { duration: 2000, easing: 'easeOutQuart' as any },
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
                    backgroundColor: [...distributionColors, '#CBD5E1'],
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
            animation: { animateRotate: true, animateScale: true, duration: 1500, easing: 'easeOutQuart' as any },
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
            animation: { duration: 1500, easing: 'easeOutQuart' as any, delay: (ctx) => (ctx.dataIndex || 0) * 50 },
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
            labels: cmciData.years,
            datasets: cmciData.keyIndicators.labels.map((label, i) => ({
                label,
                data: cmciData.keyIndicators.data[i],
                borderColor: chartColors[i],
                backgroundColor: `${chartColors[i]}20`,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: 'easeOutQuart' as any },
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
                            ctx.raw !== null ? `${ctx.dataset.label}: ${Number(ctx.raw).toFixed(4)}` : `${ctx.dataset.label}: N/A`,
                    },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
            },
        },
    });
}

function createCMCIPillarChart(canvas: HTMLCanvasElement, pillarKey: keyof typeof cmciData.pillars): Chart {
    const pillarData = cmciData.pillars[pillarKey];
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: cmciData.years,
            datasets: pillarData.labels.map((label, i) => ({
                label,
                data: pillarData.data[i],
                borderColor: chartColors[i],
                backgroundColor: `${chartColors[i]}20`,
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 2,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: 'easeOutQuart' as any },
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
                            ctx.raw !== null ? `${ctx.dataset.label}: ${Number(ctx.raw).toFixed(4)}` : `${ctx.dataset.label}: N/A`,
                    },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
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
                            if (canvas) chartsRef.current.cmciEconomic = createCMCIPillarChart(canvas, 'economicDynamism');
                        } else if (pillar === 'government-efficiency' && !chartsRef.current.cmciGovernment) {
                            const canvas = document.getElementById('cmciGovernmentChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciGovernment = createCMCIPillarChart(canvas, 'governmentEfficiency');
                        } else if (pillar === 'infrastructure' && !chartsRef.current.cmciInfra) {
                            const canvas = document.getElementById('cmciInfraChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciInfra = createCMCIPillarChart(canvas, 'infrastructure');
                        } else if (pillar === 'resiliency' && !chartsRef.current.cmciResiliency) {
                            const canvas = document.getElementById('cmciResiliencyChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciResiliency = createCMCIPillarChart(canvas, 'resiliency');
                        } else if (pillar === 'innovation' && !chartsRef.current.cmciInnovation) {
                            const canvas = document.getElementById('cmciInnovationChart') as HTMLCanvasElement | null;
                            if (canvas) chartsRef.current.cmciInnovation = createCMCIPillarChart(canvas, 'innovation');
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
                            animateCount(countEl, target, 1500);
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
                title="Municipal Statistics"
                description="Data and statistics about San Carlos City, Pangasinan"
                badge={{ icon: 'bi bi-bar-chart-fill', label: 'Municipal Data' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Statistics' },
                ]}
            />

            <section className="relative z-[2] mt-10 pb-[60px]">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="grid grid-cols-4 gap-5 max-[991px]:grid-cols-2 max-[575px]:grid-cols-1 max-[575px]:gap-3">
                        <div className="metric-card animate-on-scroll rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="0">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.5rem] text-white"><i className="bi bi-people-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]" data-count="52746">0</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-[#1a1a1a]">Population</div>
                            <div className="text-[0.8125rem] text-[#666666]">2024 Census</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="100">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.5rem] text-white"><i className="bi bi-geo-alt-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">44</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-[#1a1a1a]">Barangays</div>
                            <div className="text-[0.8125rem] text-[#666666]">Administrative Units</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="200">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.5rem] text-white"><i className="bi bi-rulers"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">180.95</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-[#1a1a1a]">Land Area (km²)</div>
                            <div className="text-[0.8125rem] text-[#666666]">Total Municipal Area</div>
                        </div>
                        <div className="metric-card animate-on-scroll rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white px-6 py-[28px] text-center opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)] translate-y-[30px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.12)] max-[575px]:p-5 [&.visible]:translate-y-0 [&.visible]:opacity-100" data-delay="300">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.5rem] text-white"><i className="bi bi-award-fill"></i></div>
                            <div className="mb-1 text-[2rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">2nd</div>
                            <div className="mb-1 text-[0.9375rem] font-semibold text-[#1a1a1a]">Income Class</div>
                            <div className="text-[0.8125rem] text-[#666666]">Municipality Classification</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-cash-stack"></i> <span>Finance</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Municipal Income</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">Financial standing based on latest available LGU data</p>
                    </div>

                    <div className="mb-10 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
                        <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] p-6 text-white transition-all duration-300">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-white">
                                <i className="bi bi-graph-up-arrow text-[1rem]"></i>
                                <span>Annual Income</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-white">₱220.77M</div>
                            <div className="text-[0.8125rem] text-white">Projected baseline from national LGU data</div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_4px_20px_rgba(58, 125, 68,0.1)]">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-[#666666]">
                                <i className="bi bi-bank text-[1rem]"></i>
                                <span>IRA Share</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-[#1a1a1a]">₱131.26M</div>
                            <div className="text-[0.8125rem] text-[#666666]">Internal Revenue Allotment</div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_4px_20px_rgba(58, 125, 68,0.1)]">
                            <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-[#666666]">
                                <i className="bi bi-pie-chart-fill text-[1rem]"></i>
                                <span>IRA Dependency</span>
                            </div>
                            <div className="mb-1 text-[1.75rem] font-bold text-[#1a1a1a]">59.45%</div>
                            <div className="text-[0.8125rem] text-[#666666]">National Tax Share</div>
                        </div>
                    </div>

                    <div className="animate-on-scroll rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                        <h4 className="mb-4 text-[1rem] font-bold text-[#1a1a1a]">Income Composition</h4>
                        <div className="flex h-12 overflow-hidden rounded-lg bg-[#f8f9fa]">
                            <div className="breakdown-segment flex w-0 items-center justify-center bg-[linear-gradient(90deg,#0077BE_0%,#005a8f_100%)] transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" data-width="59.45">
                                <span className="text-[0.8125rem] font-semibold whitespace-nowrap text-white">IRA 59.45%</span>
                            </div>
                            <div className="breakdown-segment flex w-0 items-center justify-center bg-[linear-gradient(90deg,#3a7d44_0%,#2f6136_100%)] transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" data-width="40.55">
                                <span className="text-[0.8125rem] font-semibold whitespace-nowrap text-white">Local 40.55%</span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center gap-8">
                            <div className="flex items-center gap-2 text-[0.875rem] text-[#1a1a1a]">
                                <span className="h-3 w-3 rounded-[3px] bg-[#0077BE]"></span>Internal Revenue Allotment
                            </div>
                            <div className="flex items-center gap-2 text-[0.875rem] text-[#1a1a1a]">
                                <span className="h-3 w-3 rounded-[3px] bg-[#3a7d44]"></span>Local Sources
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://blgf.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Bureau of Local Government Finance (BLGF)
                        </a>
                        {" "}– LGU fiscal estimates
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-[#f8f9fa] py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-graph-up"></i> <span>Growth</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Population Trends</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">Historical growth from 1990 to 2024</p>
                    </div>

                    <div className="mb-10 flex flex-wrap items-center justify-center gap-6 max-[991px]:gap-4">
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-[#666666]">1990</span>
                            <span className="block text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">{formatNumber(historicalData.populations[0])}</span>
                        </div>
                        <div className="text-[1.25rem] text-[#666666]"><i className="bi bi-arrow-right"></i></div>
                        <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-white">2024</span>
                            <span className="block text-[1.5rem] font-bold text-white max-[575px]:text-[1.25rem]">{formatNumber(totalPopulation)}</span>
                        </div>
                        <div className="rounded-xl border border-[#3a7d44] bg-[rgba(58, 125, 68,0.1)] px-8 py-5 text-center max-[991px]:px-6 max-[991px]:py-4 max-[575px]:px-5 max-[575px]:py-3">
                            <span className="mb-1 block text-[0.8125rem] text-[#666666]">Growth</span>
                            <span className="block text-[1.5rem] font-bold text-[#3a7d44] max-[575px]:text-[1.25rem]">+{historicalGrowth.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                        <canvas id="historicalLineChart" className="max-h-full w-full"></canvas>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-pie-chart-fill"></i>
                            <span>Distribution</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Population by Barangay</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">2024 Census of Population</p>
                    </div>

                    <div className="grid grid-cols-2 items-start gap-10 max-[991px]:grid-cols-1">
                        <div className="h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[991px]:h-[350px]">
                            <canvas id="distributionPieChart" className="max-h-full w-full"></canvas>
                        </div>
                        <div className="flex flex-col gap-2">
                            {top10.map((b) => (
                                <div className={`grid items-center gap-3 rounded-lg border bg-white px-4 py-[10px] transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[575px]:gap-2 max-[575px]:px-3 max-[575px]:py-2 ${b.pop === maxPop ? 'grid-cols-[40px_120px_1fr_70px] border-l-[3px] border-[rgba(0,0,0,0.04)] border-l-[#ffd700] max-[575px]:grid-cols-[32px_90px_1fr_60px]' : 'grid-cols-[40px_120px_1fr_70px] border-[rgba(0,0,0,0.04)] max-[575px]:grid-cols-[32px_90px_1fr_60px]'}`} data-rank={b.pop === maxPop ? 1 : undefined} key={b.name}>
                                    <span className="text-[0.75rem] font-semibold text-[#666666]">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="text-[0.875rem] font-medium text-[#1a1a1a] max-[575px]:text-[0.8125rem]">{b.name}</span>
                                    <div className="bar-wrap h-2 overflow-hidden rounded bg-[#f8f9fa]">
                                        <div
                                            className="bar h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#0077BE_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="text-right text-[0.875rem] font-semibold text-[#1a1a1a]">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <details className="mt-6">
                        <summary className="cursor-pointer p-3 text-center font-medium text-primary">View all {rankedBarangays.length} barangays</summary>
                        <div className="mt-4 flex flex-col gap-2">
                            {remaining.map((b) => (
                                <div className="grid grid-cols-[40px_120px_1fr_70px] items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.04)] bg-white px-4 py-[10px] transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[575px]:grid-cols-[32px_90px_1fr_60px] max-[575px]:gap-2 max-[575px]:px-3 max-[575px]:py-2" key={b.name}>
                                    <span className="text-[0.75rem] font-semibold text-[#666666]">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="text-[0.875rem] font-medium text-[#1a1a1a] max-[575px]:text-[0.8125rem]">{b.name}</span>
                                    <div className="bar-wrap h-2 overflow-hidden rounded bg-[#f8f9fa]">
                                        <div
                                            className="bar h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#0077BE_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="text-right text-[0.875rem] font-semibold text-[#1a1a1a]">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </details>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2024 Census
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-[#f8f9fa] py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-briefcase-fill"></i>
                            <span>Economy</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Economic Indicators</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">Key economic data based on DILG and agricultural profile</p>
                    </div>

                    <div className="mb-10 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_4px_20px_rgba(58, 125, 68,0.1)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.25rem] text-white"><i className="bi bi-tree-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-[#1a1a1a]">COCONUT</div>
                                <div className="mb-2 text-[0.875rem] text-[#666666]">Major Product</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-[#3a7d44]">Principal crop & trade</div>
                            </div>
                        </div>
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_4px_20px_rgba(58, 125, 68,0.1)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.25rem] text-white"><i className="bi bi-geo-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-[#1a1a1a]">AGRICULTURAL</div>
                                <div className="mb-2 text-[0.875rem] text-[#666666]">Major Land Use</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-[#3a7d44]">Farms & coconut plantations</div>
                            </div>
                        </div>
                        <div className="economy-card flex items-start gap-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_4px_20px_rgba(58, 125, 68,0.1)]">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.25rem] text-white"><i className="bi bi-house-door-fill"></i></div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 text-[1.5rem] font-bold text-[#1a1a1a]" data-count="9263">0</div>
                                <div className="mb-2 text-[0.875rem] text-[#666666]">Households</div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(58, 125, 68,0.1)] px-[10px] py-1 text-[0.75rem] text-[#3a7d44]">DILG municipal profile</div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] [&.visible]:translate-y-0 [&.visible]:opacity-100">
                        <h4 className="mb-4 text-[1rem] font-bold text-[#1a1a1a]">Economic Sectors</h4>
                        <div className="flex flex-col gap-[14px]">
                            <div className="group grid cursor-pointer grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-[10px] rounded-[10px] bg-[#f8f9fa] px-4 py-[14px] transition-[background,box-shadow] duration-200 hover:bg-[#eaf3ea] hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[575px]:px-[14px] max-[575px]:py-3">
                                <div className="col-start-1 row-start-1 flex items-center gap-[10px]">
                                    <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#10b981] transition-transform duration-200 group-hover:scale-[1.3]"></span>
                                    <span className="text-[0.875rem] font-semibold text-[#1a1a1a]">Agriculture</span>
                                </div>
                                <span className="col-start-2 row-start-1 text-right text-[0.875rem] font-bold text-primary transition-transform duration-200 group-hover:scale-[1.08]">70%</span>
                                <div className="col-span-full row-start-2 h-2 overflow-hidden rounded bg-[rgba(0,0,0,0.06)]">
                                    <div className="sc-fill h-full w-0 rounded bg-[#10b981] transition-[width,filter,box-shadow] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_0_8px_rgba(0,0,0,0.12)] group-hover:brightness-110" data-width="70"></div>
                                </div>
                            </div>
                            <div className="group grid cursor-pointer grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-[10px] rounded-[10px] bg-[#f8f9fa] px-4 py-[14px] transition-[background,box-shadow] duration-200 hover:bg-[#eaf3ea] hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[575px]:px-[14px] max-[575px]:py-3">
                                <div className="col-start-1 row-start-1 flex items-center gap-[10px]">
                                    <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#3b82f6] transition-transform duration-200 group-hover:scale-[1.3]"></span>
                                    <span className="text-[0.875rem] font-semibold text-[#1a1a1a]">Trade &amp; Commerce</span>
                                </div>
                                <span className="col-start-2 row-start-1 text-right text-[0.875rem] font-bold text-primary transition-transform duration-200 group-hover:scale-[1.08]">15%</span>
                                <div className="col-span-full row-start-2 h-2 overflow-hidden rounded bg-[rgba(0,0,0,0.06)]">
                                    <div className="sc-fill h-full w-0 rounded bg-[#3b82f6] transition-[width,filter,box-shadow] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_0_8px_rgba(0,0,0,0.12)] group-hover:brightness-110" data-width="15"></div>
                                </div>
                            </div>
                            <div className="group grid cursor-pointer grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-[10px] rounded-[10px] bg-[#f8f9fa] px-4 py-[14px] transition-[background,box-shadow] duration-200 hover:bg-[#eaf3ea] hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[575px]:px-[14px] max-[575px]:py-3">
                                <div className="col-start-1 row-start-1 flex items-center gap-[10px]">
                                    <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#8b5cf6] transition-transform duration-200 group-hover:scale-[1.3]"></span>
                                    <span className="text-[0.875rem] font-semibold text-[#1a1a1a]">Services</span>
                                </div>
                                <span className="col-start-2 row-start-1 text-right text-[0.875rem] font-bold text-primary transition-transform duration-200 group-hover:scale-[1.08]">10%</span>
                                <div className="col-span-full row-start-2 h-2 overflow-hidden rounded bg-[rgba(0,0,0,0.06)]">
                                    <div className="sc-fill h-full w-0 rounded bg-[#8b5cf6] transition-[width,filter,box-shadow] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_0_8px_rgba(0,0,0,0.12)] group-hover:brightness-110" data-width="10"></div>
                                </div>
                            </div>
                            <div className="group grid cursor-pointer grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-[10px] rounded-[10px] bg-[#f8f9fa] px-4 py-[14px] transition-[background,box-shadow] duration-200 hover:bg-[#eaf3ea] hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[575px]:px-[14px] max-[575px]:py-3">
                                <div className="col-start-1 row-start-1 flex items-center gap-[10px]">
                                    <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#f59e0b] transition-transform duration-200 group-hover:scale-[1.3]"></span>
                                    <span className="text-[0.875rem] font-semibold text-[#1a1a1a]">Industry</span>
                                </div>
                                <span className="col-start-2 row-start-1 text-right text-[0.875rem] font-bold text-primary transition-transform duration-200 group-hover:scale-[1.08]">5%</span>
                                <div className="col-span-full row-start-2 h-2 overflow-hidden rounded bg-[rgba(0,0,0,0.06)]">
                                    <div className="sc-fill h-full w-0 rounded bg-[#f59e0b] transition-[width,filter,box-shadow] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_0_8px_rgba(0,0,0,0.12)] group-hover:brightness-110" data-width="5"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://sancarlospangasinan.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Department of the Interior and Local Government (DILG) Region I
                        </a>
                        {" "}- San Carlos Municipal Profile
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-graph-down-arrow"></i>
                            <span>Poverty</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Poverty Statistics</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">2021 City and Municipal Level Poverty Estimates</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 max-[991px]:gap-5">
                        <div className="relative min-w-[200px] rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-8 text-center max-[575px]:min-w-[160px] max-[575px]:p-6">
                            <span className="mb-4 inline-block rounded-full bg-[#f8f9fa] px-3 py-1 text-[0.8125rem] font-semibold text-[#666666]">2018</span>
                            <div className="mb-4 flex items-baseline justify-center gap-[2px]">
                                <span className="text-[3rem] leading-[1] font-bold text-[#1a1a1a] max-[575px]:text-[2.5rem]">7.0</span>
                                <span className="text-[1.5rem] font-semibold text-[#666666]">%</span>
                            </div>
                            <div className="mb-3 h-2 overflow-hidden rounded bg-[#f8f9fa]"><div className="poverty-fill h-full w-0 rounded bg-primary transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" data-width="7"></div></div>
                            <span className="text-[0.75rem] text-[#666666]">90% CI: 4.7% - 9.2%</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[#666666]">
                            <i className="bi bi-arrow-right"></i>
                            <span className="text-[0.875rem] font-semibold text-[#3a7d44]">-0.6%</span>
                        </div>
                        <div className="relative min-w-[200px] rounded-2xl border border-[#3a7d44] bg-white p-8 text-center shadow-[0_4px_20px_rgba(58, 125, 68,0.15)] max-[575px]:min-w-[160px] max-[575px]:p-6">
                            <span className="mb-4 inline-block rounded-full bg-[rgba(58, 125, 68,0.1)] px-3 py-1 text-[0.8125rem] font-semibold text-[#3a7d44]">2021</span>
                            <div className="mb-4 flex items-baseline justify-center gap-[2px]">
                                <span className="text-[3rem] leading-[1] font-bold text-[#1a1a1a] max-[575px]:text-[2.5rem]">6.4</span>
                                <span className="text-[1.5rem] font-semibold text-[#666666]">%</span>
                            </div>
                            <div className="mb-3 h-2 overflow-hidden rounded bg-[#f8f9fa]"><div className="poverty-fill h-full w-0 rounded bg-[#3a7d44] transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" data-width="6.4"></div></div>
                            <span className="text-[0.75rem] text-[#666666]">90% CI: 4.7% - 8.1%</span>
                            <span className="absolute -top-[10px] -right-[10px] flex items-center gap-1 rounded-full bg-[#3a7d44] px-3 py-[6px] text-[0.75rem] font-semibold text-white">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Improved</span>
                            </span>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2021 Poverty Estimates
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-[#f8f9fa] py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100" id="competitive-index">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-trophy-fill"></i>
                            <span>Competitiveness</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">San Carlos Competitive Index</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">
                            Cities and Municipalities Competitiveness Index (CMCI) Performance 2016-2024
                        </p>
                    </div>

                    <div className="mb-8 flex flex-wrap justify-center gap-2 max-[768px]:flex-col">
                        <button type="button" className="cmci-tab active inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="overview">
                            <i className="bi bi-grid-3x3-gap text-[1rem]"></i> <span>Overview</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="economic-dynamism">
                            <i className="bi bi-graph-up-arrow text-[1rem]"></i>
                            <span>Economic Dynamism</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="government-efficiency">
                            <i className="bi bi-building-check text-[1rem]"></i>
                            <span>Government Efficiency</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="infrastructure">
                            <i className="bi bi-building-gear text-[1rem]"></i>
                            <span>Infrastructure</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="resiliency">
                            <i className="bi bi-shield-check text-[1rem]"></i>
                            <span>Resiliency</span>
                        </button>
                        <button type="button" className="cmci-tab inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-[18px] py-[10px] text-[0.8125rem] font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-primary hover:text-primary max-[768px]:justify-center [&.active]:border-primary [&.active]:bg-primary [&.active]:text-white" data-pillar="innovation">
                            <i className="bi bi-lightbulb text-[1rem]"></i> <span>Innovation</span>
                        </button>
                    </div>

                    <div className="cmci-panel active hidden [&.active]:block" id="panel-overview">
                        <div className="mb-8 grid grid-cols-5 gap-4 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)]" data-pillar="economic-dynamism">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]"><i className="bi bi-graph-up-arrow text-[1.25rem] text-white"></i></div>
                                <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-[#1a1a1a]">Economic Dynamism</h4>
                                <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">0.23</div>
                                <div className="inline-flex items-center gap-1 rounded-[20px] bg-[rgba(34,197,94,0.1)] px-2 py-[3px] text-[0.6875rem] font-semibold text-[#16a34a]"><i className="bi bi-arrow-up"></i> +12%</div>
                            </div>
                            <div className="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)]" data-pillar="government-efficiency">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]"><i className="bi bi-building-check text-[1.25rem] text-white"></i></div>
                                <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-[#1a1a1a]">Government Efficiency</h4>
                                <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">1.17</div>
                                <div className="inline-flex items-center gap-1 rounded-[20px] bg-[rgba(239,68,68,0.1)] px-2 py-[3px] text-[0.6875rem] font-semibold text-[#dc2626]"><i className="bi bi-arrow-down"></i> -8%</div>
                            </div>
                            <div className="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)]" data-pillar="infrastructure">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]"><i className="bi bi-building-gear text-[1.25rem] text-white"></i></div>
                                <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-[#1a1a1a]">Infrastructure</h4>
                                <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">0.40</div>
                                <div className="inline-flex items-center gap-1 rounded-[20px] bg-[rgba(34,197,94,0.1)] px-2 py-[3px] text-[0.6875rem] font-semibold text-[#16a34a]"><i className="bi bi-arrow-up"></i> +5%</div>
                            </div>
                            <div className="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)]" data-pillar="resiliency">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]"><i className="bi bi-shield-check text-[1.25rem] text-white"></i></div>
                                <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-[#1a1a1a]">Resiliency</h4>
                                <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">1.08</div>
                                <div className="inline-flex items-center gap-1 rounded-[20px] bg-[rgba(107,114,128,0.1)] px-2 py-[3px] text-[0.6875rem] font-semibold text-[#6b7280]"><i className="bi bi-dash"></i> Stable</div>
                            </div>
                            <div className="cursor-pointer rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)]" data-pillar="innovation">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]"><i className="bi bi-lightbulb text-[1.25rem] text-white"></i></div>
                                <h4 className="mb-2 text-[0.75rem] leading-[1.3] font-semibold text-[#1a1a1a]">Innovation</h4>
                                <div className="mb-1 text-[1.5rem] font-bold text-primary max-[768px]:text-[1.25rem]">0.68</div>
                                <div className="inline-flex items-center gap-1 rounded-[20px] bg-[rgba(34,197,94,0.1)] px-2 py-[3px] text-[0.6875rem] font-semibold text-[#16a34a]"><i className="bi bi-arrow-up"></i> +25%</div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-bar-chart-line"></i>
                                <span>Key Indicators Trend (2016-2024)</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciOverviewChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel hidden [&.active]:block" id="panel-economic-dynamism">
                        <div className="mb-7 grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-currency-exchange"></i> Local Economy Size
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0259</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="2.59"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-graph-up"></i> Local Economy Growth
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0318</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="3.18"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-shop"></i> Active Establishments</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.4994</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="49.94"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-shield-check"></i> Safety Compliant Business
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.2235</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="22.35"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-people"></i> Employment Generation
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.3835</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="38.35"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-graph-up"></i>
                                <span>Economic Dynamism Trend</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciEconomicChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel hidden [&.active]:block" id="panel-government-efficiency">
                        <div className="mb-7 grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-cash-coin"></i> Cost of Living</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.1919</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="47.68"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-briefcase"></i> Cost of Doing Business
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.5599</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="62.40"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-bank"></i> Financial Deepening</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.8288</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="33.15"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-speedometer2"></i> Productivity</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.3297</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="32.97"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-check2-square"></i> Compliance to Directives
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.9600</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="78.40"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-graph-up"></i>
                                <span>Government Efficiency Trend</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciGovernmentChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel hidden [&.active]:block" id="panel-infrastructure">
                        <div className="mb-7 grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-signpost-2"></i> Road Network</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0016</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="0.16"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-geo-alt"></i> Distance to Ports</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.5281</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="61.12"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-lightning-charge"></i> Basic Utilities
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.3560</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="14.24"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-truck"></i> Transportation</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0959</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="9.59"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-wifi"></i> IT Capacity</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0155</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="1.55"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-graph-up"></i>
                                <span>Infrastructure Trend</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciInfraChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel hidden [&.active]:block" id="panel-resiliency">
                        <div className="mb-7 grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-file-earmark-text"></i> DRR Plan</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.9783</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="79.13"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-calendar-event"></i> Annual Disaster Drill
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.0023</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="40.09"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-bell"></i> Early Warning System</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">1.0397</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="41.59"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-piggy-bank"></i> DRRMP Budget</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0020</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="0.20"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-clipboard-data"></i> Risk Assessments
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">2.0000</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="80.00"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-graph-up"></i>
                                <span>Resiliency Trend</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciResiliencyChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel hidden [&.active]:block" id="panel-innovation">
                        <div className="mb-7 grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-file-code"></i> ICT Plan</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">2.0001</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="80.00"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-search"></i> R&amp;D Expenditures</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0006</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="0.06"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-laptop"></i> E-BPLS Software</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">2.0000</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="80.00"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary"><i className="bi bi-mortarboard"></i> STEM Graduates</div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0181</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="1.81"></div>
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-4 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.08)]">
                                <div className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.3px] text-[#666666] uppercase [&_i]:text-[0.875rem] [&_i]:text-primary">
                                    <i className="bi bi-rocket-takeoff"></i> Innovation Facilities
                                </div>
                                <div className="mb-[10px] text-[1.25rem] font-bold text-[#1a1a1a]">0.0227</div>
                                <div className="h-[6px] overflow-hidden rounded bg-[rgba(58, 125, 68,0.08)]">
                                    <div className="indicator-fill h-full w-0 rounded bg-[linear-gradient(90deg,#3a7d44_0%,#275230_100%)] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.animated]:w-[var(--fill-width)]" data-value="2.27"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                            <h4 className="mb-5 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1a1a1a] [&_i]:text-primary">
                                <i className="bi bi-graph-up"></i>
                                <span>Innovation Trend</span>
                            </h4>
                            <div className="relative h-[400px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[300px] max-[575px]:p-4">
                                <canvas id="cmciInnovationChart" className="max-h-full w-full"></canvas>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://cmci.dti.gov.ph/" target="_blank" rel="noopener noreferrer">
                            DTI Cities and Municipalities Competitiveness Index (CMCI)
                        </a>
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-20 opacity-0 translate-y-[40px] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[575px]:py-12 [&.visible]:translate-y-0 [&.visible]:opacity-100">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                            <i className="bi bi-bar-chart-fill"></i>
                            <span>Visual</span>
                        </span>
                        <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold text-[#1a1a1a] max-[575px]:text-[1.5rem]">Population Bar Chart</h2>
                        <p className="m-0 text-[1rem] text-[#666666]">Comparative view of all {rankedBarangays.length} barangays</p>
                    </div>

                    <div className="relative h-[600px] rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 max-[575px]:h-[500px] max-[575px]:p-4">
                        <canvas id="populationBarChart" className="max-h-full w-full"></canvas>
                    </div>

                    <p className="mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle mr-1"></i> Source:{" "}
                        <a className="text-primary" href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2024 Census
                    </p>
                </div>
            </section>
        </>
    );
}
