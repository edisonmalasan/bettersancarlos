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
    tel?: string;
    tel_status?: string;
    tel_shared_with?: string[];
    population_2020?: number;
    population_2015?: number;
    poblacion?: boolean;
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

/** Render dataset names for display only (fixes the double-escaped ñ in
 * "Malaca\u00f1ang" without touching stored names, so slugs stay identical). */
function displayName(name: string): string {
    return name.replace(/\\u00f1/g, 'ñ');
}

function formatPopulation(n: number): string {
    return n.toLocaleString('en-PH');
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
                title={`Barangay ${displayName(barangay.barangay)}`}
                description={`Barangay officials for the ${barangayOfficials.term} term`}
                badge={{ icon: 'bi bi-geo-alt-fill', label: 'Barangay Unit' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Government', href: '/government' },
                    { label: displayName(barangay.barangay) },
                ]}
            />

            {/* Barangay profile stats */}
            {(barangay.population_2020 !== undefined || barangay.poblacion) && (
                <section className="relative z-[2] mt-10 pb-[40px]">
                    <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                        <div className="grid grid-cols-3 gap-4 max-[767px]:grid-cols-1">
                            {barangay.population_2020 !== undefined && (
                                <div className="rounded-xl border border-line bg-white p-5 text-center">
                                    <span className="block text-[1.5rem] font-bold text-primary">{formatPopulation(barangay.population_2020)}</span>
                                    <span className="mt-0.5 block text-[0.8125rem] font-medium text-foreground">Population (2020)</span>
                                    <span className="block text-[0.6875rem] text-muted-foreground">PSA Census</span>
                                </div>
                            )}
                            {barangay.population_2015 !== undefined && (
                                <div className="rounded-xl border border-line bg-white p-5 text-center">
                                    <span className="block text-[1.5rem] font-bold text-primary">{formatPopulation(barangay.population_2015)}</span>
                                    <span className="mt-0.5 block text-[0.8125rem] font-medium text-foreground">Population (2015)</span>
                                    <span className="block text-[0.6875rem] text-muted-foreground">PSA Census</span>
                                </div>
                            )}
                            <div className="rounded-xl border border-line bg-white p-5 text-center">
                                {barangay.poblacion ? (
                                    <>
                                        <span className="block text-[1.5rem] font-bold text-primary">Poblacion</span>
                                        <span className="mt-0.5 block text-[0.8125rem] font-medium text-foreground">Urban core</span>
                                        <span className="block text-[0.6875rem] text-muted-foreground">City center barangay</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="block text-[1.5rem] font-bold text-primary">86 total</span>
                                        <span className="mt-0.5 block text-[0.8125rem] font-medium text-foreground">City: 30 urban / 56 rural</span>
                                        <span className="block text-[0.6875rem] text-muted-foreground">Classification pending verification</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Punong Barangay */}
            {punong && (
                <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6" style={{ background: 'var(--color-bg-alt)' }}>
                    <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                        <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 className="font-bold leading-[1.2] text-foreground" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                                Punong Barangay
                            </h3>
                            <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
                                {barangay.total_officials} officials serving Barangay{' '}
                                {displayName(barangay.barangay)}
                            </p>
                        </div>
                        <div
                            className="overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow,transform] duration-200 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]"
                            style={{ maxWidth: '480px', margin: '0 auto' }}
                        >
                            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]">
                                <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">Punong Barangay</span>
                                <h4 className="m-0 text-[1.25rem] font-semibold text-white">
                                    {formatName(punong.officials[0])}
                                </h4>
                            </div>
                            {barangay.tel_status === 'shared line' ? (
                                <p className="m-0 border-t border-line bg-white px-6 py-4 text-center text-[0.8125rem] text-muted-foreground">
                                    <i className="bi bi-telephone-x mr-1 text-[#8a5a00]"></i>
                                    Contact number shared with {barangay.tel_shared_with?.map(displayName).join(' and ') || 'another barangay'} — please call the City Hall trunk line (075) 600-1432 for assistance.
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>
            )}

            {/* Remaining positions */}
            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    {otherPositions.map((pos) => (
                        <div key={pos.position} style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div
                                className="text-center"
                                style={{ marginBottom: 'var(--spacing-lg)' }}
                            >
                                <h3
                                    className="font-bold leading-[1.2] text-foreground"
                                    style={{
                                        fontSize: '1.5rem',
                                        marginBottom: 'var(--spacing-xs)',
                                    }}
                                >
                                    {pos.position}
                                    {pos.count > 1 ? `s (${pos.count})` : ''}
                                </h3>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1" style={{ gap: 'var(--spacing-md)' }}>
                                {pos.officials.map((official, i) => (
                                    <div key={`${pos.position}-${i}`} className="rounded-lg border border-line border-l-[3px] border-l-primary bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)] max-[767px]:p-4">
                                        <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.2] text-foreground">{formatName(official)}</h4>
                                        <span className="mb-2.5 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white">{pos.position}</span>
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
