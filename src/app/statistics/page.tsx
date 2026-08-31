'use client';

import { useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Chart from 'chart.js/auto';

const COLORS = {
    primary: '#0032a0',
    primaryDark: '#002170',
    secondary: '#003D82',
    accent: '#F77F00',
    success: '#06A77D',
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
    gradient.addColorStop(0, 'rgba(0, 50, 160, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 50, 160, 0)');
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
                    backgroundColor: 'rgba(0, 50, 160, 0.95)',
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
                    backgroundColor: 'rgba(0, 50, 160, 0.95)',
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
                        return `rgba(0, 50, 160, ${opacity})`;
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
                    backgroundColor: 'rgba(0, 50, 160, 0.95)',
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
                    backgroundColor: 'rgba(0, 50, 160, 0.95)',
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
                    backgroundColor: 'rgba(0, 50, 160, 0.95)',
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

            <section className="stats-metrics">
                <div className="container">
                    <div className="metrics-grid">
                        <div className="metric-card animate-on-scroll" data-delay="0">
                            <div className="metric-icon"><i className="bi bi-people-fill"></i></div>
                            <div className="metric-value" data-count="52746">0</div>
                            <div className="metric-label">Population</div>
                            <div className="metric-source">2024 Census</div>
                        </div>
                        <div className="metric-card animate-on-scroll" data-delay="100">
                            <div className="metric-icon"><i className="bi bi-geo-alt-fill"></i></div>
                            <div className="metric-value">44</div>
                            <div className="metric-label">Barangays</div>
                            <div className="metric-source">Administrative Units</div>
                        </div>
                        <div className="metric-card animate-on-scroll" data-delay="200">
                            <div className="metric-icon"><i className="bi bi-rulers"></i></div>
                            <div className="metric-value">180.95</div>
                            <div className="metric-label">Land Area (km²)</div>
                            <div className="metric-source">Total Municipal Area</div>
                        </div>
                        <div className="metric-card animate-on-scroll" data-delay="300">
                            <div className="metric-icon"><i className="bi bi-award-fill"></i></div>
                            <div className="metric-value">2nd</div>
                            <div className="metric-label">Income Class</div>
                            <div className="metric-source">Municipality Classification</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section stats-finance animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-cash-stack"></i> <span>Finance</span>
                        </span>
                        <h2>Municipal Income</h2>
                        <p>Financial standing based on latest available LGU data</p>
                    </div>

                    <div className="finance-grid">
                        <div className="finance-card finance-card-primary">
                            <div className="finance-card-header">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Annual Income</span>
                            </div>
                            <div className="finance-card-value">₱220.77M</div>
                            <div className="finance-card-detail">Projected baseline from national LGU data</div>
                        </div>
                        <div className="finance-card">
                            <div className="finance-card-header">
                                <i className="bi bi-bank"></i>
                                <span>IRA Share</span>
                            </div>
                            <div className="finance-card-value">₱131.26M</div>
                            <div className="finance-card-detail">Internal Revenue Allotment</div>
                        </div>
                        <div className="finance-card">
                            <div className="finance-card-header">
                                <i className="bi bi-pie-chart-fill"></i>
                                <span>IRA Dependency</span>
                            </div>
                            <div className="finance-card-value">59.45%</div>
                            <div className="finance-card-detail">National Tax Share</div>
                        </div>
                    </div>

                    <div className="income-breakdown animate-on-scroll">
                        <h4>Income Composition</h4>
                        <div className="breakdown-bar">
                            <div className="breakdown-segment breakdown-ira breakdown-initial" data-width="59.45">
                                <span className="breakdown-label">IRA 59.45%</span>
                            </div>
                            <div className="breakdown-segment breakdown-local breakdown-initial" data-width="40.55">
                                <span className="breakdown-label">Local 40.55%</span>
                            </div>
                        </div>
                        <div className="breakdown-legend">
                            <div className="legend-item">
                                <span className="legend-dot legend-ira"></span>Internal Revenue Allotment
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot legend-local"></span>Local Sources
                            </div>
                        </div>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://blgf.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Bureau of Local Government Finance (BLGF)
                        </a>
                        {" "}– LGU fiscal estimates
                    </p>
                </div>
            </section>

            <section className="stats-section stats-trends animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-graph-up"></i> <span>Growth</span>
                        </span>
                        <h2>Population Trends</h2>
                        <p>Historical growth from 1990 to 2024</p>
                    </div>

                    <div className="trends-summary">
                        <div className="trend-stat">
                            <span className="trend-stat-label">1990</span>
                            <span className="trend-stat-value">{formatNumber(historicalData.populations[0])}</span>
                        </div>
                        <div className="trend-arrow"><i className="bi bi-arrow-right"></i></div>
                        <div className="trend-stat trend-stat-current">
                            <span className="trend-stat-label">2024</span>
                            <span className="trend-stat-value">{formatNumber(totalPopulation)}</span>
                        </div>
                        <div className="trend-stat trend-stat-growth">
                            <span className="trend-stat-label">Growth</span>
                            <span className="trend-stat-value">+{historicalGrowth.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="chart-wrapper">
                        <canvas id="historicalLineChart"></canvas>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                    </p>
                </div>
            </section>

            <section className="stats-section stats-distribution animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-pie-chart-fill"></i>
                            <span>Distribution</span>
                        </span>
                        <h2>Population by Barangay</h2>
                        <p>2024 Census of Population</p>
                    </div>

                    <div className="distribution-layout">
                        <div className="distribution-chart">
                            <canvas id="distributionPieChart"></canvas>
                        </div>
                        <div className="distribution-list">
                            {top10.map((b) => (
                                <div className="barangay-row" data-rank={b.pop === maxPop ? 1 : undefined} key={b.name}>
                                    <span className="rank">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="name">{b.name}</span>
                                    <div className="bar-wrap">
                                        <div
                                            className="bar"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="pop">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <details className="more-barangays">
                        <summary>View all {rankedBarangays.length} barangays</summary>
                        <div className="distribution-list distribution-list-full">
                            {remaining.map((b) => (
                                <div className="barangay-row" key={b.name}>
                                    <span className="rank">#{rankedBarangays.findIndex((r) => r.name === b.name) + 1}</span>
                                    <span className="name">{b.name}</span>
                                    <div className="bar-wrap">
                                        <div
                                            className="bar"
                                            data-width={Math.max(2, Math.round((b.pop / maxPop) * 100))}
                                        ></div>
                                    </div>
                                    <span className="pop">{formatNumber(b.pop)}</span>
                                </div>
                            ))}
                        </div>
                    </details>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2024 Census
                    </p>
                </div>
            </section>

            <section className="stats-section stats-economy animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-briefcase-fill"></i>
                            <span>Economy</span>
                        </span>
                        <h2>Economic Indicators</h2>
                        <p>Key economic data based on DILG and agricultural profile</p>
                    </div>

                    <div className="economy-grid">
                        <div className="economy-card">
                            <div className="economy-icon"><i className="bi bi-tree-fill"></i></div>
                            <div className="economy-content">
                                <div className="economy-value">COCONUT</div>
                                <div className="economy-label">Major Product</div>
                                <div className="economy-trend">Principal crop & trade</div>
                            </div>
                        </div>
                        <div className="economy-card">
                            <div className="economy-icon"><i className="bi bi-geo-fill"></i></div>
                            <div className="economy-content">
                                <div className="economy-value">AGRICULTURAL</div>
                                <div className="economy-label">Major Land Use</div>
                                <div className="economy-trend">Farms & coconut plantations</div>
                            </div>
                        </div>
                        <div className="economy-card">
                            <div className="economy-icon"><i className="bi bi-house-door-fill"></i></div>
                            <div className="economy-content">
                                <div className="economy-value" data-count="9263">0</div>
                                <div className="economy-label">Households</div>
                                <div className="economy-trend">DILG municipal profile</div>
                            </div>
                        </div>
                    </div>

                    <div className="sectors-chart animate-on-scroll">
                        <h4>Economic Sectors</h4>
                        <div className="sc-bars">
                            <div className="sc-row">
                                <div className="sc-meta">
                                    <span className="sc-dot sc-color-agri"></span>
                                    <span className="sc-name">Agriculture</span>
                                </div>
                                <span className="sc-pct">70%</span>
                                <div className="sc-track">
                                    <div className="sc-fill sc-color-agri" data-width="70"></div>
                                </div>
                            </div>
                            <div className="sc-row">
                                <div className="sc-meta">
                                    <span className="sc-dot sc-color-trade"></span>
                                    <span className="sc-name">Trade &amp; Commerce</span>
                                </div>
                                <span className="sc-pct">15%</span>
                                <div className="sc-track">
                                    <div className="sc-fill sc-color-trade" data-width="15"></div>
                                </div>
                            </div>
                            <div className="sc-row">
                                <div className="sc-meta">
                                    <span className="sc-dot sc-color-services"></span>
                                    <span className="sc-name">Services</span>
                                </div>
                                <span className="sc-pct">10%</span>
                                <div className="sc-track">
                                    <div className="sc-fill sc-color-services" data-width="10"></div>
                                </div>
                            </div>
                            <div className="sc-row">
                                <div className="sc-meta">
                                    <span className="sc-dot sc-color-industry"></span>
                                    <span className="sc-name">Industry</span>
                                </div>
                                <span className="sc-pct">5%</span>
                                <div className="sc-track">
                                    <div className="sc-fill sc-color-industry" data-width="5"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://sancarlospangasinan.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Department of the Interior and Local Government (DILG) Region I
                        </a>
                        {" "}- San Carlos Municipal Profile
                    </p>
                </div>
            </section>

            <section className="stats-section stats-poverty animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-graph-down-arrow"></i>
                            <span>Poverty</span>
                        </span>
                        <h2>Poverty Statistics</h2>
                        <p>2021 City and Municipal Level Poverty Estimates</p>
                    </div>

                    <div className="poverty-comparison">
                        <div className="poverty-card poverty-card-2018">
                            <span className="poverty-year">2018</span>
                            <div className="poverty-rate">
                                <span className="rate-value">7.0</span>
                                <span className="rate-symbol">%</span>
                            </div>
                            <div className="poverty-bar"><div className="poverty-fill" data-width="7"></div></div>
                            <span className="poverty-ci">90% CI: 4.7% - 9.2%</span>
                        </div>
                        <div className="poverty-arrow">
                            <i className="bi bi-arrow-right"></i>
                            <span className="poverty-change">-0.6%</span>
                        </div>
                        <div className="poverty-card poverty-card-2021">
                            <span className="poverty-year">2021</span>
                            <div className="poverty-rate">
                                <span className="rate-value">6.4</span>
                                <span className="rate-symbol">%</span>
                            </div>
                            <div className="poverty-bar"><div className="poverty-fill" data-width="6.4"></div></div>
                            <span className="poverty-ci">90% CI: 4.7% - 8.1%</span>
                            <span className="poverty-badge">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Improved</span>
                            </span>
                        </div>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2021 Poverty Estimates
                    </p>
                </div>
            </section>

            <section className="stats-section stats-competitive animate-on-scroll" id="competitive-index">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-trophy-fill"></i>
                            <span>Competitiveness</span>
                        </span>
                        <h2>San Carlos Competitive Index</h2>
                        <p>
                            Cities and Municipalities Competitiveness Index (CMCI) Performance 2016-2024
                        </p>
                    </div>

                    <div className="cmci-tabs">
                        <button type="button" className="cmci-tab active" data-pillar="overview">
                            <i className="bi bi-grid-3x3-gap"></i> <span>Overview</span>
                        </button>
                        <button type="button" className="cmci-tab" data-pillar="economic-dynamism">
                            <i className="bi bi-graph-up-arrow"></i>
                            <span>Economic Dynamism</span>
                        </button>
                        <button type="button" className="cmci-tab" data-pillar="government-efficiency">
                            <i className="bi bi-building-check"></i>
                            <span>Government Efficiency</span>
                        </button>
                        <button type="button" className="cmci-tab" data-pillar="infrastructure">
                            <i className="bi bi-building-gear"></i>
                            <span>Infrastructure</span>
                        </button>
                        <button type="button" className="cmci-tab" data-pillar="resiliency">
                            <i className="bi bi-shield-check"></i>
                            <span>Resiliency</span>
                        </button>
                        <button type="button" className="cmci-tab" data-pillar="innovation">
                            <i className="bi bi-lightbulb"></i> <span>Innovation</span>
                        </button>
                    </div>

                    <div className="cmci-panel active" id="panel-overview">
                        <div className="cmci-overview-grid">
                            <div className="cmci-pillar-card" data-pillar="economic-dynamism">
                                <div className="pillar-icon"><i className="bi bi-graph-up-arrow"></i></div>
                                <h4>Economic Dynamism</h4>
                                <div className="pillar-score">0.23</div>
                                <div className="pillar-trend trend-up"><i className="bi bi-arrow-up"></i> +12%</div>
                            </div>
                            <div className="cmci-pillar-card" data-pillar="government-efficiency">
                                <div className="pillar-icon"><i className="bi bi-building-check"></i></div>
                                <h4>Government Efficiency</h4>
                                <div className="pillar-score">1.17</div>
                                <div className="pillar-trend trend-down"><i className="bi bi-arrow-down"></i> -8%</div>
                            </div>
                            <div className="cmci-pillar-card" data-pillar="infrastructure">
                                <div className="pillar-icon"><i className="bi bi-building-gear"></i></div>
                                <h4>Infrastructure</h4>
                                <div className="pillar-score">0.40</div>
                                <div className="pillar-trend trend-up"><i className="bi bi-arrow-up"></i> +5%</div>
                            </div>
                            <div className="cmci-pillar-card" data-pillar="resiliency">
                                <div className="pillar-icon"><i className="bi bi-shield-check"></i></div>
                                <h4>Resiliency</h4>
                                <div className="pillar-score">1.08</div>
                                <div className="pillar-trend trend-stable"><i className="bi bi-dash"></i> Stable</div>
                            </div>
                            <div className="cmci-pillar-card" data-pillar="innovation">
                                <div className="pillar-icon"><i className="bi bi-lightbulb"></i></div>
                                <h4>Innovation</h4>
                                <div className="pillar-score">0.68</div>
                                <div className="pillar-trend trend-up"><i className="bi bi-arrow-up"></i> +25%</div>
                            </div>
                        </div>

                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-bar-chart-line"></i>
                                <span>Key Indicators Trend (2016-2024)</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciOverviewChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel" id="panel-economic-dynamism">
                        <div className="cmci-indicator-grid">
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-currency-exchange"></i> Local Economy Size
                                </div>
                                <div className="indicator-value">0.0259</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="2.59"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-graph-up"></i> Local Economy Growth
                                </div>
                                <div className="indicator-value">0.0318</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="3.18"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-shop"></i> Active Establishments</div>
                                <div className="indicator-value">0.4994</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="49.94"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-shield-check"></i> Safety Compliant Business
                                </div>
                                <div className="indicator-value">0.2235</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="22.35"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-people"></i> Employment Generation
                                </div>
                                <div className="indicator-value">0.3835</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="38.35"></div>
                                </div>
                            </div>
                        </div>
                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-graph-up"></i>
                                <span>Economic Dynamism Trend</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciEconomicChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel" id="panel-government-efficiency">
                        <div className="cmci-indicator-grid">
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-cash-coin"></i> Cost of Living</div>
                                <div className="indicator-value">1.1919</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="47.68"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-briefcase"></i> Cost of Doing Business
                                </div>
                                <div className="indicator-value">1.5599</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="62.40"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-bank"></i> Financial Deepening</div>
                                <div className="indicator-value">0.8288</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="33.15"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-speedometer2"></i> Productivity</div>
                                <div className="indicator-value">0.3297</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="32.97"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-check2-square"></i> Compliance to Directives
                                </div>
                                <div className="indicator-value">1.9600</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="78.40"></div>
                                </div>
                            </div>
                        </div>
                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-graph-up"></i>
                                <span>Government Efficiency Trend</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciGovernmentChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel" id="panel-infrastructure">
                        <div className="cmci-indicator-grid">
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-signpost-2"></i> Road Network</div>
                                <div className="indicator-value">0.0016</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="0.16"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-geo-alt"></i> Distance to Ports</div>
                                <div className="indicator-value">1.5281</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="61.12"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-lightning-charge"></i> Basic Utilities
                                </div>
                                <div className="indicator-value">0.3560</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="14.24"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-truck"></i> Transportation</div>
                                <div className="indicator-value">0.0959</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="9.59"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-wifi"></i> IT Capacity</div>
                                <div className="indicator-value">0.0155</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="1.55"></div>
                                </div>
                            </div>
                        </div>
                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-graph-up"></i>
                                <span>Infrastructure Trend</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciInfraChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel" id="panel-resiliency">
                        <div className="cmci-indicator-grid">
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-file-earmark-text"></i> DRR Plan</div>
                                <div className="indicator-value">1.9783</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="79.13"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-calendar-event"></i> Annual Disaster Drill
                                </div>
                                <div className="indicator-value">1.0023</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="40.09"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-bell"></i> Early Warning System</div>
                                <div className="indicator-value">1.0397</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="41.59"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-piggy-bank"></i> DRRMP Budget</div>
                                <div className="indicator-value">0.0020</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="0.20"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-clipboard-data"></i> Risk Assessments
                                </div>
                                <div className="indicator-value">2.0000</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="80.00"></div>
                                </div>
                            </div>
                        </div>
                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-graph-up"></i>
                                <span>Resiliency Trend</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciResiliencyChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="cmci-panel" id="panel-innovation">
                        <div className="cmci-indicator-grid">
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-file-code"></i> ICT Plan</div>
                                <div className="indicator-value">2.0001</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="80.00"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-search"></i> R&amp;D Expenditures</div>
                                <div className="indicator-value">0.0006</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="0.06"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-laptop"></i> E-BPLS Software</div>
                                <div className="indicator-value">2.0000</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="80.00"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header"><i className="bi bi-mortarboard"></i> STEM Graduates</div>
                                <div className="indicator-value">0.0181</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="1.81"></div>
                                </div>
                            </div>
                            <div className="cmci-indicator-card">
                                <div className="indicator-header">
                                    <i className="bi bi-rocket-takeoff"></i> Innovation Facilities
                                </div>
                                <div className="indicator-value">0.0227</div>
                                <div className="indicator-bar">
                                    <div className="indicator-fill" data-value="2.27"></div>
                                </div>
                            </div>
                        </div>
                        <div className="cmci-chart-container">
                            <h4>
                                <i className="bi bi-graph-up"></i>
                                <span>Innovation Trend</span>
                            </h4>
                            <div className="chart-wrapper">
                                <canvas id="cmciInnovationChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://cmci.dti.gov.ph/" target="_blank" rel="noopener noreferrer">
                            DTI Cities and Municipalities Competitiveness Index (CMCI)
                        </a>
                    </p>
                </div>
            </section>

            <section className="stats-section stats-barchart animate-on-scroll">
                <div className="container">
                    <div className="section-header-minimal">
                        <span className="section-tag">
                            <i className="bi bi-bar-chart-fill"></i>
                            <span>Visual</span>
                        </span>
                        <h2>Population Bar Chart</h2>
                        <p>Comparative view of all {rankedBarangays.length} barangays</p>
                    </div>

                    <div className="chart-wrapper chart-wrapper-bar">
                        <canvas id="populationBarChart"></canvas>
                    </div>

                    <p className="data-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a href="https://psa.gov.ph/" target="_blank" rel="noopener noreferrer">
                            Philippine Statistics Authority (PSA)
                        </a>
                        {" "}- 2024 Census
                    </p>
                </div>
            </section>
        </>
    );
}
