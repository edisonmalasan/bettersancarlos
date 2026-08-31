'use client';

import officialsData from '@/data/officials.json';
import PageHeader from '@/components/layout/PageHeader';

interface Official {
    name: string;
    title: string;
    image: string;
}

interface OfficialsData {
    mayor: Official;
    vice_mayor: Official;
    councilors: Official[];
}

const data = officialsData as OfficialsData;

function OfficialCard({ official }: { official: Official }) {
    return (
        <div className="official-card card">
            <div className="official-photo">
                {official.image ? (
                    <img
                        src={`/${official.image}`}
                        alt={official.name}
                        className="official-img"
                        loading="lazy"
                    />
                ) : (
                    <i
                        className="bi bi-person-circle"
                        style={{ fontSize: '8rem', color: 'var(--color-primary)' }}
                    ></i>
                )}
            </div>
            <div className="official-info">
                <h4>{official.name}</h4>
                <p className="official-title">{official.title}</p>
            </div>
        </div>
    );
}

function CouncilorCard({ official }: { official: Official }) {
    return (
        <div className="councilor-card card text-center">
            {official.image ? (
                <img
                    src={`/${official.image}`}
                    alt={official.name}
                    className="councilor-img"
                    loading="lazy"
                />
            ) : (
                <i
                    className="bi bi-person-badge"
                    style={{ fontSize: '3rem', color: 'var(--color-primary)' }}
                ></i>
            )}
            <h4>{official.name}</h4>
            <p className="badge badge-info">{official.title}</p>
        </div>
    );
}

export default function OfficialsPage() {
    return (
        <>
            <PageHeader
                title="Elected Officials"
                description="Meet the leaders serving the City of San Carlos"
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Government', href: '/government' },
                    { label: 'Officials' },
                ]}
            />

            <section className="section">
                <div className="container">
                    <h3 className="text-center">Executive Branch</h3>
                    <div className="grid grid-2">
                        <OfficialCard official={data.mayor} />
                        <OfficialCard official={data.vice_mayor} />
                    </div>
                </div>
            </section>

            <section className="section bg-alt">
                <div className="container">
                    <h3 className="text-center">Sangguniang Bayan Members</h3>
                    <div className="grid grid-4">
                        {data.councilors.map((councilor) => (
                            <CouncilorCard key={councilor.name} official={councilor} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
