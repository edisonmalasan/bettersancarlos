'use client';

import PageHeader from '@/components/layout/PageHeader';
import ServiceEntry from '@/components/layout/ServiceEntry';
import CharterPointer from '@/components/layout/CharterPointer';
import { containerClass, sectionClass } from '@/components/layout/Container';


export default function SocialServicesPage() {
  return (
    <>
      <PageHeader
        title="Social Services"
        description="Support programs for vulnerable sectors and communities."
        badge={{ icon: 'bi bi-people-fill', label: 'Social Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Social Services' },
        ]}
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          <ul className="m-0 list-none p-0">
            <ServiceEntry
              href="/service-details/mswdo-services"
              title="Senior Citizen ID"
              description="ID card and benefits for citizens 60 years and above"
            />
            <ServiceEntry
              href="/service-details/mswdo-services"
              title="PWD ID & Services"
              description="ID and benefits for persons with disabilities"
            />
            <ServiceEntry
              href="/service-details/mswdo-services"
              title="Financial Assistance"
              description="Emergency financial aid for qualified residents"
            />
            <ServiceEntry
              href="/service-details/mswdo-services"
              title="Burial Assistance"
              description="Financial assistance for burial expenses"
            />
            <ServiceEntry
              href="/service-details/mswdo-services"
              title="Solo Parent ID"
              description="ID and benefits for solo parents"
            />
          </ul>
        </div>
      </section>

      {/* Citizen's Charter pointer */}
      <section className={sectionClass} aria-label="Fees and requirements">
        <div className={containerClass}>
          <CharterPointer />
        </div>
      </section>
    </>
  );
}
