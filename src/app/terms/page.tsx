'use client';

import PageHeader from '@/components/layout/PageHeader';

export default function TermsPage() {
    return (
        <>
            <PageHeader
                title="Terms of Use"
                description="Guidelines for using Better San Carlos"
                badge={{ icon: 'bi bi-file-earmark-text', label: 'Legal' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Terms of Use' },
                ]}
            />

            <section className="pt-[60px] pb-[80px] max-[575px]:pt-10 max-[575px]:pb-[60px]">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
                    <div className="grid grid-cols-[240px_1fr] items-start gap-12 max-[991px]:grid-cols-1 max-[991px]:gap-8">
                        <aside className="sticky top-[100px] rounded-[12px] border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-[991px]:static max-[991px]:hidden">
                            <h4 className="mb-4 flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] pb-3 text-[0.875rem] font-bold text-[#2f3e46]">
                                <i className="bi bi-list-ul"></i> <span>Contents</span>
                            </h4>
                            <nav className="flex flex-col gap-1">
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#introduction">Introduction</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#acceptance">Acceptance of Terms</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#public-domain">Public Domain Content</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#disclaimer">&quot;As Is&quot; Disclaimer</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#limitation">Limitation of Liability</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#responsibilities">User Responsibilities</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#no-advice">No Professional Advice</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#external-links">External References</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#availability">Website Availability</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#indemnification">Indemnification</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#modifications">Modifications</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#governing-law">Governing Law</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#severability">Severability</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#takedown">Content Concerns</a>
                                <a className="block rounded-md px-3 py-2 text-[0.8125rem] text-[#666] no-underline transition-all duration-200 hover:bg-muted hover:text-primary hover:no-underline" href="#contact">Contact Information</a>
                            </nav>
                        </aside>

                        <article className="w-full max-w-[800px] max-[991px]:max-w-full">
                            <section id="introduction" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Introduction</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Better San Carlos is a civic platform dedicated to empowering the people of San Carlos
                                    by providing transparent access to the services, programs, and public funds of LGU
                                    San Carlos.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    While volunteers make every effort to secure Better San Carlos from online threats
                                    and keep information accurate, no system can be guaranteed to be perfectly secure,
                                    error-free, or completely up-to-date at all times.
                                </p>
                                <div className="my-5 flex items-center gap-3 rounded-l-none rounded-r-lg border-l-4 border-success bg-[linear-gradient(135deg,rgba(58, 125, 68,0.1)_0%,rgba(58, 125, 68,0.05)_100%)] px-5 py-4">
                                    <i className="bi bi-heart-fill text-[1.25rem] text-success"></i>
                                    <span className="text-[0.9375rem] text-[#2f3e46]">
                                        This platform is provided <strong>free of charge</strong> as a public
                                        service.
                                    </span>
                                </div>
                            </section>

                            <section id="acceptance" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Acceptance of Terms</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    By accessing and using this website, you acknowledge and agree to be bound by
                                    these terms and conditions. Your continued use of the site signifies your ongoing
                                    acceptance of this agreement.
                                </p>
                            </section>

                            <section id="public-domain" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Public Domain Content and Volunteer Operation</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    This website and its content are provided as a public domain resource and are
                                    operated entirely by volunteers. All information, data, documents, and materials
                                    on this website are in the public domain unless otherwise stated.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Public domain content may be freely used, copied, distributed, and modified
                                    without permission or attribution, although attribution to Better San Carlos and
                                    LGU San Carlos is encouraged as a civic courtesy.
                                </p>
                                <div className="my-5 flex gap-3 rounded-lg bg-muted px-5 py-4">
                                    <i className="bi bi-info-circle mt-[2px] shrink-0 text-[1rem] text-[#0077be]"></i>
                                    <p className="text-[0.875rem] leading-[1.7] text-[#666]">
                                        As a volunteer-run initiative, this website does not replace official government
                                        channels. Residents and stakeholders are encouraged to conduct their own
                                        independent research and verification of all information found here and to
                                        consult official LGU San Carlos offices and government agencies when making
                                        important decisions.
                                    </p>
                                </div>
                            </section>

                            <section id="disclaimer" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">&quot;As Is&quot; Disclaimer</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    All information on this website is provided &quot;AS IS&quot; without warranty of any kind,
                                    whether express or implied. This includes, but is not limited to:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Warranties of merchantability</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Fitness for a particular purpose</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Non-infringement of intellectual property rights</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Accuracy, completeness, or reliability of information</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Freedom from errors, viruses, or other harmful components</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Users should treat all content as informational and not as a substitute for
                                    official records or professional advice.
                                </p>
                            </section>

                            <section id="limitation" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Limitation of Liability</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    To the fullest extent permitted by law, the website operators, volunteers,
                                    contributors, and any affiliated civic partners shall not be liable for any
                                    direct, indirect, incidental, special, consequential, or punitive damages arising
                                    from or related to:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Your use of or reliance on this website or its content</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Any errors, omissions, or outdated information</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Any interruption, suspension, or cessation of website availability</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Any bugs, viruses, or other harmful components transmitted through the site</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Any loss, corruption, or disclosure of data or information</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    This limitation applies regardless of the form of action or legal theory,
                                    including contract, tort, negligence, or strict liability.
                                </p>
                            </section>

                            <section id="responsibilities" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">User Responsibilities and Research Guidelines</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Users share responsibility for promoting informed and responsible civic
                                    engagement. By using this website, you are solely responsible for:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Independently verifying all information obtained from this website</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Reviewing and visiting original source links and references provided</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Cross-checking information with multiple reliable and official sources before
                                        making decisions
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Determining whether the information is suitable for your intended use</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Complying with all applicable laws, regulations, and local ordinances</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Accepting any consequences that may arise from your use of the website and its
                                        content
                                    </li>
                                </ul>
                                <div className="my-6 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white p-5 max-[575px]:p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                                        <i className="bi bi-lightbulb"></i>
                                        <span>You are strongly encouraged to:</span>
                                    </h4>
                                    <ul className="m-0 list-none p-0">
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">
                                            Use the source links and references on each page to access primary documents
                                            and official records
                                        </li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">Conduct additional research beyond what is presented on this website</li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">
                                            Consult official government websites, offices, and agencies for the most
                                            current information
                                        </li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">Verify dates, figures, and other details through multiple reputable sources</li>
                                    </ul>
                                </div>
                            </section>

                            <section id="no-advice" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">No Professional Advice</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    The information on this website is provided for educational, informational, and
                                    civic transparency purposes only. It does not constitute legal, medical,
                                    financial, or any other form of professional advice.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Users should consult qualified professionals or appropriate government offices for
                                    advice specific to their circumstances.
                                </p>
                            </section>

                            <section id="external-links" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Source Links and External References</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    This website may provide links to official sources, government documents, and
                                    other authoritative materials to support civic awareness and transparency. Users
                                    are encouraged to:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Click through and review all source links provided</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Access primary documents and official publications referenced</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Verify information directly from original and official sources</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Check for updates, amendments, or corrections to referenced materials</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    The continued availability, accuracy, and reliability of external links cannot be
                                    guaranteed. Links may change or become unavailable without notice, and users
                                    should always confirm information through official channels.
                                </p>
                            </section>

                            <section id="availability" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Website Availability</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Although volunteers aim to keep the website accessible and functional,
                                    Better San Carlos cannot guarantee that the website will be:
                                </p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Available or accessible at all times</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Error-free or uninterrupted</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Free from technical problems, vulnerabilities, or disruptions</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Fully compatible with all devices, browsers, or assistive technologies</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Users are encouraged to report technical issues and broken links so volunteers can
                                    address them as resources allow.
                                </p>
                            </section>

                            <section id="indemnification" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Indemnification</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    By using this website, you agree to indemnify and hold harmless the website
                                    operators, volunteers, contributors, and affiliated civic partners from any
                                    claims, damages, losses, liabilities, or expenses (including reasonable legal
                                    fees) arising from your use of the website or your violation of these terms.
                                </p>
                            </section>

                            <section id="modifications" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Modifications</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    These terms may be updated or modified from time to time to reflect legal
                                    requirements, policy changes, or improvements to civic services. Changes may be made
                                    without prior notice. Your continued use of the website after any changes are
                                    posted constitutes your acceptance of the updated terms.
                                </p>
                            </section>

                            <section id="governing-law" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Governing Law</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    These terms are governed by and construed in accordance with the laws of the
                                    Republic of the Philippines, without regard to any conflict of law principles. Any
                                    disputes arising in connection with these terms or your use of the website shall
                                    be subject to the jurisdiction of the appropriate courts in the Philippines.
                                </p>
                            </section>

                            <section id="severability" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Severability</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    If any provision of these terms is found to be invalid, unlawful, or
                                    unenforceable, that provision shall be applied to the greatest extent permitted by
                                    law, and the remaining provisions shall remain in full force and effect.
                                </p>
                            </section>

                            <section id="takedown" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Content Concerns and Takedown Requests</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Better San Carlos values accuracy, public safety, and respect for rights. Despite
                                    good-faith efforts, some content may become outdated, incomplete, or raise
                                    legitimate concerns.
                                </p>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">If you believe that any content on this website is:</p>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Factually incorrect or misleading</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Potentially harmful or dangerous</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">In violation of applicable laws or regulations</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Containing personal information that should not be public</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Infringing upon legitimate rights or interests</li>
                                </ul>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    Please contact us at:{" "}
                                    <a className="text-primary" href="mailto:volunteer@bettersancarlos.vercel.app">volunteer@bettersancarlos.vercel.app</a>
                                </p>

                                <div className="my-6 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white p-5 max-[575px]:p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                                        <i className="bi bi-envelope"></i>
                                        <span>When reaching out, kindly include:</span>
                                    </h4>
                                    <ul className="m-0 list-none p-0">
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">The specific URL or page location</li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">A clear description of your concern</li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">Supporting documentation or evidence, where applicable</li>
                                        <li className="relative mb-2 pl-5 text-[0.875rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:text-primary before:content-['→'] last:mb-0">Your contact information for follow-up</li>
                                    </ul>
                                </div>

                                <h3 className="mb-3 mt-6 text-[1.125rem] font-bold text-[#2f3e46]">Our Response Process</h3>
                                <ul className="my-4 list-none p-0">
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Legitimate concerns will be reviewed in good faith by volunteers.</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">Response times may vary due to the volunteer nature of this initiative.</li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Content may be removed, corrected, updated, or accompanied by additional
                                        disclaimers as appropriate.
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Editorial decisions about content rest with the website team, guided by public
                                        interest and civic responsibility.
                                    </li>
                                    <li className="relative mb-[10px] pl-6 text-[0.9375rem] leading-[1.6] text-[#2f3e46] before:absolute before:left-0 before:top-[10px] before:h-[6px] before:w-[6px] before:rounded-full before:bg-primary before:content-['']">
                                        Knowingly false, malicious, or frivolous complaints may result in restricted
                                        communication with our volunteers.
                                    </li>
                                </ul>
                            </section>

                            <section id="contact" className="mb-12 border-b border-[rgba(0,0,0,0.06)] pb-12 last:mb-0 last:border-0 last:pb-0 max-[575px]:mb-8 max-[575px]:pb-8">
                                <h2 className="mb-4 inline-block border-b-2 border-primary pb-3 text-[1.5rem] font-bold text-[#2f3e46] max-[575px]:text-[1.25rem]">Contact Information</h2>
                                <p className="mb-4 text-[0.9375rem] leading-[1.7] text-[#2f3e46] last:mb-0">
                                    For questions about these terms, feedback on civic information, or content-related
                                    concerns, please contact:
                                </p>
                                <div className="my-6">
                                    <a href="mailto:volunteer@bettersancarlos.vercel.app" className="inline-flex items-center gap-[10px] rounded-lg bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-6 py-[14px] text-[0.9375rem] font-medium text-white no-underline transition-all duration-200 hover:-translate-y-[2px] hover:text-white hover:no-underline hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.25)]">
                                        <i className="bi bi-envelope-fill text-[1.125rem]"></i>
                                        <span>volunteer@bettersancarlos.vercel.app</span>
                                    </a>
                                </div>
                                <p className="mb-0 mt-6 border-t border-[rgba(0,0,0,0.06)] pt-6 text-[0.9375rem] italic leading-[1.7] text-[#666]">
                                    Better San Carlos provides public domain information to support civic engagement,
                                    transparency, and informed participation in local governance.
                                </p>
                            </section>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
