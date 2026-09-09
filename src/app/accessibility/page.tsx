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

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="mx-auto w-full max-w-[800px]">
                        <div className="mb-12 flex justify-center">
                            <div className="inline-flex items-center gap-3 rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#2f6136_100%)] px-6 py-4 text-white">
                                <i className="bi bi-check-circle-fill text-[2rem]"></i>
                                <div>
                                    <span className="block text-[0.75rem] uppercase tracking-[0.5px] opacity-90">WCAG 2.1 Level AA</span>
                                    <span className="block text-[1.25rem] font-bold">Conformant</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="mb-6 border-b-2 border-[#faf9f6] pb-4 text-[1.25rem] font-bold text-foreground">Our Commitment</h2>
                            <p className="mb-4 leading-[1.6] text-muted-foreground">
                                Better San Carlos is committed to ensuring digital accessibility for people with
                                disabilities. We are continually improving the user experience for everyone and
                                applying the relevant accessibility standards.
                            </p>
                        </div>

                        <div className="mb-12">
                            <h2 className="mb-6 border-b-2 border-[#faf9f6] pb-4 text-[1.25rem] font-bold text-foreground">Accessibility Features</h2>
                            <div className="grid grid-cols-3 gap-4 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1">
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-keyboard mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">Keyboard Navigation</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">All functionality available using only a keyboard.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-eye mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">Screen Reader Support</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">Compatible with JAWS, NVDA, and VoiceOver.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-type mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">Text Alternatives</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">All images have descriptive alt text.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-palette mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">Color Contrast</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">Meets WCAG AA contrast requirements.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-phone mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">Responsive Design</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">Works on all devices and screen sizes.</p>
                                </div>
                                <div className="rounded-lg bg-muted p-6 text-center">
                                    <i className="bi bi-hourglass-split mb-2 text-[1.5rem] text-primary"></i>
                                    <h3 className="m-0 mb-1 text-[0.875rem] font-bold text-foreground">No Time Limits</h3>
                                    <p className="m-0 text-[0.8125rem] text-muted-foreground">No time limits on reading or interacting.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="mb-6 border-b-2 border-[#faf9f6] pb-4 text-[1.25rem] font-bold text-foreground">Known Limitations</h2>
                            <ul className="list-none p-0">
                                <li className="flex items-start gap-3 border-b border-line py-3 text-muted-foreground last:border-0">
                                    <i className="bi bi-exclamation-circle mt-[2px] text-accent"></i>
                                    <span>
                                        Some PDF documents may not be fully accessible to screen readers
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 border-b border-line py-3 text-muted-foreground last:border-0">
                                    <i className="bi bi-exclamation-circle mt-[2px] text-accent"></i>
                                    <span>
                                        Some third-party embedded content may have accessibility issues
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="mb-12">
                            <h2 className="mb-6 border-b-2 border-[#faf9f6] pb-4 text-[1.25rem] font-bold text-foreground">Alternative Access</h2>
                            <p className="mb-4 leading-[1.6] text-muted-foreground">
                                If you encounter difficulty accessing any information, contact us:
                            </p>
                            <div className="mt-6 grid grid-cols-3 gap-4 max-[992px]:grid-cols-1">
                                <a href="mailto:volunteer@bettersancarlos.vercel.app" className="group flex items-center gap-3 rounded-lg bg-muted p-4 text-foreground no-underline transition-[border-color,background-color,box-shadow,transform] duration-200 hover:bg-primary hover:text-white hover:no-underline">
                                    <i className="bi bi-envelope-fill text-[1.25rem] text-primary group-hover:text-white"></i>
                                    <span className="text-[0.9375rem] font-medium">volunteer@bettersancarlos.vercel.app</span>
                                </a>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="mb-6 border-b-2 border-[#faf9f6] pb-4 text-[1.25rem] font-bold text-foreground">Technical Specifications</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">HTML5</span>
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">CSS3</span>
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">JavaScript</span>
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">React</span>
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">TypeScript</span>
                                <span className="rounded-full bg-muted px-4 py-2 text-[0.875rem] font-medium text-foreground">ARIA</span>
                            </div>
                        </div>

                        <div className="mt-12 flex items-start gap-6 rounded-xl bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] p-8 text-white max-[768px]:flex-col max-[768px]:text-center">
                            <i className="bi bi-heart-fill text-[1.5rem] opacity-80"></i>
                            <div>
                                <h3 className="m-0 mb-2 text-[1.125rem] font-bold text-white">Our Promise</h3>
                                <p className="m-0 leading-[1.6] text-[rgba(255,255,255,0.9)]">
                                    Better San Carlos is committed to ensuring that our digital services are accessible to
                                    all citizens, regardless of ability. We view accessibility not as a feature, but
                                    as a fundamental right.
                                </p>
                            </div>
                        </div>

                        <p className="mb-4 mt-8 text-center text-[0.875rem] text-muted-foreground">Last updated: November 29, 2025</p>
                    </div>
                </div>
            </section>
        </>
    );
}
