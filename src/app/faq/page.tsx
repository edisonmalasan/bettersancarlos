'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function FAQPage() {
    return (
        <>
            <PageHeader
                title="Frequently Asked Questions"
                description="Find answers to common questions about municipal services"
                badge={{ icon: 'bi bi-question-circle-fill', label: 'FAQ' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'FAQ' },
                ]}
            />

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mx-auto max-w-[800px]">
                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-info-circle-fill text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">General Questions</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        What are the office hours of the Municipal Hall?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            The Municipal Hall is open Monday to Friday, 8:00 AM to 5:00 PM, with a lunch
                                            break from 12:00 PM to 1:00 PM. We are closed on weekends and national/local
                                            holidays.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        How can I contact a specific municipal office?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Visit our{" "}
                                            <Link href="/government/">Government Directory</Link>{" "}
                                            page to find contact information for all municipal offices and department
                                            heads.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        Can I request services online?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Currently, most services require in-person applications. However, we are
                                            working on implementing online services for select transactions. Check
                                            individual service pages for updates.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-file-earmark-text-fill text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">Certificates &amp; Documents</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        How long does it take to get a birth certificate?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            For birth certificates registered in San Carlos, it typically takes 15-30 minutes
                                            while you wait, provided the record is readily available.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        Can someone else request my certificate for me?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>Yes, but they must bring:</p>
                                        <ul>
                                            <li>An authorization letter signed by you</li>
                                            <li>Valid ID of both you and the representative</li>
                                            <li>Photocopy of your valid ID</li>
                                        </ul>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        What is the difference between PSA and local civil registrar certificates?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Both are certified true copies. PSA certificates are the nationally-recognized
                                            version required for passport and visa applications. Local civil registrar
                                            certificates are accepted for most local transactions and are often processed
                                            faster.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-shop text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">Business &amp; Permits</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        When should I renew my business permit?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Business permits must be renewed annually, preferably in January. The deadline
                                            for penalty-free renewal is typically January 20th of each year.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        What do I need to start a new business in San Carlos?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            To start a new business, you&apos;ll need:
                                        </p>
                                        <ul>
                                            <li>
                                                DTI Registration (for sole proprietorship) or SEC Registration (for
                                                corporation)
                                            </li>
                                            <li>Barangay Clearance</li>
                                            <li>Community Tax Certificate (Cedula)</li>
                                            <li>Location Sketch/Map</li>
                                            <li>Contract of Lease (if renting)</li>
                                        </ul>
                                        <p>
                                            Visit our{" "}
                                            <Link href="/services/business">Business Permit page</Link>{" "}
                                            for complete details.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-cash-coin text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">Payments &amp; Fees</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        What payment methods are accepted?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Currently, we accept cash payments at the Municipal Treasurer&apos;s Office. We are
                                            working on implementing online payment options for taxes and fees.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        How can I pay my real property tax?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Visit the Municipal Treasurer&apos;s Office at the Municipal Hall with your Tax
                                            Declaration or latest Official Receipt. Payment is in cash. Property taxes
                                            are due quarterly, but you may pay annually to avail of discounts.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-people-fill text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">Social Services</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        How do I apply for a Senior Citizen ID?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Go to the Municipal Social Welfare and Development Office (MSWDO) with:
                                        </p>
                                        <ul>
                                            <li>
                                                Birth Certificate or any valid ID showing your age (60 and above)
                                            </li>
                                            <li>1x1 ID photo</li>
                                            <li>Barangay Residence Certificate</li>
                                        </ul>
                                        <p>The ID is issued for free.</p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        What benefits do senior citizens receive?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Senior citizens enjoy 20% discount and VAT exemption on purchases (with a
                                            minimum purchase amount per establishment), priority lanes, and access to
                                            special programs and medical assistance from the municipality.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-gear-fill text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">Technical Questions</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        I found a broken link or error on this website. How do I report it?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Thank you for helping us improve! Please send us message at{" "}
                                            <a href="mailto:volunteer@bettersancarlos.vercel.app">volunteer@bettersancarlos.vercel.app</a>
                                            {" "}and write &quot;Website Issue&quot; as the subject. Describe the problem and include the
                                            page URL if possible.
                                        </p>
                                    </div>
                                </details>
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        Is this website mobile-friendly?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            Yes! Better San Carlos is fully responsive and optimized for mobile phones,
                                            tablets, and desktop computers.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3 border-b-2 border-muted pb-4">
                                <i className="bi bi-person-badge-fill text-[1.25rem] text-primary"></i>
                                <h2 className="m-0 text-[1.125rem] text-foreground">About the Developer</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <details className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors duration-200 hover:bg-muted group-open:border-b group-open:border-[#e5e7eb] [&::-webkit-details-marker]:hidden">
                                        Who developed Better San Carlos?
                                        <i aria-hidden="true" className="bi bi-chevron-down shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"></i>
                                    </summary>
                                    <div className="px-5 py-4 leading-[1.6] text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-3 [&>ul]:pl-5 [&_li]:mb-1.5 [&_li]:list-disc">
                                        <p>
                                            <a
                                                href="https://edisonmalasan.me/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Edison
                                            </a>
                                            {" "}is the developer behind{" "}
                                            <a href="https://abakada.org" target="_blank" rel="noopener noreferrer">
                                                Abakada.org
                                            </a>
                                            {" "}and Better San Carlos, a community-driven initiative building a digital bridge
                                            between the residents of San Carlos and the local government of San Carlos. Based in
                                            the United Arab Emirates, he works in IT and practices full-stack development,
                                            helping build practical digital solutions in web development, design, cloud
                                            services, and cybersecurity.
                                        </p>
                                        <p>
                                            He also started{" "}
                                            <a href="https://hellopinas.com" target="_blank" rel="noopener noreferrer">
                                                HelloPinas.com
                                            </a>
                                            , a small cloud-based solutions initiative. Edison contributes to{" "}
                                            <a href="https://bettergov.ph" target="_blank" rel="noopener noreferrer">
                                                BetterGov.ph
                                            </a>
                                            , a volunteer-driven civic-tech effort focused on improving access to local
                                            government information and services in the Philippines.
                                        </p>
                                        <p>
                                            He is also an individual participant of the{" "}
                                            <a href="https://openjsf.org/" target="_blank" rel="noopener noreferrer">
                                                OpenJS Foundation
                                            </a>
                                            , a nonprofit supporting open-source JavaScript communities worldwide.
                                        </p>
                                        <p>
                                            Edison has made the San Carlos Project open source under MIT | CC BY 4.0 to empower
                                            community-driven development, and contributions are warmly welcomed from
                                            everyone; whether you are a developer, data researcher, designer, content
                                            writer, translator, or a concerned citizen of San Carlos, your participation helps
                                            shape the project for all.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-6 rounded-xl bg-gradient-to-br from-primary to-[#275230] p-8 text-white max-[768px]:flex-col max-[768px]:text-center">
                            <i className="bi bi-chat-dots-fill text-[2rem] opacity-80"></i>
                            <div className="flex-1">
                                <h3 className="m-0 mb-1 text-[1.125rem] text-white">Still have questions?</h3>
                                <p className="m-0 text-[0.9375rem] opacity-90">
                                    If you didn&apos;t find the answer you were looking for, please don&apos;t hesitate to
                                    contact us.
                                </p>
                            </div>
                            <Link href="/contact/" className="inline-block shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-primary no-underline transition-colors duration-200 hover:bg-muted hover:no-underline">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
