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

            <section className="section">
                <div className="container">
                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon"><i className="bi bi-house-door"></i></span>
                            <h2>Main Navigation</h2>
                        </div>
                        <div className="sitemap-links-grid">
                            <Link href="/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i> <span>Home</span>
                            </Link>
                            <Link href="/services/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Services</span>
                            </Link>
                            <Link href="/government/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Government</span>
                            </Link>
                            <Link href="/statistics/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Statistics</span>
                            </Link>
                            <Link href="/legislative/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Legislative</span>
                            </Link>
                            <Link href="/budget/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Transparency</span>
                            </Link>
                            <Link href="/contact/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Contact</span>
                            </Link>
                            <Link href="/news/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i> <span>News</span>
                            </Link>
                            <Link href="/faq/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i> FAQ
                            </Link>
                            <Link href="/accessibility/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i> Accessibility
                            </Link>
                        </div>
                    </div>

                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon"><i className="bi bi-grid-3x3-gap"></i></span>
                            <h2>Service Categories</h2>
                        </div>
                        <div className="sitemap-links-grid">
                            <Link href="/services/certificates" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Certificates &amp; Vital Records</span>
                            </Link>
                            <Link href="/services/business" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Business Services</span>
                            </Link>
                            <Link href="/services/social-services" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Social Services</span>
                            </Link>
                            <Link href="/services/health" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Health &amp; Wellness</span>
                            </Link>
                            <Link href="/services/tax-payments" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Tax &amp; Payments</span>
                            </Link>
                            <Link href="/services/agriculture" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Agriculture</span>
                            </Link>
                            <Link href="/services/infrastructure" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Infrastructure</span>
                            </Link>
                            <Link href="/services/education" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Education</span>
                            </Link>
                            <Link href="/services/environment" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Environment</span>
                            </Link>
                            <Link href="/services/public-safety" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Public Safety</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon"><i className="bi bi-building"></i></span>
                            <h2>Municipal Offices</h2>
                        </div>
                        <div className="sitemap-links-grid sitemap-links-grid--4col">
                            <Link href="/service-details/civil-registrar" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Local Civil Registrar</span>
                            </Link>
                            <Link href="/service-details/municipal-treasurer" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Treasurer's Office</span>
                            </Link>
                            <Link href="/service-details/municipal-assessor" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Assessor's Office</span>
                            </Link>
                            <Link href="/service-details/municipal-budget" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Budget Office</span>
                            </Link>
                            <Link href="/service-details/municipal-accounting" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Accounting Office</span>
                            </Link>
                            <Link href="/service-details/municipal-engineering" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Engineering Office</span>
                            </Link>
                            <Link href="/service-details/municipal-planning" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Planning Office</span>
                            </Link>
                            <Link href="/service-details/municipal-agriculture" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Agriculture Office</span>
                            </Link>
                            <Link href="/service-details/mswdo-services" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i> MSWDO
                            </Link>
                            <Link href="/service-details/business-permits-licensing" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>BPLS Office</span>
                            </Link>
                            <Link href="/service-details/general-services" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>General Services</span>
                            </Link>
                            <Link href="/service-details/human-resource-management" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>HR Management</span>
                            </Link>
                            <Link href="/service-details/seedo-public-market" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>SEEDO Public Market</span>
                            </Link>
                            <Link href="/service-details/seedo-slaughterhouse" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>SEEDO Slaughterhouse</span>
                            </Link>
                            <Link href="/service-details/tricycle-franchising" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Tricycle Franchising</span>
                            </Link>
                            <Link href="/service-details/property-declaration" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Property Declaration</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon"><i className="bi bi-bank"></i></span>
                            <h2>Government &amp; Legislative</h2>
                        </div>
                        <div className="sitemap-links-grid">
                            <Link href="/government/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Government Structure</span>
                            </Link>
                            <Link href="/government/officials" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Elected Officials</span>
                            </Link>
                            <Link href="/legislative/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Legislative Documents</span>
                            </Link>
                            <Link href="/legislative/ordinance-framework" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Ordinance Framework</span>
                            </Link>
                            <Link href="/legislative/resolution-framework" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Resolution Framework</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon sitemap-section-icon--online">
                                <i className="bi bi-globe2"></i>
                            </span>
                            <h2>Online Services</h2>
                            <span className="sitemap-badge">via Filipizen</span>
                        </div>
                        <div className="sitemap-links-grid">
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Business Billing &amp; Payment</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/newbusiness"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>New Business Application</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/bpls/renewbusiness"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Business Permit Renewal</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/rptis/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Real Property Tax Payment</span>
                            </a>
                            <a
                                href="https://www.filipizen.com/partners/sancarlospangasinan/po/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Online Payment Order</span>
                            </a>
                        </div>
                    </div>

                    <div className="sitemap-section-new">
                        <div className="sitemap-section-header">
                            <span className="sitemap-section-icon"><i className="bi bi-link-45deg"></i></span>
                            <h2>External Resources</h2>
                        </div>
                        <div className="sitemap-links-grid">
                            <a
                                href="https://sancarlospangasinan.gov.ph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Official San Carlos Website</span>
                            </a>
                            <a
                                href="https://sangguniangbayan.sancarlospangasinan.gov.ph/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Sangguniang Bayan</span>
                            </a>
                            <a
                                href="https://www.facebook.com/sccp.cio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sitemap-link-item sitemap-link-item--external"
                            >
                                <i className="bi bi-box-arrow-up-right"></i>
                                <span>Facebook Page</span>
                            </a>
                            <Link href="/terms/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Terms of Use</span>
                            </Link>
                            <Link href="/privacy/" className="sitemap-link-item">
                                <i className="bi bi-arrow-right"></i>
                                <span>Privacy Policy</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
