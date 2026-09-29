'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { containerClass, sectionClass } from '@/components/layout/Container';
import ServiceEntry from '@/components/layout/ServiceEntry';

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

      <section className={sectionClass}>
        <div className={containerClass}>
          {/* Service links */}
          <ul className="m-0 list-none border-t border-line p-0">
            <ServiceEntry
              href="/service-details/municipal-treasurer"
              title="Municipal Treasurer's Office"
              description="Tax collection, cedula, clearances, and payment services"
            />
            <ServiceEntry
              href="/service-details/municipal-assessor"
              title="Municipal Assessor's Office"
              description="Property assessment, tax declaration, and land records"
            />
            <ServiceEntry
              href="/service-details/property-declaration"
              title="Property Declaration"
              description="Declaration of land, building, and machineries for tax assessment"
            />
          </ul>

          {/* eBPLS + forms */}
          <ul className="mt-6 m-0 list-none border-t border-line p-0">
            <ServiceEntry
              external
              href="https://prod4.ebpls.com/sancarlospangasinan/index.php"
              title="eBPLS Online Portal"
              status="Verified"
              description="The city's Electronic Business Permit & Licensing System — the verified online transactions portal on the official LGU website."
            />
            <ServiceEntry
              href="/budget"
              title="Forms & Citizen's Charter"
              description="Assessor's forms (FAAS building/land/machinery) and permit forms are listed under the city's transparency pages; per-service fees and requirements are in the Citizen's Charter offices list."
            />
          </ul>

          {/* No-online-payment note */}
          <div className="mt-6 border-t border-line pt-6">
            <h3 className="m-0 mb-2 text-base font-semibold text-foreground">
              No online tax payment yet
            </h3>
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
