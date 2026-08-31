'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { departmentLinks } from '@/lib/contact';

export default function ContactPage() {
    return (
        <>
            <PageHeader
                title="Contact Us"
                description="We're here to help. Reach out to us through any of these channels."
                badge={{ icon: 'bi bi-envelope-fill', label: 'Contact' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Contact' },
                ]}
            />

            <section className="section">
                <div className="container">
                    <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                        <Link href="mailto:CIO@sancarlospangasinan.com" className="contact-card">
                            <div className="contact-card-icon"><i className="bi bi-envelope-fill"></i></div>
                            <div className="contact-card-content">
                                <h3>Email</h3>
                                <p className="contact-card-value">CIO@sancarlospangasinan.com</p>
                                <span className="contact-card-note">We'll respond within 24 hours</span>
                            </div>
                        </Link>
                        <Link href="tel:(075) 600-1432" className="contact-card">
                            <div className="contact-card-icon"><i className="bi bi-phone-fill"></i></div>
                            <div className="contact-card-content">
                                <h3>Mobile</h3>
                                <p className="contact-card-value">0917-701-2268</p>
                                <span className="contact-card-note">Mon-Fri: 8:00 AM - 5:00 PM</span>
                            </div>
                        </Link>
                        <Link href="tel:0623312067" className="contact-card">
                            <div className="contact-card-icon"><i className="bi bi-telephone-fill"></i></div>
                            <div className="contact-card-content">
                                <h3>Phone</h3>
                                <p className="contact-card-value">(062) 331-2067</p>
                                <span className="contact-card-note">Mon-Fri: 8:00 AM - 5:00 PM</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="office-hours-section">
                <div className="container">
                    <div className="office-hours-inner">
                        <div className="office-hours-header">
                            <i className="bi bi-clock-fill"></i>
                            <h2>Office Hours</h2>
                        </div>
                        <div className="office-hours-schedule">
                            <div className="office-hours-item office-hours-item--open">
                                <span className="office-hours-day">Monday - Friday</span>
                                <span className="office-hours-time">8:00 AM - 5:00 PM</span>
                                <span className="office-hours-status">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>Open</span>
                                </span>
                            </div>
                            <div className="office-hours-item office-hours-item--break">
                                <span className="office-hours-day">Lunch Break</span>
                                <span className="office-hours-time">12:00 PM - 1:00 PM</span>
                                <span className="office-hours-status">
                                    <i className="bi bi-pause-circle-fill"></i>
                                    <span>Break</span>
                                </span>
                            </div>
                            <div className="office-hours-item office-hours-item--closed">
                                <span className="office-hours-day">Saturday &amp; Sunday</span>
                                <span className="office-hours-time">Closed</span>
                                <span className="office-hours-status">
                                    <i className="bi bi-x-circle-fill"></i>
                                    <span>Closed</span>
                                </span>
                            </div>
                            <div className="office-hours-item office-hours-item--closed">
                                <span className="office-hours-day">National &amp; Local Holidays</span>
                                <span className="office-hours-time">Closed</span>
                                <span className="office-hours-status">
                                    <i className="bi bi-x-circle-fill"></i>
                                    <span>Closed</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="hotlines-header">
                        <div className="hotlines-title">
                            <span className="hotlines-badge">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <span>Emergency</span>
                            </span>
                            <h2>Emergency Hotlines</h2>
                        </div>
                        <p>For emergencies and inquiries, contact these numbers anytime.</p>
                    </div>
                    <div className="hotlines-grid">
                        <a href="tel:(075) 600-1432" className="hotline-card">
                            <i className="bi bi-building-fill"></i>
                            <span>Mayor's Office 0917 701 2268</span>
                        </a>
                        <a href="tel:(075) 600-1432" className="hotline-card">
                            <i className="bi bi-building"></i>
                            <span>Vice Mayor's Office 0920 925 6688</span>
                        </a>
                        <a href="tel:0623312067" className="hotline-card">
                            <i className="bi bi-telephone-fill"></i>
                            <span>Municipal Office (062) 331-2067</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="section bg-alt">
                <div className="container">
                    <div className="hotlines-header">
                        <div className="hotlines-title">
                            <span className="hotlines-badge hotlines-badge--medical">
                                <i className="bi bi-hospital-fill"></i>
                                <span>Medical</span>
                            </span>
                            <h2>Medical Emergency Hotlines</h2>
                        </div>
                        <p>For medical emergencies and hospital inquiries.</p>
                    </div>
                    <div className="hotlines-grid">
                        <a href="tel:(075) 600-1432" className="hotline-card hotline-card--medical">
                            <i className="bi bi-hospital"></i>
                            <span>RHU San Carlos 0917 701 2268</span>
                        </a>
                        <a href="tel:0623312067" className="hotline-card hotline-card--medical">
                            <i className="bi bi-truck"></i>
                            <span>Ambulance (062) 331-2067</span>
                        </a>
                        <a href="tel:0623312067" className="hotline-card hotline-card--medical">
                            <i className="bi bi-hospital"></i>
                            <span>Medical Emergency (062) 331-2067</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="hotlines-header">
                        <div className="hotlines-title">
                            <span className="hotlines-badge hotlines-badge--social">
                                <i className="bi bi-facebook"></i>
                                <span>Social</span>
                            </span>
                            <h2>Department & Service Pages</h2>
                        </div>
                        <p>Follow and reach out to municipal services and partner offices on Facebook.</p>
                    </div>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                        {departmentLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm transition hover:border-primary-shadcn hover:bg-blue-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shadcn focus-visible:ring-offset-2"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary-shadcn transition group-hover:bg-white">
                                        <i className={`${link.icon} text-xl`}></i>
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                                        {link.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section bg-alt">
                <div className="container">
                    <p className="data-source">
                        <i className="bi bi-info-circle"></i>
                        Source: Contact details and social links scraped from the official City of San Carlos, Pangasinan website (
                        <Link href="https://sancarlospangasinan.gov.ph/contact/" target="_blank" rel="noopener noreferrer">sancarlospangasinan.gov.ph/contact/</Link>
                        ) on July 28, 2026.
                    </p>
                </div>
            </section>
        </>
    );
}
