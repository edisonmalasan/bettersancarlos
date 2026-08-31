'use client';

import PageHeader from '@/components/layout/PageHeader';

export default function AccessibilityPage() {
    return (
        <>
            <PageHeader
                title="Accessibility Statement"
                description="Our commitment to digital accessibility for all citizens"
                badge={{ icon: 'bi bi-universal-access', label: 'Accessibility' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Accessibility' },
                ]}
            />

            <section className="section">
                <div className="container">
                    <div className="a11y-container">
                        <div className="a11y-badge-section">
                            <div className="a11y-conformance-badge">
                                <i className="bi bi-check-circle-fill"></i>
                                <div>
                                    <span className="a11y-badge-label">WCAG 2.1 Level AA</span>
                                    <span className="a11y-badge-text">Conformant</span>
                                </div>
                            </div>
                        </div>

                        <div className="a11y-section">
                            <h2>Our Commitment</h2>
                            <p>
                                Better San Carlos is committed to ensuring digital accessibility for people with
                                disabilities. We are continually improving the user experience for everyone and
                                applying the relevant accessibility standards.
                            </p>
                        </div>

                        <div className="a11y-section">
                            <h2>Accessibility Features</h2>
                            <div className="a11y-features-grid">
                                <div className="a11y-feature">
                                    <i className="bi bi-keyboard"></i>
                                    <h3>Keyboard Navigation</h3>
                                    <p>All functionality available using only a keyboard.</p>
                                </div>
                                <div className="a11y-feature">
                                    <i className="bi bi-eye"></i>
                                    <h3>Screen Reader Support</h3>
                                    <p>Compatible with JAWS, NVDA, and VoiceOver.</p>
                                </div>
                                <div className="a11y-feature">
                                    <i className="bi bi-type"></i>
                                    <h3>Text Alternatives</h3>
                                    <p>All images have descriptive alt text.</p>
                                </div>
                                <div className="a11y-feature">
                                    <i className="bi bi-palette"></i>
                                    <h3>Color Contrast</h3>
                                    <p>Meets WCAG AA contrast requirements.</p>
                                </div>
                                <div className="a11y-feature">
                                    <i className="bi bi-phone"></i>
                                    <h3>Responsive Design</h3>
                                    <p>Works on all devices and screen sizes.</p>
                                </div>
                                <div className="a11y-feature">
                                    <i className="bi bi-hourglass-split"></i>
                                    <h3>No Time Limits</h3>
                                    <p>No time limits on reading or interacting.</p>
                                </div>
                            </div>
                        </div>

                        <div className="a11y-section">
                            <h2>Known Limitations</h2>
                            <ul className="a11y-list">
                                <li>
                                    <i className="bi bi-exclamation-circle"></i>
                                    <span>
                                        Some PDF documents may not be fully accessible to screen readers
                                    </span>
                                </li>
                                <li>
                                    <i className="bi bi-exclamation-circle"></i>
                                    <span>
                                        Some third-party embedded content may have accessibility issues
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="a11y-section">
                            <h2>Alternative Access</h2>
                            <p>
                                If you encounter difficulty accessing any information, contact us:
                            </p>
                            <div className="a11y-contact-grid">
                                <a href="mailto:volunteer@bettersancarlos.vercel.app" className="a11y-contact-item">
                                    <i className="bi bi-envelope-fill"></i>
                                    <span>volunteer@bettersancarlos.vercel.app</span>
                                </a>
                            </div>
                        </div>

                        <div className="a11y-section">
                            <h2>Technical Specifications</h2>
                            <div className="a11y-tech-tags">
                                <span className="a11y-tag">HTML5</span>
                                <span className="a11y-tag">CSS3</span>
                                <span className="a11y-tag">JavaScript</span>
                                <span className="a11y-tag">React</span>
                                <span className="a11y-tag">TypeScript</span>
                                <span className="a11y-tag">ARIA</span>
                            </div>
                        </div>

                        <div className="a11y-promise">
                            <i className="bi bi-heart-fill"></i>
                            <div>
                                <h3>Our Promise</h3>
                                <p>
                                    Better San Carlos is committed to ensuring that our digital services are accessible to
                                    all citizens, regardless of ability. We view accessibility not as a feature, but
                                    as a fundamental right.
                                </p>
                            </div>
                        </div>

                        <p className="a11y-date">Last updated: November 29, 2025</p>
                    </div>
                </div>
            </section>
        </>
    );
}
