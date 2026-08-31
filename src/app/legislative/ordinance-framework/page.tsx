'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

interface Ordinance {
    ordinanceNo: string;
    title: string;
    sessionDate: string;
}

export default function OrdinanceFrameworkPage() {
    const [ordinances, setOrdinances] = useState<Ordinance[]>([]);

    useEffect(() => {
        fetch('/data/ordinances.json')
            .then((res) => res.json())
            .then((data) => setOrdinances(data.ordinances || []))
            .catch(() => setOrdinances([]));
    }, []);

    return (
        <>
            <PageHeader
                title="Ordinance Framework"
                description="Municipal ordinances enacted by the Sangguniang Bayan ng San Carlos"
                badge={{ icon: 'bi bi-journal-bookmark-fill', label: 'Ordinances' }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Legislative', href: '/legislative' },
                    { label: 'Ordinance Framework' },
                ]}
            />

            <section className="section">
                <div className="container">
                    <div className="leg-table-card">
                        <div className="leg-table-header">
                            <div className="leg-table-title">
                                <i className="bi bi-journal-bookmark-fill"></i>
                                <h2>Municipal Ordinances</h2>
                            </div>
                            <div className="leg-table-meta">
                                <span className="leg-meta-tag"><i className="bi bi-calendar-check"></i> Updated 2025</span>
                                <span className="leg-meta-tag"><i className="bi bi-files"></i> {ordinances.length} Records</span>
                            </div>
                        </div>

                        <div className="leg-table-responsive">
                            <table className="leg-table">
                                <thead>
                                    <tr>
                                        <th>Ordinance No.</th>
                                        <th>Title</th>
                                        <th>Session Date</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordinances.map((item) => (
                                        <tr key={item.ordinanceNo}>
                                            <td className="leg-doc-number"><span className="leg-doc-badge">{item.ordinanceNo}</span></td>
                                            <td className="leg-doc-title">{item.title}</td>
                                            <td className="leg-doc-date"><i className="bi bi-calendar-event"></i> {item.sessionDate}</td>
                                            <td className="leg-doc-category"><span className="leg-category-pill">Municipal Ordinance</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {ordinances.length === 0 && (
                            <div className="leg-empty">
                                <i className="bi bi-inbox"></i>
                                <p>No ordinances found at this time.</p>
                            </div>
                        )}
                    </div>

                    <div className="leg-info-card leg-info-card-wide">
                        <div className="leg-info-card-icon"><i className="bi bi-info-circle-fill"></i></div>
                        <div className="leg-info-card-content">
                            <h3>About Municipal Ordinances</h3>
                            <p>
                                Municipal ordinances are local laws enacted by the Sangguniang Bayan that have a
                                permanent and general application within the jurisdiction of the Municipality of
                                San Carlos. These ordinances cover public safety, health, environment, governance, and
                                other local matters affecting the community.
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
