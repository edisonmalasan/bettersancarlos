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

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-6 overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] p-6 max-[767px]:p-4">
                            <div className="flex items-center gap-3">
                                <i className="bi bi-journal-bookmark-fill text-xl text-primary"></i>
                                <h2 className="m-0 text-[1.25rem] font-bold text-foreground">Municipal Ordinances</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-1 text-xs font-semibold text-primary"><i className="bi bi-calendar-check"></i> Updated 2025</span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-1 text-xs font-semibold text-primary"><i className="bi bi-files"></i> {ordinances.length} Records</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
                                <thead>
                                    <tr>
                                        <th className="bg-primary px-4 py-3 text-left text-sm font-semibold text-white max-[767px]:px-2">Ordinance No.</th>
                                        <th className="bg-primary px-4 py-3 text-left text-sm font-semibold text-white max-[767px]:px-2">Title</th>
                                        <th className="bg-primary px-4 py-3 text-left text-sm font-semibold text-white max-[767px]:px-2">Session Date</th>
                                        <th className="bg-primary px-4 py-3 text-left text-sm font-semibold text-white max-[767px]:px-2">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordinances.map((item) => (
                                        <tr key={item.ordinanceNo} className="transition-colors hover:bg-muted [&:last-child>td]:border-b-0">
                                            <td className="border-b border-[#f8f9fa] px-4 py-3 max-[767px]:px-2"><span className="inline-block whitespace-nowrap rounded-md bg-[rgba(58, 125, 68,0.08)] px-2.5 py-1 text-xs font-semibold text-primary">{item.ordinanceNo}</span></td>
                                            <td className="border-b border-[#f8f9fa] px-4 py-3 text-sm font-medium text-foreground max-[767px]:px-2">{item.title}</td>
                                            <td className="whitespace-nowrap border-b border-[#f8f9fa] px-4 py-3 text-sm text-muted-foreground max-[767px]:px-2"><i className="bi bi-calendar-event mr-2 text-primary"></i> {item.sessionDate}</td>
                                            <td className="border-b border-[#f8f9fa] px-4 py-3 max-[767px]:px-2"><span className="inline-block whitespace-nowrap rounded-full bg-[#e6f4ea] px-3 py-1 text-xs font-semibold text-success">Municipal Ordinance</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {ordinances.length === 0 && (
                            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                                <i className="bi bi-inbox text-4xl text-muted-foreground"></i>
                                <p className="m-0 text-sm text-muted-foreground">No ordinances found at this time.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 rounded-xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.05)] max-[767px]:flex-col max-[767px]:p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-xl text-white"><i className="bi bi-info-circle-fill"></i></div>
                        <div className="min-w-0 flex-1">
                            <h3 className="mb-2 text-[1.125rem] font-bold text-foreground">About Municipal Ordinances</h3>
                            <p className="mb-4 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                                Municipal ordinances are local laws enacted by the Sangguniang Bayan that have a
                                permanent and general application within the jurisdiction of the Municipality of
                                San Carlos. These ordinances cover public safety, health, environment, governance, and
                                other local matters affecting the community.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/legislative" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-6 py-3 font-semibold text-primary no-underline transition-all duration-200 hover:bg-muted hover:no-underline focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(247,127,0,0.5)] max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[0.9375rem]">
                                    <i className="bi bi-arrow-left"></i> Back to Legislative
                                </Link>
                                <a
                                    href="https://www.officialgazette.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-primary px-6 py-3 font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2f6136] hover:no-underline hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(247,127,0,0.5)] max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[0.9375rem]"
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
