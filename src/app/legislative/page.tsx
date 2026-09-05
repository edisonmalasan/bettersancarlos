'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

export default function LegislativePage() {
    const [activeTab, setActiveTab] = useState<'ordinances' | 'resolutions'>('ordinances');

    const ordinanceSteps = [
        { number: '01', icon: 'bi bi-file-earmark-plus', title: 'File Proposed Ordinance', desc: 'Submit the proposed ordinance to the Sangguniang Bayan for consideration' },
        { number: '02', icon: 'bi bi-book', title: 'First Reading / Referral to Committee', desc: 'Initial reading and assignment to the relevant committee for review' },
        { number: '03', icon: 'bi bi-people', title: 'Public Hearing / Committee Action', desc: 'Committee conducts public hearing and deliberates on the proposed ordinance' },
        { number: '04', icon: 'bi bi-file-text', title: 'Committee Report', desc: 'Committee submits findings and recommendations to the Sangguniang Bayan' },
        { number: '05', icon: 'bi bi-journal-text', title: 'Second Reading', desc: 'Detailed discussion and debate on the proposed ordinance' },
        { number: '06', icon: 'bi bi-check2-square', title: 'Third and Final Reading', desc: 'Final voting on the proposed ordinance by the Sangguniang Bayan' },
        { number: '07', icon: 'bi bi-calendar-check', title: "10-Day Mayor's Approval", desc: 'Mayor reviews and approves the enacted ordinance within 10 days' },
        { number: '08', icon: 'bi bi-send', title: '3-Day Submission to SP', desc: 'Submit approved ordinance to Sangguniang Panlalawigan for review within 3 days' },
        { number: '09', icon: 'bi bi-hourglass-split', title: 'SP Review Period', desc: '60-day review for appropriation ordinances; 30-day review for others' },
        { number: '10', icon: 'bi bi-megaphone', title: 'Posting / Publication', desc: 'Public posting and publication of the approved ordinance' },
        { number: '11', icon: 'bi bi-rocket-takeoff', title: 'Implementation', desc: 'Ordinance takes effect and is enforced within the municipality' },
    ];

    const resolutionSteps = [
        { number: '01', icon: 'bi bi-file-earmark-plus', title: 'File Proposed Resolution', desc: 'Submit the proposed resolution to the Sangguniang Bayan' },
        { number: '02', icon: 'bi bi-calendar-event', title: 'Inclusion in Session Agenda', desc: 'Resolution is scheduled for inclusion in the Sangguniang Bayan session' },
        { number: '03', icon: 'bi bi-people-fill', title: 'Committee Meeting / Approval', desc: 'Committee reviews and approves the proposed resolution' },
        { number: '04', icon: 'bi bi-printer', title: 'Final Draft Printing', desc: 'Legislative staff prepares and prints the final draft of the resolution' },
        { number: '05', icon: 'bi bi-pen', title: 'Official Signing', desc: 'Secretary to the Sanggunian and Presiding Officer sign the resolution' },
        { number: '06', icon: 'bi bi-send-check', title: 'Posting / Transmittal', desc: 'Resolution is posted publicly and transmitted to concerned parties' },
    ];

    const infoCards = [
        { icon: 'bi bi-journal-bookmark', title: 'Ordinances', desc: 'Local laws with permanent and general application that require compliance from residents and businesses within the municipality.' },
        { icon: 'bi bi-file-earmark-text', title: 'Resolutions', desc: 'Expressions of the legislative body\'s will or opinion on specific matters, often used for commendations, requests, or policy positions.' },
        { icon: 'bi bi-people', title: 'Public Participation', desc: 'Citizens can attend Sangguniang Bayan sessions and participate in public hearings for proposed ordinances.' },
        { icon: 'bi bi-shield-check', title: 'Transparency', desc: 'All enacted ordinances and resolutions are made available to the public as part of our commitment to open governance.' },
    ];

    return (
        <>
            <PageHeader
                title="Legislative Documents"
                description="Ordinances and resolutions of the Sangguniang Bayan ng San Carlos"
                badge={{ icon: 'bi bi-bank2', label: 'Sangguniang Bayan' }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Legislative' },
                ]}
            />

            <section className="bg-muted py-20 max-[768px]:py-12">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-6 max-[768px]:grid-cols-1 max-[768px]:gap-4">
                        <Link href="/legislative/ordinance-framework" className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-foreground no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-[linear-gradient(90deg,#3a7d44_0%,#0077be_100%)] before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-2 hover:border-transparent hover:no-underline hover:shadow-[0_16px_48px_rgba(58, 125, 68,0.15)] hover:before:scale-x-100 max-[768px]:p-6 max-[575px]:p-5">
                            <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[2rem] text-white transition-transform duration-300 group-hover:scale-110 max-[768px]:mb-4 max-[768px]:h-[60px] max-[768px]:w-[60px] max-[768px]:text-[1.5rem] max-[575px]:mb-3 max-[575px]:h-[52px] max-[575px]:w-[52px] max-[575px]:rounded-[14px] max-[575px]:text-[1.25rem]"><i className="bi bi-journal-bookmark-fill"></i></div>
                            <div>
                                <h2 className="mb-3 text-[1.375rem] font-bold text-foreground max-[768px]:text-[1.25rem] max-[575px]:mb-2 max-[575px]:text-[1.125rem]">Ordinance Framework</h2>
                                <p className="mb-5 text-[0.9375rem] leading-[1.6] text-muted-foreground max-[575px]:mb-4 max-[575px]:text-sm">Municipal ordinances enacted by the Sangguniang Bayan — local laws that govern the municipality and its residents.</p>
                                <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary transition-[gap] duration-300 group-hover:gap-3"><i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i> Browse Ordinances</span>
                            </div>
                        </Link>
                        <Link href="/legislative/resolution-framework" className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-foreground no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-[linear-gradient(90deg,#3a7d44_0%,#0077be_100%)] before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-2 hover:border-transparent hover:no-underline hover:shadow-[0_16px_48px_rgba(58, 125, 68,0.15)] hover:before:scale-x-100 max-[768px]:p-6 max-[575px]:p-5">
                            <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[2rem] text-white transition-transform duration-300 group-hover:scale-110 max-[768px]:mb-4 max-[768px]:h-[60px] max-[768px]:w-[60px] max-[768px]:text-[1.5rem] max-[575px]:mb-3 max-[575px]:h-[52px] max-[575px]:w-[52px] max-[575px]:rounded-[14px] max-[575px]:text-[1.25rem]"><i className="bi bi-file-earmark-ruled-fill"></i></div>
                            <div>
                                <h2 className="mb-3 text-[1.375rem] font-bold text-foreground max-[768px]:text-[1.25rem] max-[575px]:mb-2 max-[575px]:text-[1.125rem]">Resolution Framework</h2>
                                <p className="mb-5 text-[0.9375rem] leading-[1.6] text-muted-foreground max-[575px]:mb-4 max-[575px]:text-sm">Resolutions passed by the Sangguniang Bayan expressing the will or opinion of the legislative body on various matters.</p>
                                <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary transition-[gap] duration-300 group-hover:gap-3">Browse Resolutions <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-muted py-[60px] max-[768px]:py-10">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-8 text-center">
                        <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-[5px] text-xs font-semibold text-primary"><i className="bi bi-diagram-3-fill"></i> Process Flow</span>
                        <h2 className="mb-1.5 text-[1.5rem] text-foreground max-[575px]:text-[1.25rem]">Flowchart for Legislative Proposal</h2>
                        <p className="m-0 text-[0.9375rem] text-muted-foreground">Step-by-step process for enacting ordinances and resolutions</p>
                    </div>

                    <div className="mb-8 flex justify-center gap-3 max-[768px]:mx-auto max-[768px]:w-full max-[768px]:max-w-[320px] max-[768px]:flex-col max-[768px]:items-stretch max-[768px]:gap-2">
                        <button
                            type="button"
                            className={cn(
                                'flex cursor-pointer items-center gap-2.5 rounded-lg border bg-white px-6 py-3 transition-all duration-200 hover:border-primary max-[768px]:justify-center max-[768px]:px-5 max-[768px]:py-2.5',
                                activeTab === 'ordinances' ? 'border-primary bg-primary' : 'border-black/[0.08]'
                            )}
                            onClick={() => setActiveTab('ordinances')}
                        >
                            <i className={cn('bi bi-journal-bookmark-fill text-[1.125rem]', activeTab === 'ordinances' ? 'text-white' : 'text-muted-foreground')}></i>
                            <span className={cn('text-[0.9375rem] font-semibold', activeTab === 'ordinances' ? 'text-white' : 'text-foreground')}>For Ordinances</span>
                            <small className={cn('rounded-[10px] px-2 py-0.5 text-xs', activeTab === 'ordinances' ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-muted-foreground')}>11 Steps</small>
                        </button>
                        <button
                            type="button"
                            className={cn(
                                'flex cursor-pointer items-center gap-2.5 rounded-lg border bg-white px-6 py-3 transition-all duration-200 hover:border-primary max-[768px]:justify-center max-[768px]:px-5 max-[768px]:py-2.5',
                                activeTab === 'resolutions' ? 'border-primary bg-primary' : 'border-black/[0.08]'
                            )}
                            onClick={() => setActiveTab('resolutions')}
                        >
                            <i className={cn('bi bi-file-earmark-ruled-fill text-[1.125rem]', activeTab === 'resolutions' ? 'text-white' : 'text-muted-foreground')}></i>
                            <span className={cn('text-[0.9375rem] font-semibold', activeTab === 'resolutions' ? 'text-white' : 'text-foreground')}>For Resolutions</span>
                            <small className={cn('rounded-[10px] px-2 py-0.5 text-xs', activeTab === 'resolutions' ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-muted-foreground')}>6 Steps</small>
                        </button>
                    </div>

                    <div className={cn(activeTab === 'ordinances' ? 'block' : 'hidden')}>
                        <div className="grid grid-cols-4 gap-3 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-2.5 max-[575px]:grid-cols-1">
                            {ordinanceSteps.map((step, index) => (
                                <div className="flex" key={step.number}>
                                    <div className={cn(
                                        'relative flex flex-1 flex-col rounded-lg border bg-white px-[14px] pb-[14px] pt-4 transition-all duration-200 hover:border-primary hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[768px]:px-3 max-[768px]:pb-3 max-[768px]:pt-[14px] max-[575px]:flex-row max-[575px]:items-start max-[575px]:gap-3 max-[575px]:p-3',
                                        index === ordinanceSteps.length - 1 ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.03)] hover:border-success' : 'border-black/[0.06]'
                                    )}>
                                        <div className={cn('mb-2.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.6875rem] font-bold text-white max-[575px]:mb-0 max-[575px]:mt-0.5', index === ordinanceSteps.length - 1 ? 'bg-success' : 'bg-primary')}>{step.number}</div>
                                        <div className="hidden"><i className={step.icon}></i></div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 text-[0.8125rem] font-semibold leading-[1.3] text-foreground max-[768px]:text-xs max-[575px]:text-[0.8125rem]">{step.title}</h4>
                                            <p className="m-0 text-xs leading-[1.4] text-muted-foreground max-[768px]:text-[0.6875rem] max-[575px]:text-xs">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cn(activeTab === 'resolutions' ? 'block' : 'hidden')}>
                        <div className="grid grid-cols-4 gap-3 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-2.5 max-[575px]:grid-cols-1">
                            {resolutionSteps.map((step, index) => (
                                <div className="flex" key={step.number}>
                                    <div className={cn(
                                        'relative flex flex-1 flex-col rounded-lg border bg-white px-[14px] pb-[14px] pt-4 transition-all duration-200 hover:border-primary hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[768px]:px-3 max-[768px]:pb-3 max-[768px]:pt-[14px] max-[575px]:flex-row max-[575px]:items-start max-[575px]:gap-3 max-[575px]:p-3',
                                        index === resolutionSteps.length - 1 ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.03)] hover:border-success' : 'border-black/[0.06]'
                                    )}>
                                        <div className={cn('mb-2.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.6875rem] font-bold text-white max-[575px]:mb-0 max-[575px]:mt-0.5', index === resolutionSteps.length - 1 ? 'bg-success' : 'bg-primary')}>{step.number}</div>
                                        <div className="hidden"><i className={step.icon}></i></div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 text-[0.8125rem] font-semibold leading-[1.3] text-foreground max-[768px]:text-xs max-[575px]:text-[0.8125rem]">{step.title}</h4>
                                            <p className="m-0 text-xs leading-[1.4] text-muted-foreground max-[768px]:text-[0.6875rem] max-[575px]:text-xs">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-[60px] max-[768px]:py-10">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mx-auto max-w-full">
                        <div className="mb-8 text-center">
                            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-[5px] text-xs font-semibold text-primary"><i className="bi bi-info-circle-fill"></i> About</span>
                            <h2 className="mb-1.5 text-[1.5rem] text-foreground max-[768px]:text-[1.25rem]">Understanding Local Legislation</h2>
                            <p className="m-0 text-[0.9375rem] text-muted-foreground">Learn about the legislative process of the Sangguniang Bayan</p>
                        </div>
                        <div className="grid grid-cols-4 gap-3 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-2 max-[768px]:gap-2.5 max-[575px]:grid-cols-1">
                            {infoCards.map((card) => (
                                <div className="flex flex-col rounded-lg border border-black/[0.06] bg-white p-4 text-left transition-all duration-200 hover:border-primary hover:shadow-[0_2px_12px_rgba(58, 125, 68,0.08)] max-[768px]:p-[14px] max-[575px]:flex-row max-[575px]:items-start max-[575px]:gap-3 max-[575px]:p-3" key={card.title}>
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base text-white max-[768px]:mb-2.5 max-[768px]:h-8 max-[768px]:w-8 max-[768px]:text-sm max-[575px]:mb-0 max-[575px]:shrink-0"><i className={card.icon}></i></div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="mb-1.5 text-sm font-semibold text-foreground max-[768px]:text-[0.8125rem]">{card.title}</h3>
                                        <p className="m-0 flex-1 text-xs leading-[1.5] text-muted-foreground max-[768px]:text-[0.6875rem] max-[575px]:text-xs">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
