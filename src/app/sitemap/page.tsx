'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function SitemapPage() {
    return (
        <>
            <PageHeader
                title="Sitemap"
                description="Navigate all pages and services of Better San Carlos"
                badge={{ icon: 'bi bi-diagram-3-fill', label: 'Navigation' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Sitemap' },
                ]}
            />

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#275230] max-[768px]:h-8 max-[768px]:w-8"><i className="bi bi-house-door text-base text-white max-[768px]:text-sm"></i></span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">Main Navigation</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-2 max-[1200px]:grid-cols-4 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <Link href="/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i> <span>Home</span>
                            </Link>
                            <Link href="/services/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Services</span>
                            </Link>
                            <Link href="/government/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Government</span>
                            </Link>
                            <Link href="/statistics/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Statistics</span>
                            </Link>
                            <Link href="/legislative/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Legislative</span>
                            </Link>
                            <Link href="/budget/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Transparency</span>
                            </Link>
                            <Link href="/contact/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Contact</span>
                            </Link>
                            <Link href="/news/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i> <span>News</span>
                            </Link>
                            <Link href="/faq/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i> FAQ
                            </Link>
                            <Link href="/accessibility/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i> Accessibility
                            </Link>
                        </div>
                    </div>

                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#275230] max-[768px]:h-8 max-[768px]:w-8"><i className="bi bi-grid-3x3-gap text-base text-white max-[768px]:text-sm"></i></span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">Service Categories</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-2 max-[1200px]:grid-cols-4 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <Link href="/services/certificates" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Certificates &amp; Vital Records</span>
                            </Link>
                            <Link href="/services/business" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Business Services</span>
                            </Link>
                            <Link href="/services/social-services" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Social Services</span>
                            </Link>
                            <Link href="/services/health" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Health &amp; Wellness</span>
                            </Link>
                            <Link href="/services/tax-payments" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Tax &amp; Payments</span>
                            </Link>
                            <Link href="/services/agriculture" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Agriculture</span>
                            </Link>
                            <Link href="/services/infrastructure" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Infrastructure</span>
                            </Link>
                            <Link href="/services/education" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Education</span>
                            </Link>
                            <Link href="/services/environment" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Environment</span>
                            </Link>
                            <Link href="/services/public-safety" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Public Safety</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#275230] max-[768px]:h-8 max-[768px]:w-8"><i className="bi bi-building text-base text-white max-[768px]:text-sm"></i></span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">Municipal Offices</h2>
                        </div>
                        <div className="grid grid-cols-4 gap-2 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <Link href="/service-details/civil-registrar" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Local Civil Registrar</span>
                            </Link>
                            <Link href="/service-details/municipal-treasurer" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Treasurer's Office</span>
                            </Link>
                            <Link href="/service-details/municipal-assessor" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Assessor's Office</span>
                            </Link>
                            <Link href="/service-details/municipal-budget" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Budget Office</span>
                            </Link>
                            <Link href="/service-details/municipal-accounting" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Accounting Office</span>
                            </Link>
                            <Link href="/service-details/municipal-engineering" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Engineering Office</span>
                            </Link>
                            <Link href="/service-details/municipal-planning" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Planning Office</span>
                            </Link>
                            <Link href="/service-details/municipal-agriculture" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Agriculture Office</span>
                            </Link>
                            <Link href="/service-details/mswdo-services" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i> MSWDO
                            </Link>
                            <Link href="/service-details/business-permits-licensing" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>BPLS Office</span>
                            </Link>
                            <Link href="/service-details/general-services" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>General Services</span>
                            </Link>
                            <Link href="/service-details/human-resource-management" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>HR Management</span>
                            </Link>
                            <Link href="/service-details/seedo-public-market" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>SEEDO Public Market</span>
                            </Link>
                            <Link href="/service-details/seedo-slaughterhouse" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>SEEDO Slaughterhouse</span>
                            </Link>
                            <Link href="/service-details/tricycle-franchising" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Tricycle Franchising</span>
                            </Link>
                            <Link href="/service-details/property-declaration" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Property Declaration</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#275230] max-[768px]:h-8 max-[768px]:w-8"><i className="bi bi-bank text-base text-white max-[768px]:text-sm"></i></span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">Government &amp; Legislative</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-2 max-[1200px]:grid-cols-4 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <Link href="/government/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Government Structure</span>
                            </Link>
                            <Link href="/government/officials" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Elected Officials</span>
                            </Link>
                            <Link href="/legislative/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Legislative Documents</span>
                            </Link>
                            <Link href="/legislative/ordinance-framework" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Ordinance Framework</span>
                            </Link>
                            <Link href="/legislative/resolution-framework" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Resolution Framework</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-success to-[#2f6136] max-[768px]:h-8 max-[768px]:w-8">
                                <i className="bi bi-globe2 text-base text-white max-[768px]:text-sm"></i>
                            </span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">Online Services</h2>
                            <span className="inline-flex items-center rounded-full bg-[#e6f4ea] px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.5px] text-success">via Filipizen</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 max-[1200px]:grid-cols-4 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Business Billing &amp; Payment</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/newbusiness"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>New Business Application</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/renewbusiness"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Business Permit Renewal</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/rptis/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Real Property Tax Payment</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/po/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Online Payment Order</span>
                            </a>
                        </div>
                    </div>

                    <div className="mb-12 last:mb-0">
                        <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#275230] max-[768px]:h-8 max-[768px]:w-8"><i className="bi bi-link-45deg text-base text-white max-[768px]:text-sm"></i></span>
                            <h2 className="m-0 text-[1.125rem] font-semibold text-foreground max-[768px]:text-base">External Resources</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-2 max-[1200px]:grid-cols-4 max-[992px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
                            <a
                                href="https://sancarlospangasinan.gov.ph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Official San Carlos Website</span>
                            </a>
                            <a
                                href="https://sangguniangbayan.sancarlospangasinan.gov.ph/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Sangguniang Bayan</span>
                            </a>
                            <a
                                href="https://www.facebook.com/sccp.cio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-[#fafafa] px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-success hover:bg-[rgba(58, 125, 68,0.06)] hover:text-success hover:no-underline max-[480px]:py-3"
                            >
                                <i className="bi bi-box-arrow-up-right text-xs text-muted-foreground transition-colors group-hover:text-success"></i>
                                <span>Facebook Page</span>
                            </a>
                            <Link href="/terms/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Terms of Use</span>
                            </Link>
                            <Link href="/privacy/" className="group flex items-center gap-2 rounded-lg border border-[#e2e8e0] bg-white px-[14px] py-2.5 text-[0.8125rem] font-medium text-foreground no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary hover:no-underline max-[480px]:py-3">
                                <i className="bi bi-arrow-right text-xs text-muted-foreground transition-colors group-hover:text-primary"></i>
                                <span>Privacy Policy</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
