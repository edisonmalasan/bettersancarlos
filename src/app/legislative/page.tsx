'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

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

            <section className="leg-categories">
                <div className="container">
                    <div className="leg-categories-grid">
                        <Link href="/legislative/ordinance-framework" className="leg-category-card">
                            <div className="leg-category-icon"><i className="bi bi-journal-bookmark-fill"></i></div>
                            <div className="leg-category-content">
                                <h2>Ordinance Framework</h2>
                                <p>Municipal ordinances enacted by the Sangguniang Bayan — local laws that govern the municipality and its residents.</p>
                                <span className="leg-category-link"><i className="bi bi-arrow-right"></i> Browse Ordinances</span>
                            </div>
                        </Link>
                        <Link href="/legislative/resolution-framework" className="leg-category-card">
                            <div className="leg-category-icon"><i className="bi bi-file-earmark-ruled-fill"></i></div>
                            <div className="leg-category-content">
                                <h2>Resolution Framework</h2>
                                <p>Resolutions passed by the Sangguniang Bayan expressing the will or opinion of the legislative body on various matters.</p>
                                <span className="leg-category-link">Browse Resolutions <i className="bi bi-arrow-right"></i></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="leg-process">
                <div className="container">
                    <div className="leg-process-header">
                        <span className="leg-info-tag"><i className="bi bi-diagram-3-fill"></i> Process Flow</span>
                        <h2>Flowchart for Legislative Proposal</h2>
                        <p>Step-by-step process for enacting ordinances and resolutions</p>
                    </div>

                    <div className="leg-process-tabs">
                        <button
                            type="button"
                            className={`leg-tab-btn${activeTab === 'ordinances' ? ' active' : ''}`}
                            onClick={() => setActiveTab('ordinances')}
                        >
                            <i className="bi bi-journal-bookmark-fill"></i>
                            <span>For Ordinances</span>
                            <small>11 Steps</small>
                        </button>
                        <button
                            type="button"
                            className={`leg-tab-btn${activeTab === 'resolutions' ? ' active' : ''}`}
                            onClick={() => setActiveTab('resolutions')}
                        >
                            <i className="bi bi-file-earmark-ruled-fill"></i>
                            <span>For Resolutions</span>
                            <small>6 Steps</small>
                        </button>
                    </div>

                    <div className={`leg-tab-content${activeTab === 'ordinances' ? ' active' : ''}`}>
                        <div className="leg-flow-container">
                            {ordinanceSteps.map((step, index) => (
                                <div className={`leg-flow-step${index === ordinanceSteps.length - 1 ? ' leg-flow-final' : ''}`} key={step.number}>
                                    <div className={`leg-flow-card${index === ordinanceSteps.length - 1 ? ' leg-flow-card-final' : ''}`}>
                                        <div className="leg-flow-number">{step.number}</div>
                                        <div className="leg-flow-icon"><i className={step.icon}></i></div>
                                        <h4>{step.title}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`leg-tab-content${activeTab === 'resolutions' ? ' active' : ''}`}>
                        <div className="leg-flow-container">
                            {resolutionSteps.map((step, index) => (
                                <div className={`leg-flow-step${index === resolutionSteps.length - 1 ? ' leg-flow-final' : ''}`} key={step.number}>
                                    <div className={`leg-flow-card${index === resolutionSteps.length - 1 ? ' leg-flow-card-final' : ''}`}>
                                        <div className="leg-flow-number">{step.number}</div>
                                        <div className="leg-flow-icon"><i className={step.icon}></i></div>
                                        <h4>{step.title}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="leg-info">
                <div className="container">
                    <div className="leg-info-content">
                        <div className="leg-info-header">
                            <span className="leg-info-tag"><i className="bi bi-info-circle-fill"></i> About</span>
                            <h2>Understanding Local Legislation</h2>
                            <p>Learn about the legislative process of the Sangguniang Bayan</p>
                        </div>
                        <div className="leg-info-cards">
                            {infoCards.map((card) => (
                                <div className="leg-info-card" key={card.title}>
                                    <div className="leg-info-card-icon"><i className={card.icon}></i></div>
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
