'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import officialsData from '@/data/officials.json';
import barangaysData from '@/data/barangays.json';
import { slugify } from '@/lib/slug';

const barangays = barangaysData.barangays;

const councilors = officialsData.councilors;

function SectionBadge({ icon, label, gradient }: { icon: string; label: string; gradient: string }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: gradient,
                color: 'white',
                padding: '8px 20px',
                borderRadius: '50px',
                fontSize: '0.875rem',
                marginBottom: 'var(--spacing-sm)',
            }}
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
            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-star-fill"
                            label="Executive Branch"
                            gradient="linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
                        />
                        <h3 className="font-bold leading-[1.2] text-[#1a1a1a]" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Municipal Leadership
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            The executive officials leading San Carlos&apos;s governance
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-8 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-lg)' }}>
                        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]">
                            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#0032a0_0%,#003d82_100%)]">
                                <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">Municipal Mayor</span>
                                <h4 className="m-0 text-[1.25rem] font-semibold text-white">{officialsData.mayor.name}</h4>
                            </div>
                            <div className="px-8 py-6">
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:CIO@sancarlospangasinan.com" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200 hover:bg-[rgba(0,50,160,0.08)] hover:no-underline">
                                        <i className="bi bi-envelope text-[1rem] text-primary"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200 hover:bg-[rgba(0,50,160,0.08)] hover:no-underline">
                                        <i className="bi bi-telephone text-[1rem] text-primary"></i> 0917 701 2268
                                    </a>
                                    <span className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200">
                                        <i className="bi bi-clock text-[1rem] text-primary"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-primary hover:shadow-[0_4px_16px_rgba(0,50,160,0.1)]">
                            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#0032a0_0%,#003d82_100%)]">
                                <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">Municipal Vice Mayor</span>
                                <h4 className="m-0 text-[1.25rem] font-semibold text-white">{officialsData.vice_mayor.name}</h4>
                            </div>
                            <div className="px-8 py-6">
                                <div className="flex flex-col gap-2">
                                    <a href="mailto:CIO@sancarlospangasinan.com" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200 hover:bg-[rgba(0,50,160,0.08)] hover:no-underline">
                                        <i className="bi bi-envelope text-[1rem] text-primary"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432" className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200 hover:bg-[rgba(0,50,160,0.08)] hover:no-underline">
                                        <i className="bi bi-telephone text-[1rem] text-primary"></i> 0920 925 6688
                                    </a>
                                    <span className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-[0.875rem] text-[#1a1a1a] no-underline transition-all duration-200">
                                        <i className="bi bi-clock text-[1rem] text-primary"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Municipal Council */}
            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-people-fill"
                            label="Legislative Branch"
                            gradient="linear-gradient(135deg, var(--color-success) 0%, #05c793 100%)"
                        />
                        <h3 className="font-bold leading-[1.2] text-[#1a1a1a]" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Sangguniang Bayan Members
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            Municipal Councilors serving the people of San Carlos
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-md)' }}>
                        {councilors.map((c) => (
                            <div
                                key={c.name}
                                className="rounded-[10px] border border-[#e5e7eb] border-l-[3px] border-l-primary bg-white p-6 transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(0,50,160,0.08)] max-[767px]:p-4"
                            >
                                <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.2] text-[#1a1a1a]">{c.name}</h4>
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
                            gradient="linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
                        />
                        <h3 className="font-bold leading-[1.2] text-[#1a1a1a]" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Barangays of San Carlos
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                            44 Barangays serving our community
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 min-[1200px]:grid-cols-4 min-[1025px]:max-[1199px]:gap-4 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-sm)' }}>
                        {barangays.map((b) => (
                            <Link
                                key={b.name}
                                href={`/government/barangays/${slugify(b.name)}`}
                                className="flex flex-col justify-center rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3 text-[#1a1a1a] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(0,50,160,0.1)]"
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
