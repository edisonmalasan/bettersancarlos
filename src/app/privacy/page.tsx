'use client';

import PageHeader from '@/components/layout/PageHeader';

export default function PrivacyPage() {
    return (
        <>
            <PageHeader
                title="Privacy Policy"
                description="How we collect, use, and protect your information"
                badge={{ icon: 'bi bi-shield-lock', label: 'Privacy' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Privacy Policy' },
                ]}
            />

            <section className="pt-[60px] pb-[80px] max-[575px]:pt-10 max-[575px]:pb-[60px]">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="grid grid-cols-[240px_1fr] items-start gap-12 max-[991px]:grid-cols-1 max-[991px]:gap-8">
                        <aside className="sticky top-[100px] rounded-[12px] border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-[991px]:static max-[991px]:hidden">
                            <h4 className="mb-4 flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] pb-3 text-[0.875rem] font-bold text-[#1a1a1a]">
                                <i className="bi bi-list-ul"></i> <span>Contents</span>
                            </h4>
                            <nav className="flex flex-col gap-1">
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#introduction">Introduction</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#legal-basis">Legal Basis</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#information-collected">Information We Collect</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#how-we-use">How We Use Information</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#cookies">Cookies & Analytics</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#data-sharing">Data Sharing</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#data-security">Data Security</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#data-retention">Data Retention</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#your-rights">Your Rights</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#childrens-privacy">Children&apos;s Privacy</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#third-party">Third-Party Links</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#changes">Policy Changes</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#contact">Contact Us</a>
                            </nav>
                        </aside>

                        <article className="w-full max-w-[800px] max-[991px]:max-w-full">
                            <section id="introduction" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Introduction</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    Better San Carlos (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
                                    protecting your privacy and ensuring the security of your personal information.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your
                                    information when you visit our website.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    This policy is designed to comply with the{' '}
                                    <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> of the
                                    Philippines and its Implementing Rules and Regulations (IRR).
                                </p>
                                <div className="my-5 flex items-center gap-3 rounded-l-none rounded-r-lg border-l-4 border-success bg-[linear-gradient(135deg,rgba(6,167,125,0.1)_0%,rgba(6,167,125,0.05)_100%)] px-5 py-4">
                                    <i className="bi bi-shield-check text-[1.25rem] text-success"></i>
                                    <span className="text-[0.9375rem] text-[#1a1a1a]">
                                        We are committed to <strong>transparency</strong> and{' '}
                                        <strong>data minimization</strong> — we only collect what is necessary.
                                    </span>
                                </div>
                            </section>

                            <section id="legal-basis" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Legal Basis for Processing</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    Under the Data Privacy Act of 2012, we process personal information based on the
                                    following lawful criteria:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Consent:</strong> When you voluntarily provide information through
                                        contact forms or email communications
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Legitimate Interest:</strong> To improve our website, ensure security,
                                        and provide better civic services
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Legal Obligation:</strong> When required by Philippine law or government
                                        authorities
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Public Interest:</strong> To promote transparency and civic engagement in
                                        local governance
                                    </li>
                                </ul>
                            </section>

                            <section id="information-collected" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Information We Collect</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We collect minimal information necessary to operate this civic platform
                                    effectively:
                                </p>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#1a1a1a]">Information You Provide Voluntarily</h3>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Email address (when you contact us or submit feedback)</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Name (if provided in correspondence)</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Message content and inquiries</li>
                                </ul>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#1a1a1a]">Information Collected Automatically</h3>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">IP address (anonymized where possible)</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Browser type and version</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Device type and operating system</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Pages visited and time spent on pages</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Referring website or source</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">General geographic location (country/region level)</li>
                                </ul>

                                <div className="my-5 flex gap-3 rounded-lg bg-muted px-5 py-4">
                                    <i className="bi bi-info-circle mt-[2px] shrink-0 text-[1rem] text-[#0077be]"></i>
                                    <p className="text-[0.875rem] leading-[1.7] text-[#666]">
                                        We do <strong>not</strong> collect sensitive personal information such as
                                        government-issued ID numbers, financial information, health records, or
                                        biometric data through this website.
                                    </p>
                                </div>
                            </section>

                            <section id="how-we-use" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">How We Use Your Information</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">We use the information we collect for the following purposes:</p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To respond to your inquiries and feedback</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To improve website functionality and user experience</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To analyze website traffic and usage patterns</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To ensure website security and prevent abuse</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To comply with legal obligations</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">To maintain and improve civic services information</li>
                                </ul>
                            </section>

                            <section id="cookies" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Cookies and Analytics</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We use cookies and similar technologies to enhance your browsing experience:
                                </p>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#1a1a1a]">Types of Cookies We Use</h3>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Essential Cookies:</strong> Required for basic website functionality
                                        (e.g., language preferences)
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Analytics Cookies:</strong> Help us understand how visitors interact
                                        with our website
                                    </li>
                                </ul>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#1a1a1a]">Google Analytics</h3>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We use Google Analytics to collect anonymized data about website usage. Google
                                    Analytics uses cookies to collect information such as:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Number of visitors and page views</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Traffic sources and user flow</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Device and browser information</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Geographic location (country/city level)</li>
                                </ul>

                                <div className="my-6 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white p-5 max-[575px]:p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                                        <i className="bi bi-gear"></i>
                                        <span>Managing Cookies</span>
                                    </h4>
                                    <ul className="m-0 list-none p-0">
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">You can disable cookies through your browser settings</li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">
                                            You can opt out of Google Analytics by installing the{' '}
                                            <a
                                                className="text-primary"
                                                href="https://tools.google.com/dlpage/gaoptout"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Google Analytics Opt-out Browser Add-on
                                            </a>
                                        </li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">Disabling cookies may affect some website functionality</li>
                                    </ul>
                                </div>
                            </section>

                            <section id="data-sharing" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Data Sharing and Disclosure</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We do not sell, trade, or rent your personal information to third parties. We
                                    may share information only in the following circumstances:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Service Providers:</strong> With trusted third-party services (e.g.,
                                        web hosting, analytics) that assist in operating our website, subject to
                                        confidentiality agreements
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Legal Requirements:</strong> When required by law, court order, or
                                        government authority under Philippine jurisdiction
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Protection of Rights:</strong> To protect the rights, property, or safety
                                        of Better San Carlos, our users, or the public
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Consent:</strong> With your explicit consent for any other purpose
                                    </li>
                                </ul>
                            </section>

                            <section id="data-security" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Data Security</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We implement appropriate technical and organizational measures to protect your
                                    personal information, including:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">SSL/TLS encryption for data transmission</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Secure hosting infrastructure</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Regular security assessments</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Access controls and authentication</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Regular software updates and patches</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    While we strive to protect your information, no method of transmission over the
                                    Internet or electronic storage is 100% secure. We cannot guarantee absolute security
                                    but are committed to maintaining industry-standard protections.
                                </p>
                            </section>

                            <section id="data-retention" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Data Retention</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We retain personal information only for as long as necessary to fulfill the
                                    purposes outlined in this policy:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Contact Information:</strong> Retained for the duration needed to
                                        respond to inquiries, then deleted within 1 year of last contact
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Analytics Data:</strong> Aggregated and anonymized data may be retained
                                        indefinitely for statistical purposes
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Server Logs:</strong> Automatically deleted after 90 days
                                    </li>
                                </ul>
                            </section>

                            <section id="your-rights" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Your Rights Under the Data Privacy Act</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    Under the Data Privacy Act of 2012, you have the following rights regarding your
                                    personal information:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Be Informed:</strong> To be informed of the collection and
                                        processing of your personal data
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Access:</strong> To request access to your personal data held by
                                        us
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Object:</strong> To object to the processing of your personal
                                        data
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Erasure or Blocking:</strong> To request deletion or blocking of
                                        your personal data
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Rectification:</strong> To request correction of inaccurate or
                                        incomplete personal data
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Data Portability:</strong> To obtain your personal data in a
                                        structured, commonly used format
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to File a Complaint:</strong> To file a complaint with the National
                                        Privacy Commission (NPC)
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        <strong>Right to Damages:</strong> To be indemnified for damages sustained due
                                        to inaccurate, incomplete, outdated, false, unlawfully obtained, or
                                        unauthorized use of personal data
                                    </li>
                                </ul>

                                <div className="my-6 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white p-5 max-[575px]:p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                                        <i className="bi bi-person-check"></i>
                                        <span>Exercising Your Rights</span>
                                    </h4>
                                    <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                        To exercise any of these rights, please contact us at{' '}
                                        <a className="text-primary" href="mailto:volunteer@bettersancarlos.vercel.app">volunteer@bettersancarlos.vercel.app</a>. We
                                        will respond to your request within 30 days as required by law.
                                    </p>
                                </div>
                            </section>

                            <section id="childrens-privacy" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Children&apos;s Privacy</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    Better San Carlos is a general audience website providing civic information. We do
                                    not knowingly collect personal information from children under 18 years of age
                                    without parental consent.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    If you are a parent or guardian and believe your child has provided us with
                                    personal information, please contact us immediately at{' '}
                                    <a className="text-primary" href="mailto:volunteer@bettersancarlos.vercel.app">volunteer@bettersancarlos.vercel.app</a>, and we
                                    will take steps to delete such information.
                                </p>
                            </section>

                            <section id="third-party" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Third-Party Links</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    Our website may contain links to external websites, including official government
                                    portals and other resources. We are not responsible for the privacy practices or
                                    content of these third-party sites.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We encourage you to review the privacy policies of any external websites you visit
                                    through links on our platform.
                                </p>
                            </section>

                            <section id="changes" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Changes to This Privacy Policy</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    We may update this Privacy Policy from time to time to reflect changes in our
                                    practices, legal requirements, or for other operational reasons. When we make
                                    changes:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">The &quot;Last Updated&quot; date at the bottom of this page will be revised</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Material changes may be announced on our website</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#1a1a1a] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Your continued use of the website after changes constitutes acceptance of the
                                        updated policy
                                    </li>
                                </ul>
                            </section>

                            <section id="contact" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#1a1a1a] max-[575px]:text-[1.25rem]">Contact Us</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    If you have questions about this Privacy Policy, wish to exercise your data
                                    privacy rights, or have concerns about how your information is handled, please
                                    contact us:
                                </p>
                                <div className="my-6">
                                    <a href="mailto:volunteer@bettersancarlos.vercel.app" className="inline-flex items-center gap-[10px] rounded-lg bg-[linear-gradient(135deg,#0032a0_0%,#003d82_100%)] px-6 py-[14px] text-[0.9375rem] font-medium text-white no-underline transition-all duration-200 hover:-translate-y-[2px] hover:text-white hover:no-underline hover:shadow-[0_4px_16px_rgba(0,50,160,0.25)]">
                                        <i className="bi bi-envelope-fill text-[1.125rem]"></i>
                                        <span>volunteer@bettersancarlos.vercel.app</span>
                                    </a>
                                </div>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#1a1a1a]">National Privacy Commission</h3>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#1a1a1a] last:mb-0">
                                    You may also file a complaint with the National Privacy Commission if you believe
                                    your data privacy rights have been violated:
                                </p>
                                <div className="my-5 flex gap-3 rounded-lg bg-muted px-5 py-4">
                                    <i className="bi bi-building mt-[2px] shrink-0 text-[1rem] text-[#0077be]"></i>
                                    <p className="text-[0.875rem] leading-[1.7] text-[#666]">
                                        <strong>National Privacy Commission</strong>
                                        <br />
                                        3rd Floor, Core G, GSIS Headquarters Building
                                        <br />
                                        Financial Center, Pasay City 1308
                                        <br />
                                        Website:{' '}
                                        <a className="text-primary" href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer">
                                            www.privacy.gov.ph
                                        </a>
                                    </p>
                                </div>

                                <p className="mb-0 mt-6 border-t border-[rgba(0,0,0,0.06)] pt-6 text-[0.9375rem] italic leading-[1.7] text-[#666]">Last Updated: December 2, 2025</p>
                            </section>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
