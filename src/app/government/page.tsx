'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import officialsData from '@/data/officials.json';
import barangaysData from '@/data/barangays.json';
import { slugify } from '@/lib/slug';

const barangays = barangaysData.barangays;

const councilors = officialsData.councilors;

function SectionBadge({ icon, label }: { icon: string; label: string }) {
    return (
        <span
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-[0.875rem] font-medium text-primary"
        >
            <i className={icon}></i>
            <span>{label}</span>
        </span>
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
            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-star-fill"
                            label="Executive Branch"
                        />
                        <h3 className="font-bold leading-[1.2] text-foreground" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            City Leadership
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            The executive officials leading San Carlos&apos;s governance
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-8 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-lg)' }}>
                        <div className="overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]">
                                <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">City Mayor</span>
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

                        <div className="overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
                            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]">
                                <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">City Vice Mayor</span>
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
            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-people-fill"
                            label="Legislative Branch"
                        />
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
                                className="rounded-lg border border-line border-l-[3px] border-l-primary bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[767px]:p-4"
                            >
                                <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.2] text-foreground">{c.name}</h4>
                                <span className="mb-2.5 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white">SB Member</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Barangays */}
            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-geo-alt-fill"
                            label="Barangay Units"
                        />
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
                                className="flex flex-col justify-center rounded-lg border border-line bg-white px-4 py-3 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
                            >
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-geo-alt-fill text-[0.875rem] text-primary"></i>
                                    <span className="text-[0.9375rem] font-semibold text-primary">{b.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
