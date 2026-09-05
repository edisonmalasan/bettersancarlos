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
        <div className="flex h-full flex-col rounded-[10px] border border-[#f8f9fa] bg-white p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-1 max-[767px]:p-4 max-[480px]:p-2">
            <div className="mb-6">
                {official.image ? (
                    <img
                        src={`/${official.image}`}
                        alt={official.name}
                        className="block h-auto max-w-full"
                        loading="lazy"
                    />
                ) : (
                    <i
                        className="bi bi-person-circle max-[1024px]:text-[5rem]! max-[767px]:text-[4rem]!"
                        style={{ fontSize: '8rem', color: 'var(--color-primary)' }}
                    ></i>
                )}
            </div>
            <div>
                <h4 className="mb-4 text-[1.25rem] font-bold leading-[1.2] text-primary max-[767px]:text-[1.125rem]">{official.name}</h4>
                <p className="mb-6 text-[0.875rem] font-semibold uppercase text-primary">{official.title}</p>
            </div>
        </div>
    );
}

function CouncilorCard({ official }: { official: Official }) {
    return (
        <div className="flex h-full flex-col rounded-[10px] border border-[#e5e7eb] border-l-[3px] border-l-primary bg-white p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)] max-[767px]:p-4 max-[480px]:p-2">
            {official.image ? (
                <img
                    src={`/${official.image}`}
                    alt={official.name}
                    className="block h-auto max-w-full"
                    loading="lazy"
                />
            ) : (
                <i
                    className="bi bi-person-badge max-[767px]:text-[2rem]!"
                    style={{ fontSize: '3rem', color: 'var(--color-primary)' }}
                ></i>
            )}
            <h4 className="mb-4 text-[1.25rem] font-bold leading-[1.2] text-primary max-[767px]:text-[1.125rem]">{official.name}</h4>
            <p className="inline-block rounded bg-[#e8f0fe] px-2 py-1 text-[0.75rem] font-semibold uppercase text-[#0077be]">{official.title}</p>
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

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <h3 className="mb-4 text-center text-[1.5rem] font-bold leading-[1.2] text-[#1a1a1a] max-[1024px]:text-[1.375rem] max-[767px]:text-[1.25rem]">Executive Branch</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-8 max-[767px]:grid-cols-1">
                        <OfficialCard official={data.mayor} />
                        <OfficialCard official={data.vice_mayor} />
                    </div>
                </div>
            </section>

            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <h3 className="mb-4 text-center text-[1.5rem] font-bold leading-[1.2] text-[#1a1a1a] max-[1024px]:text-[1.375rem] max-[767px]:text-[1.25rem]">Sangguniang Bayan Members</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 min-[1200px]:grid-cols-4 min-[1025px]:max-[1199px]:gap-4 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
                        {data.councilors.map((councilor) => (
                            <CouncilorCard key={councilor.name} official={councilor} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
