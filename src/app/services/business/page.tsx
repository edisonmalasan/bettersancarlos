'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';

export default function BusinessPage() {
  return (
    <>
      <PageHeader
        title="Business Services"
        description="Permits, licenses, and support for businesses in San Carlos."
        badge={{ icon: 'bi bi-shop', label: 'Business' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business Services' },
        ]}
      />

      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          {/* eBPLS verified link card */}
          <a
            href="https://prod4.ebpls.com/sancarlospangasinan/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] sm:p-8"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[rgba(34,197,94,0.1)] text-xl text-primary">
              <i className="bi bi-globe"></i>
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
                eBPLS — Online Business Permit &amp; Licensing
                <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(34,197,94,0.1)] px-2 py-[2px] text-[0.6875rem] font-semibold text-[#16a34a]">
                  <i className="bi bi-patch-check-fill"></i> Verified
                </span>
              </span>
              <span className="block text-[0.875rem] text-muted-foreground">
                Process business permits online through the city&apos;s official Electronic Business Permit and Licensing
                System (linked from the official LGU website).
              </span>
            </span>
            <i className="bi bi-box-arrow-up-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
          </a>

          {/* Service links */}
          <div className="mt-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <Link
              href="/service-details/business-permits-licensing"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-file-earmark-check"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Business Permits &amp; Licensing Office</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  New permits, renewals, Mayor&apos;s clearance, and other business permits
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link
              href="/service-details/seedo-public-market"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-storefront"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">SEEDO — Public Market</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Public market enterprise development office services
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>

          {/* Citizen's Charter pointer */}
          <div className="mt-6 rounded-xl border border-line bg-white p-6 sm:p-8">
            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-journal-text"></i> Registering a business
            </h3>
            <p className="m-0 mb-3 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              Business registration is handled through the City Mayor&apos;s Office (Business One-Stop Shop), listed in the
              city&apos;s Citizen&apos;s Charter along with the Treasurer&apos;s, Assessor&apos;s, and other permit-related
              offices. The charter&apos;s per-service requirements, fees, and processing times are published on the
              city&apos;s transparency pages.
            </p>
            <DirectoryLinkCard
              href="/budget"
              icon="bi bi-shield-check"
              title="Transparency & Full Disclosure"
              description="Transparency Seal, Citizen's Charter offices, FDP reports, and e-services"
            />
          </div>
        </div>
      </section>
    </>
  );
}
