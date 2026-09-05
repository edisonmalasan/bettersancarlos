'use client';

import PageHeader from '@/components/layout/PageHeader';

export default function BudgetPage() {
    return (
        <>
            <PageHeader
                title="Budget & Financial Transparency"
                description="Tracking municipal finances and projects for accountability"
                badge={{ icon: 'bi bi-shield-check', label: 'Financial Transparency' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Budget & Transparency' },
                ]}
            />

            <section className="animate-on-scroll bg-[#f8fafc] pt-12 pb-16 opacity-0! translate-y-[30px]! transition-all! duration-[600ms]! ease-[cubic-bezier(0.16,1,0.3,1)]! max-[575px]:pt-9 max-[575px]:pb-12 [&.visible]:translate-y-0! [&.visible]:opacity-100!">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-8 flex flex-wrap items-start justify-between gap-6 max-[991px]:flex-col">
                        <div className="min-w-[280px] flex-1">
                            <span className="mb-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-primary">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Financial Report</span>
                            </span>
                            <h2 className="mb-1! text-2xl! font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]!">Statement of Receipts &amp; Expenditures</h2>
                            <p className="m-0! text-[0.9375rem] text-[#666666]">FY 2025 quarterly financial performance</p>
                        </div>
                        <div className="flex gap-1 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)] max-[575px]:w-full" role="tablist" aria-label="Select fiscal quarter">
                            <button
                                type="button"
                                className="sre-period-btn active flex min-w-[90px] cursor-pointer flex-col items-center rounded-[10px] border-0 bg-transparent px-6 py-2.5 transition-all duration-200 hover:bg-[rgba(58, 125, 68,0.04)] max-[575px]:flex-1 max-[575px]:px-4 [&.active]:bg-primary"
                                role="tab"
                                aria-selected="true"
                                data-quarter="q1"
                            >
                                <span className="text-base font-bold text-[#2f3e46] transition-colors duration-200 [.active_&]:text-white">Q1</span>
                                <span className="mt-0.5 text-[0.6875rem] text-[#666666] transition-colors duration-200 [.active_&]:text-white">Jan - Mar</span>
                            </button>
                            <button
                                type="button"
                                className="sre-period-btn flex min-w-[90px] cursor-pointer flex-col items-center rounded-[10px] border-0 bg-transparent px-6 py-2.5 transition-all duration-200 hover:bg-[rgba(58, 125, 68,0.04)] max-[575px]:flex-1 max-[575px]:px-4 [&.active]:bg-primary"
                                role="tab"
                                aria-selected="false"
                                data-quarter="q2"
                            >
                                <span className="text-base font-bold text-[#2f3e46] transition-colors duration-200 [.active_&]:text-white">Q2</span>
                                <span className="mt-0.5 text-[0.6875rem] text-[#666666] transition-colors duration-200 [.active_&]:text-white">Apr - Jun</span>
                            </button>
                        </div>
                    </div>
                    <div className="mb-8 grid grid-cols-4 gap-4 max-[991px]:grid-cols-2 max-[575px]:grid-cols-1 max-[575px]:gap-3">
                        <div className="flex items-center gap-[14px] rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)] text-[1.25rem] text-white"><i className="bi bi-arrow-down-circle"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="sre-metric-value text-[1.375rem] font-bold leading-[1.2] text-[#2f3e46] transition-[opacity_0.15s_ease,transform_0.15s_ease] max-[575px]:text-[1.25rem] [&.updating]:scale-[0.98] [&.updating]:opacity-50" id="sre-total-income">₱158.47 M</span>
                                <span className="text-xs font-medium text-[#666666]">Total Income</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)] text-[1.25rem] text-white"><i className="bi bi-arrow-up-circle"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="sre-metric-value text-[1.375rem] font-bold leading-[1.2] text-[#2f3e46] transition-[opacity_0.15s_ease,transform_0.15s_ease] max-[575px]:text-[1.25rem] [&.updating]:scale-[0.98] [&.updating]:opacity-50" id="sre-total-expense">₱67.51 M</span>
                                <span className="text-xs font-medium text-[#666666]">Total Expenditures</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] text-[1.25rem] text-white"><i className="bi bi-plus-slash-minus"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="sre-metric-value text-[1.375rem] font-bold leading-[1.2] text-[#2f3e46] transition-[opacity_0.15s_ease,transform_0.15s_ease] max-[575px]:text-[1.25rem] [&.updating]:scale-[0.98] [&.updating]:opacity-50" id="sre-net-income">₱90.96 M</span>
                                <span className="text-xs font-medium text-[#666666]">Net Operating Income</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[14px] rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.1)] max-[575px]:p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6_0%,#7c3aed_100%)] text-[1.25rem] text-white"><i className="bi bi-wallet2"></i></div>
                            <div className="flex flex-col gap-0.5">
                                <span className="sre-metric-value text-[1.375rem] font-bold leading-[1.2] text-[#2f3e46] transition-[opacity_0.15s_ease,transform_0.15s_ease] max-[575px]:text-[1.25rem] [&.updating]:scale-[0.98] [&.updating]:opacity-50" id="sre-fund-balance">₱283.29 M</span>
                                <span className="text-xs font-medium text-[#666666]">Fund Balance (End)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
                        <div className="overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.04)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                            <div className="border-b border-[rgba(0,0,0,0.06)] px-5 py-4">
                                <h3 className="m-0! flex items-center gap-2 text-[0.9375rem]! font-semibold text-[#2f3e46]">
                                    <i className="bi bi-pie-chart text-base text-primary"></i>
                                    <span>Income Sources</span>
                                </h3>
                            </div>
                            <div className="p-5">
                                <div className="relative mb-5 h-[180px] overflow-hidden max-[575px]:h-[160px]">
                                    <canvas id="incomeChartV2"></canvas>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="local">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#10b981]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">Local Sources</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">Tax &amp; Non-Tax Revenue</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-income-local">₱88.85 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-income-local-pct">56.1%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="external">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0ea5e9]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">External Sources</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">National Tax Allotment</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-income-external">₱69.62 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-income-external-pct">43.9%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.04)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                            <div className="border-b border-[rgba(0,0,0,0.06)] px-5 py-4">
                                <h3 className="m-0! flex items-center gap-2 text-[0.9375rem]! font-semibold text-[#2f3e46]">
                                    <i className="bi bi-bar-chart text-base text-primary"></i>
                                    <span>Expenditure Allocation</span>
                                </h3>
                            </div>
                            <div className="p-5">
                                <div className="relative mb-5 h-[180px] overflow-hidden max-[575px]:h-[160px]">
                                    <canvas id="expenditureChartV2"></canvas>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="gps">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3b82f6]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">General Public Services</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">Administration &amp; Operations</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-exp-gps">₱42.76 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-exp-gps-pct">63.3%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="social">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#8b5cf6]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">Social Services</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">Health, Education, Welfare</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-exp-social">₱13.33 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-exp-social-pct">19.7%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="economic">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f59e0b]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">Economic Services</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">Infrastructure &amp; Development</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-exp-economic">₱11.07 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-exp-economic-pct">16.4%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item flex items-center gap-3 rounded-[10px] bg-[#f8fafc] p-3 transition-all duration-200 hover:bg-[#f1f5f9]" data-type="debt">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ef4444]"></span>
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[#2f3e46]">Debt Service</span>
                                            <span className="mt-[1px] block text-xs text-[#666666]">Interest &amp; Charges</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[0.9375rem] font-bold text-[#2f3e46]" id="sre-exp-debt">₱0.35 M</span>
                                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[0.6875rem] text-[#666666]" id="sre-exp-debt-pct">0.5%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="m-0! text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a
                            href="https://blgf.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                        >
                            Bureau of Local Government Finance (BLGF)
                        </a>
                    </p>
                </div>
            </section>

            <section className="animate-on-scroll bg-white py-16 opacity-0! translate-y-[30px]! transition-all! duration-[600ms]! ease-[cubic-bezier(0.16,1,0.3,1)]! max-[575px]:py-12 [&.visible]:translate-y-0! [&.visible]:opacity-100!">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-10 text-center">
                        <span className="mb-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-primary">
                            <i className="bi bi-building-gear"></i>
                            <span>Public Works</span>
                        </span>
                        <h2 className="mb-1! text-2xl! font-bold text-[#2f3e46] max-[767px]:text-[1.375rem]! max-[575px]:text-[1.25rem]!">Infrastructure Investments</h2>
                        <p className="m-0! text-[0.9375rem] text-[#666666]">Major development projects serving the community</p>
                    </div>
                    <div className="mb-6 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-200 last:mb-0 hover:border-primary hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.1)]">
                        <div className="border-b border-[rgba(0,0,0,0.06)] p-7 max-[575px]:p-5">
                            <div className="mb-4 flex items-center gap-2.5 max-[767px]:flex-wrap">
                                <span className="rounded-md bg-primary px-3.5 py-1.5 text-[0.8125rem] font-bold text-white">2024</span>
                                <span className="inline-flex items-center gap-[5px] rounded-md bg-[rgba(0,119,190,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#0077be]">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3 className="m-0! mb-2.5! text-[1.25rem]! leading-[1.4]! font-bold text-[#2f3e46] max-[575px]:text-[1.125rem]!">FCDS Package 5 - Magat River Flood Control</h3>
                            <p className="m-0! flex items-center gap-1.5 text-[0.9375rem] text-[#666666]">
                                <i className="bi bi-geo-alt text-sm text-[#0077be]"></i>
                                <span>Magat River, Bagahabag Section, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="bg-[#fafbfc] px-7 py-6 max-[575px]:p-5">
                            <div className="grid grid-cols-3 gap-6 max-[991px]:grid-cols-1 max-[991px]:gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Type of Work</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">Construction of Flood Mitigation Structure</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contractor</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">EGB Construction Corporation</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contract Cost</span>
                                    <span className="text-[1.125rem] font-bold text-[#3a7d44]">₱144,750,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] bg-white px-7 py-4 max-[575px]:flex-col max-[575px]:gap-3 max-[575px]:px-5 max-[575px]:py-[14px] max-[575px]:text-center">
                            <span className="flex items-center gap-1.5 text-[0.8125rem] text-[#666666]">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline transition-[gap] duration-200 hover:gap-2.5 hover:no-underline"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>

                    <div className="mb-6 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-200 last:mb-0 hover:border-primary hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.1)]">
                        <div className="border-b border-[rgba(0,0,0,0.06)] p-7 max-[575px]:p-5">
                            <div className="mb-4 flex items-center gap-2.5 max-[767px]:flex-wrap">
                                <span className="rounded-md bg-primary px-3.5 py-1.5 text-[0.8125rem] font-bold text-white">2021</span>
                                <span className="inline-flex items-center gap-[5px] rounded-md bg-[rgba(0,119,190,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#0077be]">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3 className="m-0! mb-2.5! text-[1.25rem]! leading-[1.4]! font-bold text-[#2f3e46] max-[575px]:text-[1.125rem]!">Repair/Rehabilitation of Flood Control and Drainage Structure - Section 1</h3>
                            <p className="m-0! flex items-center gap-1.5 text-[0.9375rem] text-[#666666]">
                                <i className="bi bi-geo-alt text-sm text-[#0077be]"></i>
                                <span>Magat River, Bangar Section 1, Brgy. Bangar, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="bg-[#fafbfc] px-7 py-6 max-[575px]:p-5">
                            <div className="grid grid-cols-3 gap-6 max-[991px]:grid-cols-1 max-[991px]:gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Type of Work</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">Rehabilitation / Major Repair of Flood Control Structure</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contractor</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">Shanley Construction</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contract Cost</span>
                                    <span className="text-[1.125rem] font-bold text-[#3a7d44]">₱29,700,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] bg-white px-7 py-4 max-[575px]:flex-col max-[575px]:gap-3 max-[575px]:px-5 max-[575px]:py-[14px] max-[575px]:text-center">
                            <span className="flex items-center gap-1.5 text-[0.8125rem] text-[#666666]">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline transition-[gap] duration-200 hover:gap-2.5 hover:no-underline"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>

                    <div className="mb-6 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white transition-all duration-200 last:mb-0 hover:border-primary hover:shadow-[0_8px_32px_rgba(58, 125, 68,0.1)]">
                        <div className="border-b border-[rgba(0,0,0,0.06)] p-7 max-[575px]:p-5">
                            <div className="mb-4 flex items-center gap-2.5 max-[767px]:flex-wrap">
                                <span className="rounded-md bg-primary px-3.5 py-1.5 text-[0.8125rem] font-bold text-white">2021</span>
                                <span className="inline-flex items-center gap-[5px] rounded-md bg-[rgba(0,119,190,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#0077be]">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3 className="m-0! mb-2.5! text-[1.25rem]! leading-[1.4]! font-bold text-[#2f3e46] max-[575px]:text-[1.125rem]!">Repair/Rehabilitation of Flood Control and Drainage Structure - Section 2</h3>
                            <p className="m-0! flex items-center gap-1.5 text-[0.9375rem] text-[#666666]">
                                <i className="bi bi-geo-alt text-sm text-[#0077be]"></i>
                                <span>Magat River, Bangar Section 2, Brgy. Bangar, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="bg-[#fafbfc] px-7 py-6 max-[575px]:p-5">
                            <div className="grid grid-cols-3 gap-6 max-[991px]:grid-cols-1 max-[991px]:gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Type of Work</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">Rehabilitation / Major Repair of Flood Control Structure</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contractor</span>
                                    <span className="text-[0.9375rem] font-semibold text-[#2f3e46]">Shanley Construction</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.5px] text-[#666666]">Contract Cost</span>
                                    <span className="text-[1.125rem] font-bold text-[#3a7d44]">₱29,700,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] bg-white px-7 py-4 max-[575px]:flex-col max-[575px]:gap-3 max-[575px]:px-5 max-[575px]:py-[14px] max-[575px]:text-center">
                            <span className="flex items-center gap-1.5 text-[0.8125rem] text-[#666666]">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline transition-[gap] duration-200 hover:gap-2.5 hover:no-underline"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="animate-on-scroll bg-[#f8f9fa] py-16 opacity-0! translate-y-[30px]! transition-all! duration-[600ms]! ease-[cubic-bezier(0.16,1,0.3,1)]! max-[575px]:py-12 [&.visible]:translate-y-0! [&.visible]:opacity-100!">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mb-10 text-center">
                        <span className="mb-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-primary">
                            <i className="bi bi-building"></i>
                            <span>National Government Projects</span>
                        </span>
                        <h2 className="mb-1! text-2xl! font-bold text-[#2f3e46] max-[767px]:text-[1.375rem]! max-[575px]:text-[1.25rem]!">DPWH Infrastructure Projects in San Carlos</h2>
                        <p className="m-0! text-[0.9375rem] text-[#666666]">Implementing Agency: Pangasinan District Engineering Office</p>
                    </div>

                    <div id="dpwh-projects-container"></div>

                    <p className="m-0! mt-6 text-center text-[0.8125rem] text-[#666666]">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a
                            href="https://transparency.dpwh.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                        >
                            DPWH Transparency Portal
                        </a>
                    </p>
                </div>
            </section>
        </>
    );
}
