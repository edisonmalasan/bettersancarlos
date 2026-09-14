'use client';

import PageHeader from '@/components/layout/PageHeader';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Chart from 'chart.js/auto';
import fiscalData from '@/data/fiscal_transparency.json';
import transparencyDocs from '@/data/transparency-docs.json';
import cityProjects from '@/data/city-projects.json';

interface FiscalYear {
    year: number;
    annual_regular_income: number;
    change_pct?: number;
}

const fiscalYears = fiscalData.fiscal_years as FiscalYear[];
const latestFiscal = fiscalYears[fiscalYears.length - 1];

function formatPeso(n: number): string {
    return `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BudgetPage() {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const gradient = canvasRef.current.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
        if (gradient) {
            gradient.addColorStop(0, 'rgba(58, 125, 68, 0.2)');
            gradient.addColorStop(1, 'rgba(58, 125, 68, 0)');
        }
        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                labels: fiscalYears.map((f) => `FY${f.year}`),
                datasets: [
                    {
                        label: 'Annual Regular Income',
                        data: fiscalYears.map((f) => f.annual_regular_income),
                        borderColor: '#3a7d44',
                        backgroundColor: gradient || 'rgba(58, 125, 68, 0.2)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3a7d44',
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
                        callbacks: { label: (ctx) => `Income: ${formatPeso(Number(ctx.raw))}` },
                    },
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 12 } } },
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { size: 12 }, callback: (v) => `₱${(Number(v) / 1_000_000).toFixed(0)}M` },
                    },
                },
            },
        });
        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, []);

    return (
        <>
            <PageHeader
                title="Budget & Financial Transparency"
                description="Tracking city finances for accountability"
                badge={{ icon: 'bi bi-shield-check', label: 'Financial Transparency' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Budget & Transparency' },
                ]}
            />

            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-8 flex flex-wrap items-start justify-between gap-6 max-[991px]:flex-col">
                        <div className="min-w-[280px] flex-1">
                            <h2 className="mb-1! text-2xl! font-bold text-foreground max-[575px]:text-[1.25rem]!">Annual Regular Income</h2>
                            <p className="m-0! text-[0.9375rem] text-muted-foreground">Verified BLGF fiscal series, FY2009–FY2016 (latest: FY{latestFiscal.year} · ₱{(latestFiscal.annual_regular_income / 1_000_000).toFixed(2)} M)</p>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-4 gap-4 max-[991px]:grid-cols-2 max-[575px]:grid-cols-1 max-[575px]:gap-3">
                        <div className="flex items-center gap-[14px] rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-cash-stack"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[1.375rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.25rem]">₱{(latestFiscal.annual_regular_income / 1_000_000).toFixed(2)} M</span>
                                <span className="text-xs font-medium text-muted-foreground">FY{latestFiscal.year} Annual Regular Income</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-graph-up-arrow"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className={`text-[1.375rem] font-bold leading-[1.2] max-[575px]:text-[1.25rem] ${latestFiscal.change_pct !== undefined && latestFiscal.change_pct >= 0 ? 'text-primary' : 'text-[#b02e2e]'}`}>
                                    {latestFiscal.change_pct !== undefined ? `${latestFiscal.change_pct >= 0 ? '+' : ''}${latestFiscal.change_pct}%` : '—'}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">FY{latestFiscal.year} change vs prior year</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-bar-chart-line"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[1.375rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.25rem]">{fiscalYears.length} years</span>
                                <span className="text-xs font-medium text-muted-foreground">of verified fiscal data</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary"><i className="bi bi-award"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[1.375rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.25rem]">3rd class</span>
                                <span className="text-xs font-medium text-muted-foreground">city income classification</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-6 h-[400px] rounded-2xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] max-[575px]:h-[300px] max-[575px]:p-4">
                        <canvas ref={canvasRef} className="max-h-full w-full"></canvas>
                    </div>

                    <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                        <div className="border-b border-line px-5 py-4">
                            <h3 className="m-0! flex items-center gap-2 text-[0.9375rem]! font-semibold text-foreground">
                                <i className="bi bi-table text-base text-primary"></i>
                                <span>FY2009–FY2016 income series (BLGF)</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="px-5 py-3 text-[0.8125rem] font-semibold text-muted-foreground">Fiscal Year</th>
                                        <th className="px-5 py-3 text-right text-[0.8125rem] font-semibold text-muted-foreground">Annual Regular Income</th>
                                        <th className="px-5 py-3 text-right text-[0.8125rem] font-semibold text-muted-foreground">Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fiscalYears.map((f, i) => (
                                        <tr key={f.year} className="border-t border-line-soft transition-colors duration-200 hover:bg-[rgba(58, 125, 68,0.04)]">
                                            <td className="px-5 py-3 text-[0.9375rem] font-semibold text-foreground">FY{f.year}</td>
                                            <td className="px-5 py-3 text-right text-[0.9375rem] text-foreground">{formatPeso(f.annual_regular_income)}</td>
                                            <td className={`px-5 py-3 text-right text-[0.9375rem] ${f.change_pct === undefined ? 'text-muted-foreground' : f.change_pct >= 0 ? 'text-primary' : 'text-[#b02e2e]'}`}>
                                                {f.change_pct === undefined ? '—' : `${f.change_pct >= 0 ? '+' : ''}${f.change_pct}%`}
                                                {i === fiscalYears.length - 1 ? <span className="ml-2 inline-flex items-center rounded bg-[rgba(34,197,94,0.1)] px-1.5 py-0.5 text-[0.6875rem] font-semibold text-[#16a34a]">latest</span> : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p className="m-0! text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a
                            href="https://blgf.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                        >
                            Bureau of Local Government Finance (BLGF)
                        </a>
                        {" "}via PhilAtlas — Annual Regular Income (locally sourced revenue + IRA + other national tax shares)
                    </p>
                </div>
            </section>

            <section className="bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mx-auto max-w-[760px] rounded-2xl border border-line bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] max-[575px]:p-5">
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-hourglass-split"></i> FY2017–2025 pending verification
                        </span>
                        <h3 className="mb-3 text-[1.125rem] font-bold text-foreground">Recent fiscal years withheld pending source verification</h3>
                        <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                            Budget and expenditure figures for FY2017 through FY2025 have not yet been verified against official
                            Bureau of Local Government Finance / Commission on Audit releases. Rather than publish unconfirmed
                            numbers, this page shows only the verified FY2009–FY2016 series. Recent-year figures will be added
                            once they are confirmed from the BLGF Statement of Receipts and Expenditures.
                        </p>
                    </div>
                </div>
            </section>

            {/* Transparency & Full Disclosure */}
            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-8 text-center">
                        <h2 className="mb-1! text-2xl! font-bold text-foreground max-[767px]:text-[1.375rem]! max-[575px]:text-[1.25rem]!">Transparency &amp; Full Disclosure</h2>
                        <p className="m-0! text-[0.9375rem] text-muted-foreground">Transparency Seal, Citizen&apos;s Charter, FDP reports, and e-services</p>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
                        <div className="rounded-xl border border-line bg-white p-6">
                            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-patch-check"></i> Transparency Seal
                            </h3>
                            <p className="m-0 mb-2 text-[0.875rem] leading-[1.5] text-muted-foreground">{transparencyDocs.transparency_seal.status}</p>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                                <i className="bi bi-file-earmark-x"></i> Compliance documents not yet published online
                            </span>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-6">
                            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-award"></i> Seal of Good Local Governance
                            </h3>
                            <p className="m-0 mb-2 text-[0.875rem] leading-[1.5] text-muted-foreground">
                                The city holds SGLG recognition per the official LGU announcement.
                            </p>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                                <i className="bi bi-question-circle"></i> Award year pending DILG verification
                            </span>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-6">
                            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-globe"></i> e-Services
                            </h3>
                            <a
                                href={transparencyDocs.eservices[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-2 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-primary hover:underline"
                            >
                                {transparencyDocs.eservices[0].name} <i className="bi bi-box-arrow-up-right text-[0.75rem]"></i>
                            </a>
                            <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">{transparencyDocs.eservices[1].note}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
                        <div className="rounded-xl border border-line bg-white p-6">
                            <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-journal-text"></i> Citizen&apos;s Charter — service offices
                            </h3>
                            <p className="m-0 mb-3 text-[0.8125rem] leading-[1.5] text-muted-foreground">{transparencyDocs.citizens_charter.status}</p>
                            <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1.5 pl-0 max-[575px]:grid-cols-1" role="list">
                                {transparencyDocs.citizens_charter.offices.map((o) => (
                                    <li key={o} className="flex gap-2 text-[0.875rem] leading-[1.4] text-foreground">
                                        <i className="bi bi-dot text-primary"></i>
                                        <span>{o}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mb-0 mt-3 text-[0.75rem] text-muted-foreground">{transparencyDocs.citizens_charter.gap}</p>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-6">
                            <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                                <i className="bi bi-file-earmark-bar-graph"></i> Full Disclosure Policy reports
                            </h3>
                            <p className="m-0 mb-3 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                                Standard FDP financial reports listed on the city&apos;s FDP Policy Board (2017 archive):
                            </p>
                            <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                                {transparencyDocs.fdp_reports.map((r) => (
                                    <li key={r.name} className="flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                                        <i className="bi bi-file-earmark text-primary"></i> {r.name}
                                        <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(232,153,10,0.08)] px-2 py-[2px] text-[0.6875rem] font-semibold text-[#8a5a00]">
                                            file pending
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Source: research/transparency/26-09-full-disclosure.md
                        (official LGU pages, archived)
                    </p>
                </div>
            </section>

            {/* City Projects & Programs */}
            <section className="bg-white py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-8 text-center">
                        <h2 className="mb-1! text-2xl! font-bold text-foreground max-[767px]:text-[1.375rem]! max-[575px]:text-[1.25rem]!">City Projects &amp; Programs</h2>
                        <p className="m-0! text-[0.9375rem] text-muted-foreground">Program areas tracked by the city government</p>
                    </div>

                    <div className="mb-6 rounded-xl border border-line bg-white p-5 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-cash-coin"></i> {cityProjects.budgets_status}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-5 max-[1200px]:grid-cols-2 max-[575px]:grid-cols-1">
                        {cityProjects.program_buckets.map((b) => (
                            <div
                                key={b.name}
                                className="rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
                            >
                                <h3 className="m-0 mb-2 flex items-start gap-2 text-[0.875rem] font-bold leading-[1.3] text-foreground">
                                    <i className="bi bi-diagram-3 mt-[2px] text-primary"></i>
                                    <span>{b.name}</span>
                                </h3>
                                <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">{b.document_status}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-xl border border-line bg-white p-6">
                        <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                            <i className="bi bi-building"></i> Known public projects (reference only)
                        </h3>
                        <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                            {cityProjects.known_projects.map((p) => (
                                <li key={p.name} className="flex flex-wrap items-baseline gap-2 text-[0.9375rem] text-foreground">
                                    <i className="bi bi-hammer text-primary"></i> {p.name}
                                    <span className="text-[0.75rem] text-muted-foreground">— {p.evidence}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i> Project budgets and contractors are not verifiable online
                        and must come from the City Engineering Office / BAC. See also{' '}
                        <Link href="/disaster-preparedness" className="text-primary hover:underline">
                            /disaster-preparedness
                        </Link>{' '}
                        for the DRRM program.
                    </p>
                </div>
            </section>
        </>
    );
}
