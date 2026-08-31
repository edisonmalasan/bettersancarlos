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
            className="inline-badge"
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
            <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-star-fill"
                            label="Executive Branch"
                            gradient="linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
                        />
                        <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Municipal Leadership
                        </h3>
                        <p style={{ color: 'var(--color-text-light)' }}>
                            The executive officials leading San Carlos&apos;s governance
                        </p>
                    </div>

                    <div className="grid grid-2" style={{ gap: 'var(--spacing-lg)' }}>
                        <div className="executive-card">
                            <div className="executive-card-header">
                                <span className="executive-badge">Municipal Mayor</span>
                                <h4 className="executive-name">{officialsData.mayor.name}</h4>
                            </div>
                            <div className="executive-card-body">
                                <div className="executive-contacts">
                                    <a href="mailto:CIO@sancarlospangasinan.com">
                                        <i className="bi bi-envelope"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432">
                                        <i className="bi bi-telephone"></i> 0917 701 2268
                                    </a>
                                    <span>
                                        <i className="bi bi-clock"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="executive-card">
                            <div className="executive-card-header">
                                <span className="executive-badge">Municipal Vice Mayor</span>
                                <h4 className="executive-name">{officialsData.vice_mayor.name}</h4>
                            </div>
                            <div className="executive-card-body">
                                <div className="executive-contacts">
                                    <a href="mailto:CIO@sancarlospangasinan.com">
                                        <i className="bi bi-envelope"></i>
                                        <span>CIO@sancarlospangasinan.com</span>
                                    </a>
                                    <a href="tel:(075) 600-1432">
                                        <i className="bi bi-telephone"></i> 0920 925 6688
                                    </a>
                                    <span>
                                        <i className="bi bi-clock"></i> Mon-Fri: 8:00 AM - 5:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Municipal Council */}
            <section className="section">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-people-fill"
                            label="Legislative Branch"
                            gradient="linear-gradient(135deg, var(--color-success) 0%, #05c793 100%)"
                        />
                        <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Sangguniang Bayan Members
                        </h3>
                        <p style={{ color: 'var(--color-text-light)' }}>
                            Municipal Councilors serving the people of San Carlos
                        </p>
                    </div>

                    <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                        {councilors.map((c) => (
                            <div
                                key={c.name}
                                className="councilor-card"
                            >
                                <h4 className="councilor-name">{c.name}</h4>
                                <span className="councilor-badge">SB Member</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Barangays */}
            <section className="section">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SectionBadge
                            icon="bi bi-geo-alt-fill"
                            label="Barangay Units"
                            gradient="linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
                        />
                        <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                            Barangays of San Carlos
                        </h3>
                        <p style={{ color: 'var(--color-text-light)' }}>
                            44 Barangays serving our community
                        </p>
                    </div>

                    <div className="grid grid-4" style={{ gap: 'var(--spacing-sm)' }}>
                        {barangays.map((b) => (
                            <Link
                                key={b.name}
                                href={`/government/barangays/${slugify(b.name)}`}
                                className="barangay-card"
                            >
                                <div className="barangay-card-header">
                                    <i className="bi bi-geo-alt-fill"></i>
                                    <span className="barangay-name">{b.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
