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

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]" style={{ gap: 'var(--spacing-md)' }}>
                        <Link href="mailto:CIO@sancarlospangasinan.com" className="flex overflow-hidden rounded-xl border border-[#e2e8e0] bg-white text-foreground no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                            <div className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-br from-primary to-[#275230] text-[1.25rem] text-white"><i className="bi bi-envelope-fill"></i></div>
                            <div className="flex-1 p-6">
                                <h3 className="m-0 mb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-muted-foreground">Email</h3>
                                <p className="m-0 mb-1 text-base font-semibold text-foreground">CIO@sancarlospangasinan.com</p>
                                <span className="text-[0.8125rem] text-muted-foreground">We'll respond within 24 hours</span>
                            </div>
                        </Link>
                        <Link href="tel:(075) 600-1432" className="flex overflow-hidden rounded-xl border border-[#e2e8e0] bg-white text-foreground no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                            <div className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-br from-primary to-[#275230] text-[1.25rem] text-white"><i className="bi bi-phone-fill"></i></div>
                            <div className="flex-1 p-6">
                                <h3 className="m-0 mb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-muted-foreground">Mobile</h3>
                                <p className="m-0 mb-1 text-base font-semibold text-foreground">0917-701-2268</p>
                                <span className="text-[0.8125rem] text-muted-foreground">Mon-Fri: 8:00 AM - 5:00 PM</span>
                            </div>
                        </Link>
                        <Link href="tel:0623312067" className="flex overflow-hidden rounded-xl border border-[#e2e8e0] bg-white text-foreground no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                            <div className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-br from-primary to-[#275230] text-[1.25rem] text-white"><i className="bi bi-telephone-fill"></i></div>
                            <div className="flex-1 p-6">
                                <h3 className="m-0 mb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-muted-foreground">Phone</h3>
                                <p className="m-0 mb-1 text-base font-semibold text-foreground">(062) 331-2067</p>
                                <span className="text-[0.8125rem] text-muted-foreground">Mon-Fri: 8:00 AM - 5:00 PM</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-muted py-8">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="overflow-hidden rounded-xl border border-[#e2e8e0] bg-white">
                        <div className="flex items-center gap-4 bg-gradient-to-br from-primary to-[#275230] px-8 py-6 text-white max-[576px]:px-4 max-[576px]:py-4">
                            <i className="bi bi-clock-fill text-[1.25rem]"></i>
                            <h2 className="m-0 text-[1.125rem] text-white">Office Hours</h2>
                        </div>
                        <div className="grid grid-cols-4 max-[992px]:grid-cols-2 max-[576px]:grid-cols-1">
                            <div className="flex flex-col items-center border-r border-[#e2e8e0] p-6 text-center last:border-r-0 max-[992px]:border-b max-[992px]:[&:nth-child(2)]:border-r-0 min-[577px]:max-[992px]:[&:nth-last-child(-n+2)]:border-b-0 max-[576px]:border-r-0 max-[576px]:[&:nth-last-child(-n+2)]:border-b max-[576px]:last:border-b-0">
                                <span className="mb-1 text-sm font-semibold text-foreground">Monday - Friday</span>
                                <span className="mb-2 text-base font-bold text-primary">8:00 AM - 5:00 PM</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-semibold text-[#15803d]">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>Open</span>
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-r border-[#e2e8e0] p-6 text-center last:border-r-0 max-[992px]:border-b max-[992px]:[&:nth-child(2)]:border-r-0 min-[577px]:max-[992px]:[&:nth-last-child(-n+2)]:border-b-0 max-[576px]:border-r-0 max-[576px]:[&:nth-last-child(-n+2)]:border-b max-[576px]:last:border-b-0">
                                <span className="mb-1 text-sm font-semibold text-foreground">Lunch Break</span>
                                <span className="mb-2 text-base font-bold text-primary">12:00 PM - 1:00 PM</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#b45309]">
                                    <i className="bi bi-pause-circle-fill"></i>
                                    <span>Break</span>
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-r border-[#e2e8e0] p-6 text-center last:border-r-0 max-[992px]:border-b max-[992px]:[&:nth-child(2)]:border-r-0 min-[577px]:max-[992px]:[&:nth-last-child(-n+2)]:border-b-0 max-[576px]:border-r-0 max-[576px]:[&:nth-last-child(-n+2)]:border-b max-[576px]:last:border-b-0">
                                <span className="mb-1 text-sm font-semibold text-foreground">Saturday &amp; Sunday</span>
                                <span className="mb-2 text-base font-bold text-muted-foreground">Closed</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fee2e2] px-2.5 py-1 text-xs font-semibold text-[#dc2626]">
                                    <i className="bi bi-x-circle-fill"></i>
                                    <span>Closed</span>
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-r border-[#e2e8e0] p-6 text-center last:border-r-0 max-[992px]:border-b max-[992px]:[&:nth-child(2)]:border-r-0 min-[577px]:max-[992px]:[&:nth-last-child(-n+2)]:border-b-0 max-[576px]:border-r-0 max-[576px]:[&:nth-last-child(-n+2)]:border-b max-[576px]:last:border-b-0">
                                <span className="mb-1 text-sm font-semibold text-foreground">National &amp; Local Holidays</span>
                                <span className="mb-2 text-base font-bold text-muted-foreground">Closed</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fee2e2] px-2.5 py-1 text-xs font-semibold text-[#dc2626]">
                                    <i className="bi bi-x-circle-fill"></i>
                                    <span>Closed</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-4 max-[576px]:flex-col max-[576px]:items-start max-[576px]:gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#dc2626]">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <span>Emergency</span>
                            </span>
                            <h2 className="m-0 text-[1.25rem]">Emergency Hotlines</h2>
                        </div>
                        <p className="m-0 text-[0.9375rem] text-muted-foreground">For emergencies and inquiries, contact these numbers anytime.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-[992px]:grid-cols-2 max-[576px]:grid-cols-1">
                        <a href="tel:(075) 600-1432" className="flex items-center gap-3 rounded-lg border border-[#e2e8e0] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#dc2626] hover:bg-[#fef2f2] hover:no-underline">
                            <i className="bi bi-building-fill shrink-0 text-base text-[#dc2626]"></i>
                            <span>Mayor's Office 0917 701 2268</span>
                        </a>
                        <a href="tel:(075) 600-1432" className="flex items-center gap-3 rounded-lg border border-[#e2e8e0] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#dc2626] hover:bg-[#fef2f2] hover:no-underline">
                            <i className="bi bi-building shrink-0 text-base text-[#dc2626]"></i>
                            <span>Vice Mayor's Office 0920 925 6688</span>
                        </a>
                        <a href="tel:0623312067" className="flex items-center gap-3 rounded-lg border border-[#e2e8e0] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#dc2626] hover:bg-[#fef2f2] hover:no-underline">
                            <i className="bi bi-telephone-fill shrink-0 text-base text-[#dc2626]"></i>
                            <span>Municipal Office (062) 331-2067</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-4 max-[576px]:flex-col max-[576px]:items-start max-[576px]:gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#0077be] to-[#0066a0] px-3 py-1 text-xs font-semibold text-white">
                                <i className="bi bi-hospital-fill text-white"></i>
                                <span>Medical</span>
                            </span>
                            <h2 className="m-0 text-[1.25rem]">Medical Emergency Hotlines</h2>
                        </div>
                        <p className="m-0 text-[0.9375rem] text-muted-foreground">For medical emergencies and hospital inquiries.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-[992px]:grid-cols-2 max-[576px]:grid-cols-1">
                        <a href="tel:(075) 600-1432" className="flex items-center gap-3 rounded-lg border border-[#bfdbfe] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#0077be] hover:bg-[#eff6ff] hover:no-underline">
                            <i className="bi bi-hospital shrink-0 text-base text-[#0077be]"></i>
                            <span>RHU San Carlos 0917 701 2268</span>
                        </a>
                        <a href="tel:0623312067" className="flex items-center gap-3 rounded-lg border border-[#bfdbfe] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#0077be] hover:bg-[#eff6ff] hover:no-underline">
                            <i className="bi bi-truck shrink-0 text-base text-[#0077be]"></i>
                            <span>Ambulance (062) 331-2067</span>
                        </a>
                        <a href="tel:0623312067" className="flex items-center gap-3 rounded-lg border border-[#bfdbfe] bg-white px-4 py-3 text-foreground no-underline transition-all duration-200 hover:border-[#0077be] hover:bg-[#eff6ff] hover:no-underline">
                            <i className="bi bi-hospital shrink-0 text-base text-[#0077be]"></i>
                            <span>Medical Emergency (062) 331-2067</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-4 max-[576px]:flex-col max-[576px]:items-start max-[576px]:gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-[#1877f2] px-3 py-1 text-xs font-semibold text-white">
                                <i className="bi bi-facebook text-white"></i>
                                <span>Social</span>
                            </span>
                            <h2 className="m-0 text-[1.25rem]">Department & Service Pages</h2>
                        </div>
                        <p className="m-0 text-[0.9375rem] text-muted-foreground">Follow and reach out to municipal services and partner offices on Facebook.</p>
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

            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <p className="mt-4 text-sm text-muted-foreground">
                        <i className="bi bi-info-circle mr-1"></i>
                        Source: Contact details and social links scraped from the official City of San Carlos, Pangasinan website (
                        <Link href="https://sancarlospangasinan.gov.ph/contact/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sancarlospangasinan.gov.ph/contact/</Link>
                        ) on July 28, 2026.
                    </p>
                </div>
            </section>
        </>
    );
}
