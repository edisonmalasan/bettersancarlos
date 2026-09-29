'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import officialsData from '@/data/officials.json';
import barangaysData from '@/data/barangays.json';
import { slugify } from '@/lib/slug';
import { containerClass, sectionClass } from '@/components/layout/Container';

const barangays = barangaysData.barangays;

const councilors = officialsData.councilors;

function SectionLabel({ label }: { label: string }) {
    return (
        <p className="mb-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-primary">
            {label}
        </p>
    );
}

export default function GovernmentPage() {
    return (
        <>
            <PageHeader
                title="Government Structure & Officials"
                description="Meet the leadership and offices serving San Carlos"
                badge={{ icon: 'bi bi-building-fill', label: 'Government' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Government' },
                ]}
            />

            {/* Executive Branch */}
            <section className={`bg-muted ${sectionClass}`}>
                <div className={containerClass}>
                    <div className="mb-8">
                        <SectionLabel label="Executive Branch" />
                        <h3 className="mt-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground">
                            City Leadership
                        </h3>
                        <p className="m-0 text-muted-foreground">
                            The executive officials leading San Carlos&apos;s governance
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-8 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-lg)' }}>
                        <div className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-primary">
                            <div className="bg-[#3a7d44] px-8 py-6 text-center">
                                <p className="m-0 mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-white/85">
                                    City Mayor
                                </p>
                                <h4 className="m-0 text-[1.25rem] font-semibold text-white">{officialsData.mayor.name}</h4>
                            </div>
                            <div className="px-8 py-6">
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:CIO@sancarlospangasinan.com" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline transition-colors duration-200 hover:bg-line-soft hover:no-underline">
                                        <i className="bi bi-envelope text-[1rem] text-primary"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline transition-colors duration-200 hover:bg-line-soft hover:no-underline">
                                        <i className="bi bi-telephone text-[1rem] text-primary"></i> (075) 600-1432
                                    </a>
                                    <span className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline">
                                        <i className="bi bi-clock text-[1rem] text-primary"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-primary">
                            <div className="bg-[#3a7d44] px-8 py-6 text-center">
                                <p className="m-0 mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-white/85">
                                    City Vice Mayor
                                </p>
                                <h4 className="m-0 text-[1.25rem] font-semibold text-white">{officialsData.vice_mayor.name}</h4>
                            </div>
                            <div className="px-8 py-6">
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:CIO@sancarlospangasinan.com" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline transition-colors duration-200 hover:bg-line-soft hover:no-underline">
                                        <i className="bi bi-envelope text-[1rem] text-primary"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline transition-colors duration-200 hover:bg-line-soft hover:no-underline">
                                        <i className="bi bi-telephone text-[1rem] text-primary"></i> (075) 600-1432
                                    </a>
                                    <span className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-foreground no-underline">
                                        <i className="bi bi-clock text-[1rem] text-primary"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* City Council */}
            <section className={sectionClass}>
                <div className={containerClass}>
                    <div className="mb-6">
                        <h3 className="font-bold leading-[1.2] text-foreground" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Sangguniang Panlungsod Members
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            City Councilors serving the people of San Carlos
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-md)' }}>
                        {councilors.map((c) => (
                            <div
                                key={c.name}
                                className="rounded-lg border border-line border-l-[3px] border-l-primary bg-white p-6 transition-colors duration-200 hover:border-primary max-[767px]:p-4"
                            >
                                <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.2] text-foreground">{c.name}</h4>
                                {c.party && c.votes !== undefined ? (
                                    <p className="m-0 mb-2 text-[0.75rem] text-muted-foreground">
                                        {c.party} · {c.votes.toLocaleString('en-PH')} votes
                                    </p>
                                ) : null}
                                <p className="m-0 text-[0.75rem] font-medium text-muted-foreground">SB Member</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Historical Terms */}
            <section className={`bg-muted ${sectionClass}`}>
                <div className={containerClass}>
                    <div className="mb-6">
                        <h3 className="font-bold leading-[1.2] text-foreground" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Previous City Leadership
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            Verified elected officials from the {officialsData.registered_voters.election === '2025' ? '2016–2025' : 'past'} terms
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.75rem] font-semibold text-[#8a5a00]">
                            <i className="bi bi-archive"></i> Historical data — compiled from Comelec records
                        </span>
                    </div>
                    <div className="grid gap-6 min-[1024px]:grid-cols-3 max-[1023px]:grid-cols-1">
                        {officialsData.history.map((h) => (
                            <div key={h.term} className="rounded-xl border border-line bg-white p-6 transition-colors duration-200 hover:border-primary">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="rounded-full bg-primary px-3 py-1 text-[0.75rem] font-bold text-white">{h.term}</span>
                                    {h.note ? <span className="text-[0.6875rem] text-muted-foreground">{h.note}</span> : null}
                                </div>
                                <p className="m-0 mb-1.5 text-[0.875rem] text-foreground">
                                    <span className="font-semibold">Mayor:</span> {h.mayor}
                                </p>
                                <p className="m-0 mb-1.5 text-[0.875rem] text-foreground">
                                    <span className="font-semibold">Vice Mayor:</span> {h.vice_mayor}
                                </p>
                                {h.representative ? (
                                    <p className="m-0 mb-1.5 text-[0.875rem] text-foreground">
                                        <span className="font-semibold">Representative:</span> {h.representative}
                                    </p>
                                ) : null}
                                {h.councilors ? (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-[0.8125rem] font-medium text-primary">Councilors ({h.councilors.length})</summary>
                                        <ul className="mt-2 mb-0 flex list-none flex-col gap-1 pl-0" role="list">
                                            {h.councilors.map((c) => (
                                                <li key={c} className="text-[0.8125rem] leading-[1.5] text-muted-foreground">{c}</li>
                                            ))}
                                        </ul>
                                    </details>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Barangays */}
            <section className={sectionClass}>
                <div className={containerClass}>
                    <div className="mb-6">
                        <h3 className="font-bold leading-[1.2] text-foreground" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Barangays of San Carlos
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            {barangays.length} Barangays serving our community
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 min-[1200px]:grid-cols-4 min-[1025px]:max-[1199px]:gap-4 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-sm)' }}>
                        {barangays.map((b) => (
                            <Link
                                key={b.name}
                                href={`/government/barangays/${slugify(b.name)}`}
                                className="flex flex-col justify-center rounded-lg border border-line bg-white px-4 py-3 text-foreground no-underline duration-200 hover:border-primary hover:no-underline transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-geo-alt-fill text-[0.875rem] text-primary"></i>
                                    <span className="text-[0.9375rem] font-semibold text-primary">{b.name.replace(/\\u00f1/g, 'ñ')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
