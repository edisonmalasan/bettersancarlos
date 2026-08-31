'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

interface Resolution {
    resolutionNo: string;
    title: string;
    sessionDate: string;
}

export default function ResolutionFrameworkPage() {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);

    useEffect(() => {
        fetch('/data/resolutions.json')
            .then((res) => res.json())
            .then((data) => setResolutions(data.resolutions || []))
            .catch(() => setResolutions([]));
    }, []);

    const currentYear = resolutions.filter((r) => r.sessionDate.startsWith('2026'));
    const previousYear = resolutions.filter((r) => r.sessionDate.startsWith('2025'));

    const renderTable = (items: Resolution[], year: string) => (
        <div className="leg-table-card" key={year}>
            <div className="leg-table-header">
                <div className="leg-table-title">
                    <i className="bi bi-file-earmark-ruled-fill"></i>
                    <h2>Resolutions {year}</h2>
                </div>
                <div className="leg-table-meta">
                    <span className="leg-meta-tag"><i className="bi bi-calendar-check"></i> {year}</span>
                    <span className="leg-meta-tag"><i className="bi bi-files"></i> {items.length} Records</span>
                </div>
            </div>

            <div className="leg-table-responsive">
                <table className="leg-table">
                    <thead>
                        <tr>
                            <th>Resolution No.</th>
                            <th>Title</th>
                            <th>Session Date</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.resolutionNo}>
                                <td className="leg-doc-number"><span className="leg-doc-badge">{item.resolutionNo}</span></td>
                                <td className="leg-doc-title">{item.title}</td>
                                <td className="leg-doc-date"><i className="bi bi-calendar-event"></i> {item.sessionDate}</td>
                                <td className="leg-doc-category"><span className="leg-category-pill">SB Resolution</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {items.length === 0 && (
                <div className="leg-empty">
                    <i className="bi bi-inbox"></i>
                    <p>No resolutions found for {year}.</p>
                </div>
            )}
        </div>
    );

    return (
        <>
            <PageHeader
                title="Resolution Framework"
                description="Resolutions passed by the Sangguniang Bayan ng San Carlos"
                badge={{ icon: 'bi bi-file-earmark-ruled-fill', label: 'Resolutions' }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Legislative', href: '/legislative' },
                    { label: 'Resolution Framework' },
                ]}
            />

            <section className="section">
                <div className="container">
                    {renderTable(currentYear, '2026')}
                    {renderTable(previousYear, '2025')}

                    <div className="leg-info-card leg-info-card-wide">
                        <div className="leg-info-card-icon"><i className="bi bi-info-circle-fill"></i></div>
                        <div className="leg-info-card-content">
                            <h3>About Sangguniang Bayan Resolutions</h3>
                            <p>
                                Resolutions are formal expressions of the opinion, will, or intent of the Sangguniang Bayan.
                                They are used for various purposes including approvals of plans and programs, authorizations
                                for the municipal mayor to enter into agreements, commendations, and declarations of support
                                for policies and programs affecting the City of San Carlos.
                            </p>
                            <div className="leg-info-actions">
                                <Link href="/legislative" className="btn btn-secondary">
                                    <i className="bi bi-arrow-left"></i> Back to Legislative
                                </Link>
                                <a
                                    href="https://www.officialgazette.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-box-arrow-up-right"></i> Visit SB Website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
