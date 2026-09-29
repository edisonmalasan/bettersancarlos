'use client';

import officialsData from '@/data/officials.json';
import PageHeader from '@/components/layout/PageHeader';
import { containerClass, sectionClass } from '@/components/layout/Container';

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
        <div className="flex h-full flex-col rounded-xl border border-line bg-white p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)] duration-200 max-[767px]:p-4 max-[480px]:p-2 transition-colors hover:border-primary">
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
        <div className="flex h-full flex-col rounded-xl border border-line border-l-[3px] border-l-primary bg-white p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.05)] duration-200 hover:border-primary max-[767px]:p-4 max-[480px]:p-2 transition-colors">
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
            <p className="inline-block rounded bg-[#e8f0fe] px-2 py-1 text-[0.75rem] font-semibold uppercase text-info">{official.title}</p>
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

            <section className={sectionClass}>
                <div className={containerClass}>
                    <h3 className="mb-4 text-center text-[1.5rem] font-bold leading-[1.2] text-foreground max-[1024px]:text-[1.375rem] max-[767px]:text-[1.25rem]">Executive Branch</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 min-[1200px]:grid-cols-2 min-[1200px]:gap-8 max-[767px]:grid-cols-1">
                        <OfficialCard official={data.mayor} />
                        <OfficialCard official={data.vice_mayor} />
                    </div>
                </div>
            </section>

            <section className={`bg-muted ${sectionClass}`}>
                <div className={containerClass}>
                    <h3 className="mb-4 text-center text-[1.5rem] font-bold leading-[1.2] text-foreground max-[1024px]:text-[1.375rem] max-[767px]:text-[1.25rem]">Sangguniang Panlungsod Members</h3>
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
