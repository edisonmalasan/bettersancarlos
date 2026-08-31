import { notFound } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import barangayOfficials from '@/data/barangay-officials.json';
import { slugify } from '@/lib/slug';

interface Position {
    position: string;
    count: number;
    officials: (string | null)[];
}

interface Barangay {
    barangay: string;
    total_officials: number;
    positions: Position[];
}

const barangays = barangayOfficials.barangays as Barangay[];

export function generateStaticParams() {
    return barangays.map((b) => ({ slug: slugify(b.barangay) }));
}

/** Title-case a raw name from the dataset for consistent display. */
function formatName(name: string | null): string {
    if (!name || !name.trim()) return 'Vacant';
    return name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default async function BarangayDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const barangay = barangays.find((b) => slugify(b.barangay) === slug);

    if (!barangay) {
        notFound();
    }

    const punong = barangay.positions.find((p) => p.position === 'Punong Barangay');
    const otherPositions = barangay.positions.filter((p) => p.position !== 'Punong Barangay');

    return (
        <>
            <PageHeader
                title={`Barangay ${barangay.barangay}`}
                description={`Barangay officials for the ${barangayOfficials.term} term`}
                badge={{ icon: 'bi bi-geo-alt-fill', label: 'Barangay Unit' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Government', href: '/government' },
                    { label: barangay.barangay },
                ]}
            />

            {/* Punong Barangay */}
            {punong && (
                <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                                Punong Barangay
                            </h3>
                            <p style={{ color: 'var(--color-text-light)' }}>
                                {barangay.total_officials} officials serving Barangay{' '}
                                {barangay.barangay}
                            </p>
                        </div>
                        <div
                            className="executive-card"
                            style={{ maxWidth: '480px', margin: '0 auto' }}
                        >
                            <div className="executive-card-header">
                                <span className="executive-badge">Punong Barangay</span>
                                <h4 className="executive-name">
                                    {formatName(punong.officials[0])}
                                </h4>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Remaining positions */}
            <section className="section">
                <div className="container">
                    {otherPositions.map((pos) => (
                        <div key={pos.position} style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div
                                className="text-center"
                                style={{ marginBottom: 'var(--spacing-lg)' }}
                            >
                                <h3
                                    style={{
                                        fontSize: '1.5rem',
                                        marginBottom: 'var(--spacing-xs)',
                                    }}
                                >
                                    {pos.position}
                                    {pos.count > 1 ? `s (${pos.count})` : ''}
                                </h3>
                            </div>
                            <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                                {pos.officials.map((official, i) => (
                                    <div key={`${pos.position}-${i}`} className="councilor-card">
                                        <h4 className="councilor-name">{formatName(official)}</h4>
                                        <span className="councilor-badge">{pos.position}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
