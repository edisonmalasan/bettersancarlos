'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function TaxPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Tax & Payment Services"
        description="Taxes, fees, and property payments in San Carlos City."
        badge={{ icon: 'bi bi-cash-coin', label: 'Tax & Payments' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Tax & Payment Services' },
        ]}
      />

      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          {/* Service links */}
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            <Link
              href="/service-details/municipal-treasurer"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-cash-stack"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Municipal Treasurer&apos;s Office</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Tax collection, cedula, clearances, and payment services
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link
              href="/service-details/municipal-assessor"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-clipboard-data"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Municipal Assessor&apos;s Office</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Property assessment, tax declaration, and land records
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link
              href="/service-details/property-declaration"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-house-add"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Property Declaration</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Declaration of land, building, and machineries for tax assessment
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>

          {/* eBPLS + forms */}
          <div className="mt-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <a
              href="https://prod4.ebpls.com/sancarlospangasinan/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[rgba(34,197,94,0.1)] text-xl text-primary">
                <i className="bi bi-globe"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
                  eBPLS Online Portal
                  <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(34,197,94,0.1)] px-2 py-[2px] text-[0.6875rem] font-semibold text-[#16a34a]">
                    <i className="bi bi-patch-check-fill"></i> Verified
                  </span>
                </span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  The city&apos;s Electronic Business Permit &amp; Licensing System — the verified online transactions
                  portal on the official LGU website.
                </span>
              </span>
              <i className="bi bi-box-arrow-up-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </a>
            <Link
              href="/budget"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-file-earmark-text"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Forms &amp; Citizen&apos;s Charter</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Assessor&apos;s forms (FAAS building/land/machinery) and permit forms are listed under the city&apos;s
                  transparency pages; per-service fees and requirements are in the Citizen&apos;s Charter offices list.
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>

          {/* No-online-payment note */}
          <div className="mt-6 rounded-xl border border-line bg-white p-6 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
              <i className="bi bi-credit-card-2-front"></i> No online tax payment yet
            </span>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              The city has no verified online tax-payment portal — the only verified online transactions channel is the
              eBPLS business-permit system above. Taxes and fees are paid at the Treasurer&apos;s Office; call the
              verified City Hall trunk line (075) 600-1432 for current payment procedures.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
